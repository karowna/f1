from flask import Flask, jsonify
from flask_cors import CORS  # Importing Flask-CORS

app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

@app.route('/')
def hello_world():
    return jsonify({"message": "Hello from Flask Backend!"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
