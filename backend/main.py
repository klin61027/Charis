from flask import Flask, jsonify
from flask_cors import CORS
from db import get_connection

app = Flask(__name__)
CORS(app)

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
