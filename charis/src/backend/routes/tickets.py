import secrets
from flask import Blueprint, jsonify, request
from psycopg2.extras import RealDictCursor
from db import get_connection
from utils import serialize_row

tickets_bp = Blueprint("tickets", __name__)


def _create_coupon(cur, ticket_id, restaurant_id, vegetarian, data):
    barcode = secrets.token_hex(8).upper()
    cur.execute(
        """
        INSERT INTO public.coupons
            (ticket_id, restaurant_id, title, description, vegetarian,
             discount_price, status, barcode, start_time, end_time)
        VALUES (%s,%s,%s,%s,%s,%s,'unused',%s,%s,%s)
        RETURNING id
        """,
        (
            ticket_id,
            restaurant_id,
            data.get("title", "Volunteer Reward Coupon"),
            data.get("description"),
            vegetarian,
            data.get("discount_price", 0),
            barcode,
            data.get("start_time"),
            data.get("end_time"),
        ),
    )
    return cur.fetchone()[0]


@tickets_bp.route("/tickets", methods=["GET"])
def list_tickets():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT * FROM public.tickets ORDER BY created_at DESC")
    rows = [serialize_row(r) for r in cur.fetchall()]
    cur.close()
    conn.close()
    return jsonify(rows)


@tickets_bp.route("/tickets/<int:ticket_id>", methods=["GET"])
def get_ticket(ticket_id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT * FROM public.tickets WHERE id = %s", (ticket_id,))
    row = cur.fetchone()
    cur.close()
    conn.close()
    if not row:
        return jsonify({"error": "Ticket not found"}), 404
    return jsonify(serialize_row(row))


@tickets_bp.route("/tickets/scan/<qr_code>", methods=["GET"])
def scan_ticket(qr_code):
    """Organization scans QR code to look up ticket details."""
    conn = get_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute(
        """
        SELECT t.*, u.name AS user_name, u.email AS user_email,
               e.title AS event_title
        FROM public.tickets t
        JOIN public.users u ON u.id = t.user_id
        JOIN public.events e ON e.id = t.events_id
        WHERE t.qr_code = %s
        """,
        (qr_code,),
    )
    row = cur.fetchone()
    cur.close()
    conn.close()
    if not row:
        return jsonify({"error": "Invalid QR code"}), 404
    return jsonify(serialize_row(row))


@tickets_bp.route("/tickets/scan/<qr_code>/use", methods=["POST"])
def use_ticket_by_qr(qr_code):
    """Organization scans QR code to mark ticket as used and auto-create coupon."""
    data = request.get_json() or {}
    if not data.get("restaurant_id"):
        return jsonify({"error": "restaurant_id is required"}), 400

    conn = get_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute(
        """
        SELECT t.id, t.status, t.get_rewards, t.user_id,
               u.vegetarian
        FROM public.tickets t
        JOIN public.users u ON u.id = t.user_id
        WHERE t.qr_code = %s
        """,
        (qr_code,),
    )
    ticket = cur.fetchone()
    if not ticket:
        cur.close()
        conn.close()
        return jsonify({"error": "Invalid QR code"}), 404

    if ticket["get_rewards"]:
        cur.close()
        conn.close()
        return jsonify({"error": "Ticket has already been used"}), 409

    cur2 = conn.cursor()
    cur2.execute(
        "UPDATE public.tickets SET status = 'used', get_rewards = true WHERE id = %s",
        (ticket["id"],),
    )
    coupon_id = _create_coupon(
        cur2,
        ticket["id"],
        data["restaurant_id"],
        ticket["vegetarian"],
        data,
    )
    conn.commit()
    cur.close()
    cur2.close()
    conn.close()
    return jsonify({"message": "Ticket used", "coupon_id": coupon_id})


@tickets_bp.route("/tickets/<int:ticket_id>/use", methods=["POST"])
def use_ticket(ticket_id):
    """Mark ticket as used and auto-create a coupon."""
    data = request.get_json() or {}
    if not data.get("restaurant_id"):
        return jsonify({"error": "restaurant_id is required"}), 400

    conn = get_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)

    cur.execute(
        """
        SELECT t.id, t.status, t.get_rewards, t.user_id,
               u.vegetarian
        FROM public.tickets t
        JOIN public.users u ON u.id = t.user_id
        WHERE t.id = %s
        """,
        (ticket_id,),
    )
    ticket = cur.fetchone()
    if not ticket:
        cur.close()
        conn.close()
        return jsonify({"error": "Ticket not found"}), 404

    if ticket["get_rewards"]:
        cur.close()
        conn.close()
        return jsonify({"error": "Ticket has already been used"}), 409

    cur2 = conn.cursor()
    cur2.execute(
        "UPDATE public.tickets SET status = 'used', get_rewards = true WHERE id = %s",
        (ticket_id,),
    )
    coupon_id = _create_coupon(
        cur2,
        ticket_id,
        data["restaurant_id"],
        ticket["vegetarian"],
        data,
    )
    conn.commit()
    cur.close()
    cur2.close()
    conn.close()
    return jsonify({"message": "Ticket used", "coupon_id": coupon_id})
