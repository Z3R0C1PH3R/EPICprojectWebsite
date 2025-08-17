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
TEAM_DIR_FILE = 'static/team/partners.json'

# Configure max content length
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # 50MB max-content-length
app.config['MAX_FILE_SIZE'] = 10 * 1024 * 1024      # 10MB max-file-size

# Create upload folders
os.makedirs(CASE_STUDIES_UPLOAD_FOLDER, exist_ok=True)
os.makedirs(EVENTS_UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RESOURCES_UPLOAD_FOLDER, exist_ok=True)
os.makedirs(GALLERY_UPLOAD_FOLDER, exist_ok=True)
os.makedirs('static/team', exist_ok=True)

# Create directory files if they don't exist
def create_directory_file_if_not_exists(dir_file, key):
    if not os.path.exists(dir_file):
        with open(dir_file, 'w') as f:
            json.dump({key: []}, f)

create_directory_file_if_not_exists(CASE_STUDIES_DIR_FILE, 'case_studies')
create_directory_file_if_not_exists(EVENTS_DIR_FILE, 'events')
create_directory_file_if_not_exists(RESOURCES_DIR_FILE, 'resources')
create_directory_file_if_not_exists(GALLERY_DIR_FILE, 'albums')

# Initialize team partners if not exists
if not os.path.exists(TEAM_DIR_FILE):
    default_partners = [
        {
            "id": "1",
            "name": "Agricultural Engineering Institute",
            "description": "Leading research in sustainable irrigation systems and water resource management.",
            "members": []
        },
        {
            "id": "2",
            "name": "Environmental Science Center",
            "description": "Specializing in climate adaptation strategies and community-based water management.",
            "members": []
        },
        {
            "id": "3",
            "name": "Development Studies Foundation",
            "description": "Focusing on gender equity in irrigation access and participatory approaches.",
            "members": []
        },
        {
            "id": "4",
            "name": "Technology Innovation Lab",
            "description": "Developing smart irrigation systems and IoT solutions for precision agriculture.",
            "members": []
        },
        {
            "id": "5",
            "name": "Agricultural Economics Research",
            "description": "Coordinating field studies and community engagement programs.",
            "members": []
        },
        {
            "id": "6",
            "name": "Data Analytics Institute",
            "description": "Leading data analysis and modeling efforts for irrigation system effectiveness.",
            "members": []
        },
        {
            "id": "7",
            "name": "Water Resources Center",
            "description": "Providing strategic guidance and oversight for research initiatives.",
            "members": []
        },
        {
            "id": "8",
            "name": "International Water Management",
            "description": "Regional advisory and technical support for water management projects.",
            "members": []
        }
    ]
    with open(TEAM_DIR_FILE, 'w') as f:
        json.dump(default_partners, f, indent=2)

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
        if not all(field in request.form for field in ['title']):
            return jsonify({"error": "Missing required fields"}), 400

        # Generate automatic case study number
        with open(CASE_STUDIES_DIR_FILE, 'r') as f:
            data = json.load(f)
        existing_case_studies = data.get('case_studies', [])
        case_study_number = str(len(existing_case_studies) + 1)
        
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

        # Process sections
        sections = []
        section_index = 0
        while f'section_{section_index}_heading' in request.form:
            section = {
                'heading': request.form.get(f'section_{section_index}_heading', ''),
                'body': request.form.get(f'section_{section_index}_body', '')
            }
            
            # Handle section image
            if f'section_{section_index}_image' in request.files and request.files[f'section_{section_index}_image'].filename:
                file = request.files[f'section_{section_index}_image']
                if file and allowed_file(file.filename):
                    filename = secure_filename(f"case_study_{case_study_number}_section_{section_index}.{file.filename.rsplit('.', 1)[1]}")
                    filepath = os.path.join(CASE_STUDIES_UPLOAD_FOLDER, filename)
                    file.save(filepath)
                    section['image'] = f"/static/case_studies/{filename}"
            elif f'section_{section_index}_existing_image' in request.form and request.form[f'section_{section_index}_existing_image']:
                section['image'] = request.form[f'section_{section_index}_existing_image']
            
            if section['heading'] or section['body'] or section.get('image'):
                sections.append(section)
            
            section_index += 1

        case_study_data = {
            'case_study_number': case_study_number,
            'title': title,
            'location': location,
            'date': date,
            'category': category,
            'upload_date': datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            'cover_image': cover_image_path,
            'pdf_file': pdf_path,
            'description': request.form.get('description', ''),
            'sections': sections
        }

        update_directory(CASE_STUDIES_DIR_FILE, 'case_studies', case_study_data, 'case_study_number')
        return jsonify({"message": "Upload successful"}), 200

    except Exception as e:
        app.logger.error(f"Upload error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route("/upload_event", methods=["POST"])
def upload_event():
    try:
        if not all(field in request.form for field in ['title']):
            return jsonify({"error": "Missing required fields"}), 400

        # Generate automatic event number
        with open(EVENTS_DIR_FILE, 'r') as f:
            data = json.load(f)
        existing_events = data.get('events', [])
        event_number = str(len(existing_events) + 1)
        
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

        # Process sections
        sections = []
        section_index = 0
        while f'section_{section_index}_heading' in request.form:
            section = {
                'heading': request.form.get(f'section_{section_index}_heading', ''),
                'body': request.form.get(f'section_{section_index}_body', '')
            }
            
            # Handle section image
            if f'section_{section_index}_image' in request.files and request.files[f'section_{section_index}_image'].filename:
                file = request.files[f'section_{section_index}_image']
                if file and allowed_file(file.filename):
                    filename = secure_filename(f"event_{event_number}_section_{section_index}.{file.filename.rsplit('.', 1)[1]}")
                    filepath = os.path.join(EVENTS_UPLOAD_FOLDER, filename)
                    file.save(filepath)
                    section['image'] = f"/static/events/{filename}"
            elif f'section_{section_index}_existing_image' in request.form and request.form[f'section_{section_index}_existing_image']:
                section['image'] = request.form[f'section_{section_index}_existing_image']
            
            if section['heading'] or section['body'] or section.get('image'):
                sections.append(section)
            
            section_index += 1

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
            'registration_link': request.form.get('registration_link', ''),
            'sections': sections
        }

        update_directory(EVENTS_DIR_FILE, 'events', event_data, 'event_number')
        return jsonify({"message": "Upload successful"}), 200

    except Exception as e:
        app.logger.error(f"Upload error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route("/upload_resource", methods=["POST"])
def upload_resource():
    try:
        if not all(field in request.form for field in ['title']):
            return jsonify({"error": "Missing required fields"}), 400

        # Generate automatic resource number
        with open(RESOURCES_DIR_FILE, 'r') as f:
            data = json.load(f)
        existing_resources = data.get('resources', [])
        resource_number = str(len(existing_resources) + 1)
        
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

        # Process sections
        sections = []
        section_index = 0
        while f'section_{section_index}_heading' in request.form:
            section = {
                'heading': request.form.get(f'section_{section_index}_heading', ''),
                'body': request.form.get(f'section_{section_index}_body', '')
            }
            
            # Handle section image
            if f'section_{section_index}_image' in request.files and request.files[f'section_{section_index}_image'].filename:
                file = request.files[f'section_{section_index}_image']
                if file and allowed_file(file.filename):
                    filename = secure_filename(f"resource_{resource_number}_section_{section_index}.{file.filename.rsplit('.', 1)[1]}")
                    filepath = os.path.join(RESOURCES_UPLOAD_FOLDER, filename)
                    file.save(filepath)
                    section['image'] = f"/static/resources/{filename}"
            elif f'section_{section_index}_existing_image' in request.form and request.form[f'section_{section_index}_existing_image']:
                section['image'] = request.form[f'section_{section_index}_existing_image']
            
            if section['heading'] or section['body'] or section.get('image'):
                sections.append(section)
            
            section_index += 1

        resource_data = {
            'resource_number': resource_number,
            'title': title,
            'type': type,
            'description': request.form.get('description', ''),
            'upload_date': datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            'file': file_path,
            'download_size': request.form.get('download_size', ''),
            'sections': sections
        }

        update_directory(RESOURCES_DIR_FILE, 'resources', resource_data, 'resource_number')
        return jsonify({"message": "Upload successful"}), 200

    except Exception as e:
        app.logger.error(f"Upload error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route("/upload_photo_album", methods=["POST"])
def upload_photo_album():
    try:
        if not all(field in request.form for field in ['title']):
            return jsonify({"error": "Missing required fields"}), 400

        # Generate automatic album number
        with open(GALLERY_DIR_FILE, 'r') as f:
            data = json.load(f)
        existing_albums = data.get('albums', [])
        album_number = str(len(existing_albums) + 1)
        
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

# Team Management Endpoints
@app.route("/get_partners", methods=["GET"])
def get_partners():
    try:
        with open(TEAM_DIR_FILE, 'r') as f:
            partners = json.load(f)
        return jsonify(partners), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/update_partner", methods=["POST"])
def update_partner():
    try:
        partner_id = request.form.get('partner_id')
        name = request.form.get('name')
        description = request.form.get('description')
        
        with open(TEAM_DIR_FILE, 'r') as f:
            partners = json.load(f)
        
        for partner in partners:
            if partner['id'] == partner_id:
                partner['name'] = name
                partner['description'] = description
                break
        
        with open(TEAM_DIR_FILE, 'w') as f:
            json.dump(partners, f, indent=2)
        
        return jsonify({"message": "Partner updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/add_team_member", methods=["POST"])
def add_team_member():
    try:
        import uuid
        partner_id = request.form.get('partner_id')
        name = request.form.get('name')
        role = request.form.get('role')
        department = request.form.get('department')
        bio = request.form.get('bio')
        email = request.form.get('email')
        linkedin = request.form.get('linkedin')
        image = request.form.get('image')
        
        new_member = {
            'id': str(uuid.uuid4()),
            'name': name,
            'role': role,
            'department': department,
            'bio': bio,
            'email': email,
            'linkedin': linkedin,
            'image': image
        }
        
        with open(TEAM_DIR_FILE, 'r') as f:
            partners = json.load(f)
        
        for partner in partners:
            if partner['id'] == partner_id:
                partner['members'].append(new_member)
                break
        
        with open(TEAM_DIR_FILE, 'w') as f:
            json.dump(partners, f, indent=2)
        
        return jsonify({"message": "Team member added successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/update_team_member", methods=["POST"])
def update_team_member():
    try:
        partner_id = request.form.get('partner_id')
        member_id = request.form.get('member_id')
        name = request.form.get('name')
        role = request.form.get('role')
        department = request.form.get('department')
        bio = request.form.get('bio')
        email = request.form.get('email')
        linkedin = request.form.get('linkedin')
        image = request.form.get('image')
        
        with open(TEAM_DIR_FILE, 'r') as f:
            partners = json.load(f)
        
        for partner in partners:
            if partner['id'] == partner_id:
                for member in partner['members']:
                    if member['id'] == member_id:
                        member['name'] = name
                        member['role'] = role
                        member['department'] = department
                        member['bio'] = bio
                        member['email'] = email
                        member['linkedin'] = linkedin
                        member['image'] = image
                        break
                break
        
        with open(TEAM_DIR_FILE, 'w') as f:
            json.dump(partners, f, indent=2)
        
        return jsonify({"message": "Team member updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/delete_team_member", methods=["POST"])
def delete_team_member():
    try:
        partner_id = request.form.get('partner_id')
        member_id = request.form.get('member_id')
        
        with open(TEAM_DIR_FILE, 'r') as f:
            partners = json.load(f)
        
        for partner in partners:
            if partner['id'] == partner_id:
                partner['members'] = [m for m in partner['members'] if m['id'] != member_id]
                break
        
        with open(TEAM_DIR_FILE, 'w') as f:
            json.dump(partners, f, indent=2)
        
        return jsonify({"message": "Team member deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Static file serving route
@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory(os.path.join(os.path.dirname(__file__), 'static'), filename)

if __name__ == '__main__':
    app.run(debug=True)