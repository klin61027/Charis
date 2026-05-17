import uuid
from flask import Blueprint, jsonify, request
from psycopg2.extras import RealDictCursor
from db import get_connection
from utils import serialize_row

organizations_bp = Blueprint("organizations", __name__)

ALLOWED_FIELDS = {
    "name", "description", "phone", "email",
    "verification", "country", "city", "address",
}


@organizations_bp.route("/organizations", methods=["GET"])
def list_organizations():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT * FROM public.organization ORDER BY created_at DESC")
    rows = [serialize_row(r) for r in cur.fetchall()]
    cur.close()
    conn.close()
    return jsonify(rows)


@organizations_bp.route("/organizations/<org_id>", methods=["GET"])
def get_organization(org_id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT * FROM public.organization WHERE id = %s", (org_id,))
    row = cur.fetchone()
    cur.close()
    conn.close()
    if not row:
        return jsonify({"error": "Organization not found"}), 404
    return jsonify(serialize_row(row))


@organizations_bp.route("/organizations", methods=["POST"])
def create_organization():
    data = request.get_json() or {}
    if not data.get("name") or not data.get("email"):
        return jsonify({"error": "name and email are required"}), 400

    org_id = str(uuid.uuid4())
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        """
        INSERT INTO public.organization
            (id, name, description, phone, email, verification, country, city, address)
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)
        """,
        (
            org_id,
            data["name"],
            data.get("description"),
            data.get("phone"),
            data["email"],
            data.get("verification", False),
            data.get("country"),
            data.get("city"),
            data.get("address"),
        ),
    )
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({"id": org_id}), 201


@organizations_bp.route("/organizations/<org_id>", methods=["PUT"])
def update_organization(org_id):
    data = request.get_json() or {}
    updates = {k: v for k, v in data.items() if k in ALLOWED_FIELDS}
    if not updates:
        return jsonify({"error": "No valid fields to update"}), 400

    set_clause = ", ".join(f"{k} = %s" for k in updates)
    values = list(updates.values()) + [org_id]

    conn = get_connection()
    cur = conn.cursor()
    cur.execute(f"UPDATE public.organization SET {set_clause} WHERE id = %s", values)
    if cur.rowcount == 0:
        conn.rollback()
        cur.close()
        conn.close()
        return jsonify({"error": "Organization not found"}), 404
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({"message": "Updated"})
