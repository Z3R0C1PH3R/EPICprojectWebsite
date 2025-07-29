from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import json
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Upload Folders Configuration
CASE_STUDIES_UPLOAD_FOLDER = 'static/case_studies'
EVENTS_UPLOAD_FOLDER = 'static/events'
RESOURCES_UPLOAD_FOLDER = 'static/resources'
GALLERY_UPLOAD_FOLDER = 'static/gallery'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'pdf', 'doc', 'docx'}

# Directory files
CASE_STUDIES_DIR_FILE = os.path.join(CASE_STUDIES_UPLOAD_FOLDER, 'directory.json')
EVENTS_DIR_FILE = os.path.join(EVENTS_UPLOAD_FOLDER, 'directory.json')
RESOURCES_DIR_FILE = os.path.join(RESOURCES_UPLOAD_FOLDER, 'directory.json')
GALLERY_DIR_FILE = os.path.join(GALLERY_UPLOAD_FOLDER, 'directory.json')

# Configure max content length
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # 50MB max-content-length
app.config['MAX_FILE_SIZE'] = 10 * 1024 * 1024      # 10MB max-file-size

# Create upload folders
os.makedirs(CASE_STUDIES_UPLOAD_FOLDER, exist_ok=True)
os.makedirs(EVENTS_UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RESOURCES_UPLOAD_FOLDER, exist_ok=True)
os.makedirs(GALLERY_UPLOAD_FOLDER, exist_ok=True)

# Create directory files if they don't exist
def create_directory_file_if_not_exists(dir_file, key):
    if not os.path.exists(dir_file):
        with open(dir_file, 'w') as f:
            json.dump({key: []}, f)

create_directory_file_if_not_exists(CASE_STUDIES_DIR_FILE, 'case_studies')
create_directory_file_if_not_exists(EVENTS_DIR_FILE, 'events')
create_directory_file_if_not_exists(RESOURCES_DIR_FILE, 'resources')
create_directory_file_if_not_exists(GALLERY_DIR_FILE, 'albums')

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def update_directory(dir_file, key, item_data, item_number_key):
    with open(dir_file, 'r') as f:
        directory = json.load(f)
    
    item_exists = False
    for i, item in enumerate(directory[key]):
        if item[item_number_key] == item_data[item_number_key]:
            item_data['upload_date'] = item.get('upload_date', item_data['upload_date'])
            directory[key][i] = item_data
            item_exists = True
            break
    
    if not item_exists:
        directory[key].append(item_data)
    
    directory[key].sort(key=lambda x: int(x[item_number_key]))
    
    with open(dir_file, 'w') as f:
        json.dump(directory, f, indent=2)

