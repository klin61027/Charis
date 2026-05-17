import secrets
import time
import random
from flask import Blueprint, jsonify, request
from psycopg2.extras import RealDictCursor
from db import get_connection
from utils import serialize_row

approvedoc_bp = Blueprint("approvedoc", __name__)


def _gen_bigint_id():
    return int(time.time() * 1000) * 1000 + random.randint(0, 999)


def _create_ticket(cur, user_id, event_id, job_type=None):
    qr_code = secrets.token_hex(16)
    cur.execute(
        """
        INSERT INTO public.tickets (user_id, events_id, job_type, status, get_rewards, qr_code)
        VALUES (%s, %s, %s, 'approved', false, %s)
        RETURNING id
        """,
        (user_id, event_id, job_type, qr_code),
    )
    return cur.fetchone()[0]


@approvedoc_bp.route("/approvedocs", methods=["GET"])
def list_approvedocs():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT * FROM public.approvedoc ORDER BY created_at DESC")
    rows = [serialize_row(r) for r in cur.fetchall()]
    cur.close()
    conn.close()
    return jsonify(rows)


@approvedoc_bp.route("/approvedocs/<int:doc_id>", methods=["GET"])
def get_approvedoc(doc_id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT * FROM public.approvedoc WHERE id = %s", (doc_id,))
    row = cur.fetchone()
    cur.close()
    conn.close()
    if not row:
        return jsonify({"error": "ApproveDoc not found"}), 404
    return jsonify(serialize_row(row))


@approvedoc_bp.route("/approvedocs", methods=["POST"])
def apply_approvedoc():
    """User submits an application for an event."""
    data = request.get_json() or {}
    if not data.get("users_id") or not data.get("event_id"):
        return jsonify({"error": "users_id and event_id are required"}), 400

    doc_id = _gen_bigint_id()
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        """
        INSERT INTO public.approvedoc (id, users_id, event_id, status, question1, question2, question3)
        VALUES (%s, %s, %s, 'check', %s, %s, %s)
        """,
        (
            doc_id,
            data["users_id"],
            data["event_id"],
            data.get("question1"),
            data.get("question2"),
            data.get("question3"),
        ),
    )
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({"id": doc_id}), 201


@approvedoc_bp.route("/approvedocs/<int:doc_id>/approve", methods=["PUT"])
def approve_approvedoc(doc_id):
    """Organization approves the application and a ticket is auto-created."""
    conn = get_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)

    cur.execute("SELECT * FROM public.approvedoc WHERE id = %s", (doc_id,))
    doc = cur.fetchone()
    if not doc:
        cur.close()
        conn.close()
        return jsonify({"error": "ApproveDoc not found"}), 404

    if doc["status"] != "check":
        cur.close()
        conn.close()
        return jsonify({"error": f"Cannot approve a doc with status '{doc['status']}'"}), 409

    data = request.get_json() or {}
    job_type = data.get("job_type")

    cur2 = conn.cursor()
    cur2.execute(
        "UPDATE public.approvedoc SET status = 'approve' WHERE id = %s", (doc_id,)
    )
    ticket_id = _create_ticket(cur2, doc["users_id"], doc["event_id"], job_type)
    conn.commit()
    cur.close()
    cur2.close()
    conn.close()
    return jsonify({"message": "Approved", "ticket_id": ticket_id})


@approvedoc_bp.route("/approvedocs/<int:doc_id>/deny", methods=["PUT"])
def deny_approvedoc(doc_id):
    """Organization denies the application."""
    conn = get_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)

    cur.execute("SELECT status FROM public.approvedoc WHERE id = %s", (doc_id,))
    row = cur.fetchone()
    if not row:
        cur.close()
        conn.close()
        return jsonify({"error": "ApproveDoc not found"}), 404

    if row["status"] != "check":
        cur.close()
        conn.close()
        return jsonify({"error": f"Cannot deny a doc with status '{row['status']}'"}), 409

    cur2 = conn.cursor()
    cur2.execute(
        "UPDATE public.approvedoc SET status = 'deny' WHERE id = %s", (doc_id,)
    )
    conn.commit()
    cur.close()
    cur2.close()
    conn.close()
    return jsonify({"message": "Denied"})
