import uuid
from flask import Blueprint, jsonify, request
from psycopg2.extras import RealDictCursor
from db import get_connection
from utils import serialize_row

users_bp = Blueprint("users", __name__)

ALLOWED_FIELDS = {
    "name", "phone", "email", "clothes_size", "vegetarian",
    "description", "pronouns", "country", "city", "verification", "display_theme",
}


@users_bp.route("/users", methods=["GET"])
def list_users():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT * FROM public.users ORDER BY created_at DESC")
    rows = [serialize_row(r) for r in cur.fetchall()]
    cur.close()
    conn.close()
    return jsonify(rows)


@users_bp.route("/users/<user_id>", methods=["GET"])
def get_user(user_id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT * FROM public.users WHERE id = %s", (user_id,))
    row = cur.fetchone()
    cur.close()
    conn.close()
    if not row:
        return jsonify({"error": "User not found"}), 404
    return jsonify(serialize_row(row))


@users_bp.route("/users", methods=["POST"])
def create_user():
    data = request.get_json() or {}
    if not data.get("name") or not data.get("email"):
        return jsonify({"error": "name and email are required"}), 400

    user_id = str(uuid.uuid4())
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        """
        INSERT INTO public.users
            (id, name, phone, email, clothes_size, vegetarian,
             description, pronouns, country, city, verification, display_theme)
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
        """,
        (
            user_id,
            data["name"],
            data.get("phone"),
            data["email"],
            data.get("clothes_size"),
            data.get("vegetarian", False),
            data.get("description"),
            data.get("pronouns"),
            data.get("country"),
            data.get("city"),
            data.get("verification", False),
            data.get("display_theme"),
        ),
    )
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({"id": user_id}), 201


@users_bp.route("/users/<user_id>", methods=["PUT"])
def update_user(user_id):
    data = request.get_json() or {}
    updates = {k: v for k, v in data.items() if k in ALLOWED_FIELDS}
    if not updates:
        return jsonify({"error": "No valid fields to update"}), 400

    set_clause = ", ".join(f"{k} = %s" for k in updates)
    values = list(updates.values()) + [user_id]

    conn = get_connection()
    cur = conn.cursor()
    cur.execute(f"UPDATE public.users SET {set_clause} WHERE id = %s", values)
    if cur.rowcount == 0:
        conn.rollback()
        cur.close()
        conn.close()
        return jsonify({"error": "User not found"}), 404
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({"message": "Updated"})
