from flask import Flask, jsonify
from flask_cors import CORS
from db import get_connection
from routes.users import users_bp
from routes.organizations import organizations_bp
from routes.events import events_bp
from routes.approvedoc import approvedoc_bp
from routes.tickets import tickets_bp
from routes.coupons import coupons_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(users_bp)
app.register_blueprint(organizations_bp)
app.register_blueprint(events_bp)
app.register_blueprint(approvedoc_bp)
app.register_blueprint(tickets_bp)
app.register_blueprint(coupons_bp)


@app.route("/health")
def health():
    return jsonify({"status": "ok"})


@app.route("/db-check")
def db_check():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT version();")
    version = cur.fetchone()[0]
    cur.close()
    conn.close()
    return jsonify({"db_version": version})


if __name__ == "__main__":
    app.run(debug=True, port=5000)
