from flask import Flask, request, jsonify, send_from_directory
import os

FRONTEND_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'frontend')
app = Flask(__name__, static_folder=FRONTEND_FOLDER)

notes_db = {}
@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory(app.static_folder, filename)

@app.route('/api/notes/<date_str>', methods=['GET'])
def get_note(date_str):
    content = notes_db.get(date_str, "")
    return jsonify({"content": content})

@app.route('/api/notes', methods=['POST'])
def save_note():
    data = request.get_json()
    date_str = data.get('date')
    content = data.get('content')
    
    if date_str:
        notes_db[date_str] = content
        return jsonify({"message": "Note added successfully!"}), 200
    return jsonify({"error": "Date is missing..."}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=1100)