import uuid
from flask import Blueprint, jsonify, request
from psycopg2.extras import RealDictCursor
from db import get_connection
from utils import serialize_row

events_bp = Blueprint("events", __name__)

ALLOWED_FIELDS = {
    "title", "description", "country", "city", "address",
    "start_time", "end_time", "volunteers_amount",
}


@events_bp.route("/events", methods=["GET"])
def list_events():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT * FROM public.events ORDER BY created_at DESC")
    rows = [serialize_row(r) for r in cur.fetchall()]
    cur.close()
    conn.close()
    return jsonify(rows)


@events_bp.route("/events/<event_id>", methods=["GET"])
def get_event(event_id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT * FROM public.events WHERE id = %s", (event_id,))
    row = cur.fetchone()
    cur.close()
    conn.close()
    if not row:
        return jsonify({"error": "Event not found"}), 404
    return jsonify(serialize_row(row))


@events_bp.route("/organizations/<org_id>/events", methods=["GET"])
def list_org_events(org_id):
    """列出某個 organization 的所有活動"""
    conn = get_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute(
        "SELECT * FROM public.events WHERE organization_id = %s ORDER BY created_at DESC",
        (org_id,),
    )
    rows = [serialize_row(r) for r in cur.fetchall()]
    cur.close()
    conn.close()
    return jsonify(rows)


@events_bp.route("/organizations/<org_id>/events", methods=["POST"])
def create_event(org_id):
    """Organization 建立活動"""
    conn = get_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)

    cur.execute("SELECT id FROM public.organization WHERE id = %s", (org_id,))
    if not cur.fetchone():
        cur.close()
        conn.close()
        return jsonify({"error": "Organization not found"}), 404
    cur.close()

    data = request.get_json() or {}
    if not data.get("title"):
        conn.close()
        return jsonify({"error": "title is required"}), 400

    event_id = str(uuid.uuid4())
    cur2 = conn.cursor()
    cur2.execute(
        """
        INSERT INTO public.events
            (id, organization_id, title, description, country, city,
             address, start_time, end_time, volunteers_amount)
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
        """,
        (
            event_id,
            org_id,
            data["title"],
            data.get("description"),
            data.get("country"),
            data.get("city"),
            data.get("address"),
            data.get("start_time"),
            data.get("end_time"),
            data.get("volunteers_amount", 0),
        ),
    )
    conn.commit()
    cur2.close()
    conn.close()
    return jsonify({"id": event_id}), 201


@events_bp.route("/events/<event_id>", methods=["PUT"])
def update_event(event_id):
    """Organization 更新活動資訊"""
    data = request.get_json() or {}
    updates = {k: v for k, v in data.items() if k in ALLOWED_FIELDS}
    if not updates:
        return jsonify({"error": "No valid fields to update"}), 400

    set_clause = ", ".join(f"{k} = %s" for k in updates)
    values = list(updates.values()) + [event_id]

    conn = get_connection()
    cur = conn.cursor()
    cur.execute(f"UPDATE public.events SET {set_clause} WHERE id = %s", values)
    if cur.rowcount == 0:
        conn.rollback()
        cur.close()
        conn.close()
        return jsonify({"error": "Event not found"}), 404
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({"message": "Updated"})


@events_bp.route("/events/<event_id>", methods=["DELETE"])
def delete_event(event_id):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM public.events WHERE id = %s", (event_id,))
    if cur.rowcount == 0:
        conn.rollback()
        cur.close()
        conn.close()
        return jsonify({"error": "Event not found"}), 404
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({"message": "Deleted"})
