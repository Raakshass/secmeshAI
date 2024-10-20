from flask import Flask, request, jsonify
import json
import os
from lighthouseweb3 import Lighthouse

app = Flask(__name__)

# Path to store user data in a JSON file
USER_DATA_FILE = "users.json"

# Lighthouse API Key (replace with your own API key)
LIGHTHOUSE_API_KEY = '3ba0ed7b.2a04817ccc49420ab64963f6b4c1b8a4'
lh = Lighthouse(token=LIGHTHOUSE_API_KEY)

# Function to load users from a JSON file
def load_users():
    if os.path.exists(USER_DATA_FILE):
        with open(USER_DATA_FILE, 'r') as file:
            return json.load(file)
    return {}

# Function to save users to a JSON file
def save_users(users):
    with open(USER_DATA_FILE, 'w') as file:
        json.dump(users, file, indent=4)

# Add a new user if they don't already exist
def add_user(user_id):
    users = load_users()
    if user_id not in users:
        users[user_id] = {
            "id": user_id,
            "cids": []
        }
        save_users(users)

# Function to upload the file to Lighthouse using SDK
def upload_to_lighthouse_sdk(file_path):
    try:
        response = lh.upload(file_path)
        print(f"Response from Lighthouse: {response}")  # Log the response for debugging
        if response and 'data' in response and 'Hash' in response['data']:
            return response
        else:
            raise Exception("Lighthouse SDK upload failed")
    except Exception as e:
        raise Exception(f"Error uploading file to Lighthouse using SDK: {str(e)}")

# Route to handle file uploads
@app.route('/upload', methods=['POST'])
def upload_file():
    try:
        user_id = request.form.get('user_id')

        if 'file' not in request.files or not user_id:
            return jsonify({"error": "No file or user ID provided"}), 400

        file = request.files['file']

        # Ensure the 'uploads' folder exists
        if not os.path.exists('uploads'):
            os.makedirs('uploads')

        # Add user if not exist
        add_user(user_id)

        # Save the file temporarily
        file_path = os.path.join("uploads", file.filename)
        file.save(file_path)

        # Upload file to Lighthouse using SDK
        response = upload_to_lighthouse_sdk(file_path)

        # Correctly access the CID from the response
        cid = response['data']['Hash']  # Access 'Hash' from the nested 'data' dictionary

        # Update user's CID list in JSON file
        users = load_users()
        users[user_id]['cids'].append(cid)
        save_users(users)

        # Remove the temporary file after upload
        if os.path.exists(file_path):
            os.remove(file_path)

        return jsonify({"success": True, "cid": cid}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to upload file: {str(e)}"}), 500

# Route to get user details including uploaded CIDs
@app.route('/users/<user_id>', methods=['GET'])
def get_user(user_id):
    try:
        users = load_users()
        if user_id in users:
            return jsonify(users[user_id]), 200
        else:
            return jsonify({"error": "User  not found"}), 404
    except Exception as e:
        return jsonify({"error": f"Error fetching user data: {str(e)}"}), 500

if __name__ == '__main__':
    # Ensure 'uploads' folder exists before starting the app
    if not os.path.exists('uploads'):
        os.makedirs('uploads')
    app.run(debug=True)