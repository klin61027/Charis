from flask import Blueprint, jsonify
from psycopg2.extras import RealDictCursor
from db import get_connection
from utils import serialize_row

coupons_bp = Blueprint("coupons", __name__)


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