@app.route("/upload_case_study", methods=["POST"])
def upload_case_study():
    try:
        if not all(field in request.form for field in ['case_study_number', 'title']):
            return jsonify({"error": "Missing required fields"}), 400

        case_study_number = request.form.get('case_study_number')
        title = request.form.get('title')
        location = request.form.get('location', '')
        date = request.form.get('date', '')
        category = request.form.get('category', '')
        is_edit = request.form.get('is_edit') == 'true'

        cover_image_path = None
        if 'cover_image' in request.files and request.files['cover_image'].filename:
            file = request.files['cover_image']
            if file and allowed_file(file.filename):
                filename = secure_filename(f"case_study_{case_study_number}_cover.{file.filename.rsplit('.', 1)[1]}")
                filepath = os.path.join(CASE_STUDIES_UPLOAD_FOLDER, filename)
                file.save(filepath)
                cover_image_path = f"/static/case_studies/{filename}"

        pdf_path = None
        if 'pdf_file' in request.files and request.files['pdf_file'].filename:
            file = request.files['pdf_file']
            if file and allowed_file(file.filename):
                filename = secure_filename(f"case_study_{case_study_number}.pdf")
                filepath = os.path.join(CASE_STUDIES_UPLOAD_FOLDER, filename)
                file.save(filepath)
                pdf_path = f"/static/case_studies/{filename}"

        case_study_data = {
            'case_study_number': case_study_number,
            'title': title,
            'location': location,
            'date': date,
            'category': category,
            'upload_date': datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            'cover_image': cover_image_path,
            'pdf_file': pdf_path,
            'description': request.form.get('description', '')
        }

        update_directory(CASE_STUDIES_DIR_FILE, 'case_studies', case_study_data, 'case_study_number')
        return jsonify({"message": "Upload successful"}), 200

    except Exception as e:
        app.logger.error(f"Upload error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route("/upload_event", methods=["POST"])
def upload_event():
    try:
        if not all(field in request.form for field in ['event_number', 'title']):
            return jsonify({"error": "Missing required fields"}), 400

        event_number = request.form.get('event_number')
        title = request.form.get('title')
        date = request.form.get('date', '')
        location = request.form.get('location', '')
        type = request.form.get('type', '')
        is_edit = request.form.get('is_edit') == 'true'

        cover_image_path = None
        if 'cover_image' in request.files and request.files['cover_image'].filename:
            file = request.files['cover_image']
            if file and allowed_file(file.filename):
                filename = secure_filename(f"event_{event_number}_cover.{file.filename.rsplit('.', 1)[1]}")
                filepath = os.path.join(EVENTS_UPLOAD_FOLDER, filename)
                file.save(filepath)
                cover_image_path = f"/static/events/{filename}"

        event_data = {
            'event_number': event_number,
            'title': title,
            'date': date,
            'location': location,
            'type': type,
            'status': request.form.get('status', 'Upcoming'),
            'description': request.form.get('description', ''),
            'upload_date': datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            'cover_image': cover_image_path,
            'registration_link': request.form.get('registration_link', '')
        }

        update_directory(EVENTS_DIR_FILE, 'events', event_data, 'event_number')
        return jsonify({"message": "Upload successful"}), 200

    except Exception as e:
        app.logger.error(f"Upload error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route("/upload_resource", methods=["POST"])
def upload_resource():
    try:
        if not all(field in request.form for field in ['resource_number', 'title']):
            return jsonify({"error": "Missing required fields"}), 400

        resource_number = request.form.get('resource_number')
        title = request.form.get('title')
        type = request.form.get('type', '')
        is_edit = request.form.get('is_edit') == 'true'

        file_path = None
        if 'resource_file' in request.files and request.files['resource_file'].filename:
            file = request.files['resource_file']
            if file and allowed_file(file.filename):
                filename = secure_filename(f"resource_{resource_number}.{file.filename.rsplit('.', 1)[1]}")
                filepath = os.path.join(RESOURCES_UPLOAD_FOLDER, filename)
                file.save(filepath)
                file_path = f"/static/resources/{filename}"

        resource_data = {
            'resource_number': resource_number,
            'title': title,
            'type': type,
            'description': request.form.get('description', ''),
            'upload_date': datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            'file': file_path,
            'download_size': request.form.get('download_size', '')
        }

        update_directory(RESOURCES_DIR_FILE, 'resources', resource_data, 'resource_number')
        return jsonify({"message": "Upload successful"}), 200

    except Exception as e:
        app.logger.error(f"Upload error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route("/upload_photo_album", methods=["POST"])
def upload_photo_album():
    try:
        if not all(field in request.form for field in ['album_number', 'title']):
            return jsonify({"error": "Missing required fields"}), 400

        album_number = request.form.get('album_number')
        title = request.form.get('title')
        date = request.form.get('date', '')
        is_edit = request.form.get('is_edit') == 'true'

        cover_image_path = None
        if 'cover_image' in request.files and request.files['cover_image'].filename:
            file = request.files['cover_image']
            if file and allowed_file(file.filename):
                filename = secure_filename(f"album_{album_number}_cover.{file.filename.rsplit('.', 1)[1]}")
                filepath = os.path.join(GALLERY_UPLOAD_FOLDER, filename)
                file.save(filepath)
                cover_image_path = f"/static/gallery/{filename}"

        photos = []
        photo_files = request.files.getlist('photos')
        for i, photo in enumerate(photo_files):
            if photo and allowed_file(photo.filename):
                filename = secure_filename(f"album_{album_number}_photo_{i}.{photo.filename.rsplit('.', 1)[1]}")
                filepath = os.path.join(GALLERY_UPLOAD_FOLDER, filename)
                photo.save(filepath)
                photos.append(f"/static/gallery/{filename}")

        album_data = {
            'album_number': album_number,
            'title': title,
            'date': date,
            'description': request.form.get('description', ''),
            'upload_date': datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            'cover_image': cover_image_path,
            'photos': photos
        }

        if is_edit and 'existing_photos' in request.form:
            existing_photos = json.loads(request.form['existing_photos'])
            album_data['photos'] = existing_photos + photos

        update_directory(GALLERY_DIR_FILE, 'albums', album_data, 'album_number')
        return jsonify({"message": "Upload successful"}), 200

    except Exception as e:
        app.logger.error(f"Upload error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route("/get_case_studies", methods=["GET"])
def get_case_studies():
    try:
        with open(CASE_STUDIES_DIR_FILE, 'r') as f:
            data = json.load(f)
        limit = request.args.get('limit', type=int)
        if limit:
            data['case_studies'] = data['case_studies'][-limit:]
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/get_events", methods=["GET"])
def get_events():
    try:
        with open(EVENTS_DIR_FILE, 'r') as f:
            data = json.load(f)
        limit = request.args.get('limit', type=int)
        if limit:
            data['events'] = data['events'][-limit:]
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/get_resources", methods=["GET"])
def get_resources():
    try:
        with open(RESOURCES_DIR_FILE, 'r') as f:
            data = json.load(f)
        limit = request.args.get('limit', type=int)
        if limit:
            data['resources'] = data['resources'][-limit:]
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/get_photo_albums", methods=["GET"])
def get_photo_albums():
    try:
        with open(GALLERY_DIR_FILE, 'r') as f:
            data = json.load(f)
        limit = request.args.get('limit', type=int)
        if limit:
            data['albums'] = data['albums'][-limit:]
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/handle_login", methods=["POST"])
def handle_login():
    password = request.form.get('password')
    if password == 'epicadmin':
        return jsonify({"message": "Login successful"}), 202
    else:
        return jsonify({"error": "Invalid password"}), 401

@app.route("/delete_case_study/<case_study_number>", methods=["DELETE"])
def delete_case_study(case_study_number):
    try:
        with open(CASE_STUDIES_DIR_FILE, 'r') as f:
            data = json.load(f)
        data['case_studies'] = [cs for cs in data['case_studies'] if cs['case_study_number'] != case_study_number]
        with open(CASE_STUDIES_DIR_FILE, 'w') as f:
            json.dump(data, f, indent=2)
        return jsonify({"message": "Delete successful"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/delete_event/<event_number>", methods=["DELETE"])
def delete_event(event_number):
    try:
        with open(EVENTS_DIR_FILE, 'r') as f:
            data = json.load(f)
        data['events'] = [e for e in data['events'] if e['event_number'] != event_number]
        with open(EVENTS_DIR_FILE, 'w') as f:
            json.dump(data, f, indent=2)
        return jsonify({"message": "Delete successful"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/delete_resource/<resource_number>", methods=["DELETE"])
def delete_resource(resource_number):
    try:
        with open(RESOURCES_DIR_FILE, 'r') as f:
            data = json.load(f)
        data['resources'] = [r for r in data['resources'] if r['resource_number'] != resource_number]
        with open(RESOURCES_DIR_FILE, 'w') as f:
            json.dump(data, f, indent=2)
        return jsonify({"message": "Delete successful"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/delete_photo_album/<album_number>", methods=["DELETE"])
def delete_photo_album(album_number):
    try:
        with open(GALLERY_DIR_FILE, 'r') as f:
            data = json.load(f)
        data['albums'] = [a for a in data['albums'] if a['album_number'] != album_number]
        with open(GALLERY_DIR_FILE, 'w') as f:
            json.dump(data, f, indent=2)
        return jsonify({"message": "Delete successful"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Static file serving route
@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory(os.path.join(os.path.dirname(__file__), 'static'), filename)

if __name__ == '__main__':
    app.run(debug=True)