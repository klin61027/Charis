from flask import Blueprint, jsonify
from psycopg2.extras import RealDictCursor
from db import get_connection
from utils import serialize_row

coupons_bp = Blueprint("coupons", __name__)


@coupons_bp.route("/users/<user_id>/coupons", methods=["GET"])
def list_user_coupons(user_id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("""
        SELECT c.id, c.restaurant_id, c.discount_price, c.status,
               c.barcode, c.start_time, c.end_time,
               r.name    AS restaurant_name,
               r.city    AS restaurant_city,
               t.events_id AS event_id
        FROM public.coupons c
        JOIN public.tickets     t ON t.id  = c.ticket_id
        JOIN public.restaurants r ON r.id  = c.restaurant_id
        WHERE t.user_id = %s
        ORDER BY c.created_at DESC
    """, (user_id,))
    rows = [serialize_row(r) for r in cur.fetchall()]
    cur.close()
    conn.close()
    return jsonify(rows)


@coupons_bp.route("/coupons", methods=["GET"])
def list_coupons():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT * FROM public.coupons ORDER BY created_at DESC")
    rows = [serialize_row(r) for r in cur.fetchall()]
    cur.close()
    conn.close()
    return jsonify(rows)


@coupons_bp.route("/coupons/<int:coupon_id>", methods=["GET"])
def get_coupon(coupon_id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT * FROM public.coupons WHERE id = %s", (coupon_id,))
    row = cur.fetchone()
    cur.close()
    conn.close()
    if not row:
        return jsonify({"error": "Coupon not found"}), 404
    return jsonify(serialize_row(row))
