from flask import Blueprint, request, jsonify, send_from_directory
from config import users_collection, reports_collection, otp_collection, contact_messages_collection
from utils.password_utils import hash_password, check_password

import secrets
import datetime
import os
import random

from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from bson import ObjectId
from werkzeug.utils import secure_filename

import yagmail  # ✅ pip install yagmail

auth = Blueprint("auth", __name__)

UPLOAD_FOLDER = "uploads/avatars"
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp"}

# ✅ SET THESE (use env vars if you want, but for now you can paste)
EMAIL_SENDER = "ghorpadeakanksha31@gmail.com"
EMAIL_APP_PASSWORD = "xwli mwxt snbu dqgz"

OTP_EXPIRE_MINUTES = 5


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@auth.route("/uploads/avatars/<filename>")
def serve_avatar(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)


# =====================================
# ✅ SEND OTP FOR SIGNUP
# =====================================
@auth.route("/send-signup-otp", methods=["POST"])
def send_signup_otp():
    data = request.json or {}
    email = (data.get("email") or "").strip().lower()

    if not email:
        return jsonify({"error": "Email is required"}), 400

    # If already registered, do not send OTP
    if users_collection.find_one({"email": email}):
        return jsonify({"error": "User already exists"}), 400

    # generate 6 digit OTP
    otp = f"{random.randint(100000, 999999)}"

    otp_hash = hash_password(otp)  # reuse your bcrypt hashing utility
    expiry_time = datetime.datetime.utcnow() + datetime.timedelta(minutes=OTP_EXPIRE_MINUTES)

    # store OTP (replace old OTP for same email)
    otp_collection.update_one(
        {"email": email},
        {"$set": {
            "email": email,
            "otp_hash": otp_hash,
            "expiresAt": expiry_time,
            "createdAt": datetime.datetime.utcnow(),
            "attempts": 0
        }},
        upsert=True
    )

    # send email
    try:
        yag = yagmail.SMTP(user=EMAIL_SENDER, password=EMAIL_APP_PASSWORD)
        yag.send(
            to=email,
            subject="Your Signup OTP - Breast Cancer Detection",
            contents=f"Your OTP for signup is: {otp}\n\nThis OTP is valid for {OTP_EXPIRE_MINUTES} minutes."
        )
        return jsonify({"message": "OTP sent successfully"}), 200

    except Exception as e:
        print("EMAIL OTP ERROR:", e)
        return jsonify({"error": "Failed to send OTP email"}), 500


@auth.route("/verify-signup-otp", methods=["POST"])
def verify_signup_otp():
    data = request.json or {}
    email = (data.get("email") or "").strip().lower()
    otp = (data.get("otp") or "").strip()

    if not email or not otp:
        return jsonify({"error": "Email and OTP are required"}), 400

    otp_doc = otp_collection.find_one({"email": email})
    if not otp_doc:
        return jsonify({"error": "OTP not found. Please click Send OTP again."}), 400

    expires_at = otp_doc.get("expiresAt")
    if not expires_at or expires_at < datetime.datetime.utcnow():
        otp_collection.delete_one({"email": email})
        return jsonify({"error": "OTP expired. Please request a new OTP."}), 400

    attempts = int(otp_doc.get("attempts", 0))
    if attempts >= 5:
        otp_collection.delete_one({"email": email})
        return jsonify({"error": "Too many attempts. Please request a new OTP."}), 400

    if not check_password(otp, otp_doc.get("otp_hash", "")):
        otp_collection.update_one({"email": email}, {"$set": {"attempts": attempts + 1}})
        return jsonify({"error": "Invalid OTP"}), 400

    # ✅ mark verified (don’t delete yet)
    otp_collection.update_one(
        {"email": email},
        {"$set": {"verified": True, "verifiedAt": datetime.datetime.utcnow()}}
    )

    return jsonify({"message": "OTP verified successfully"}), 200


# =====================================
# ✅ REGISTER (NOW REQUIRES OTP)
# =====================================
@auth.route("/register", methods=["POST"])
def register():
    name = request.form.get("name")
    email = (request.form.get("email") or "").strip().lower()
    password = request.form.get("password")

    if not name or not email or not password:
        return jsonify({"error": "All fields are required"}), 400

    if users_collection.find_one({"email": email}):
        return jsonify({"error": "User already exists"}), 400

    # ✅ OTP must exist
    otp_doc = otp_collection.find_one({"email": email})
    if not otp_doc:
        return jsonify({"error": "OTP not found. Please click Send OTP again."}), 400

    expires_at = otp_doc.get("expiresAt")
    if not expires_at or expires_at < datetime.datetime.utcnow():
        otp_collection.delete_one({"email": email})
        return jsonify({"error": "OTP expired. Please request a new OTP."}), 400

    if not otp_doc.get("verified"):
        return jsonify({"error": "Please verify OTP first."}), 400

    # OTP verified → delete
    otp_collection.delete_one({"email": email})

    hashed_password = hash_password(password)

    avatar_url = None
    file = request.files.get("avatar")

    if file and file.filename:
        if not allowed_file(file.filename):
            return jsonify({"error": "Invalid file type. Use jpg, jpeg, png, webp"}), 400

        os.makedirs(UPLOAD_FOLDER, exist_ok=True)

        filename = secure_filename(file.filename)
        unique_name = f"{email.replace('@','_').replace('.','_')}_{filename}"
        save_path = os.path.join(UPLOAD_FOLDER, unique_name)
        file.save(save_path)

        avatar_url = f"http://127.0.0.1:5000/uploads/avatars/{unique_name}"

    users_collection.insert_one({
        "name": name,
        "email": email,
        "password": hashed_password,
        "profileImageUrl": avatar_url,
        "reset_token": None,
        "reset_token_expiry": None,
        "createdAt": datetime.datetime.utcnow()
    })

    return jsonify({"message": "User registered successfully"}), 200


# =====================================
# LOGIN
# =====================================
@auth.route("/login", methods=["POST"])
def login():
    data = request.json
    email = (data["email"] or "").strip().lower()
    password = data["password"]

    user = users_collection.find_one({"email": email})

    if not user:
        return jsonify({"error": "User not found"}), 404

    if check_password(password, user["password"]):
        access_token = create_access_token(identity=str(user["_id"]))
        return jsonify({
            "message": "Login successful",
            "access_token": access_token,
            "user": {
                "name": user["name"],
                "email": user["email"]
            }
        })

    return jsonify({"error": "Invalid password"}), 401


@auth.route("/me", methods=["GET"])
@jwt_required()
def get_me():
    user_id = get_jwt_identity()

    user = users_collection.find_one({"_id": ObjectId(user_id)})

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "user": {
            "name": user["name"],
            "email": user["email"],
            "createdAt": user.get("createdAt"),
            "profileImageUrl": user.get("profileImageUrl")
        }
    })

@auth.route("/me", methods=["DELETE"])
@jwt_required()
def delete_me():
    user_id = get_jwt_identity()

    user = users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        return jsonify({"error": "User not found"}), 404

    # ✅ Delete avatar file from storage (optional but best)
    avatar_url = user.get("profileImageUrl")
    try:
        if avatar_url and "/uploads/avatars/" in avatar_url:
            filename = avatar_url.split("/uploads/avatars/")[-1]
            file_path = os.path.join(UPLOAD_FOLDER, filename)
            if os.path.exists(file_path):
                os.remove(file_path)
    except Exception as e:
        print("Avatar delete error:", e)

    # ✅ Delete all reports for this user
    reports_collection.delete_many({
        "$or": [
            {"userId": user_id},
            {"userEmail": user.get("email")}
        ]
    })

    # ✅ Delete any pending OTP records for this email
    otp_collection.delete_many({"email": user.get("email")})

    # ✅ Finally delete user
    users_collection.delete_one({"_id": ObjectId(user_id)})

    return jsonify({"message": "Account deleted permanently"}), 200


# =====================================
# FORGOT PASSWORD
# =====================================
@auth.route("/forgot-password", methods=["POST"])
def forgot_password():
    data = request.json
    email = (data["email"] or "").strip().lower()

    user = users_collection.find_one({"email": email})
    if not user:
        return jsonify({"error": "User not found"}), 404

    token = secrets.token_urlsafe(32)
    expiry_time = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(minutes=15)

    users_collection.update_one(
        {"email": email},
        {"$set": {"reset_token": token, "reset_token_expiry": expiry_time}}
    )

    return jsonify({"message": "Reset token generated", "reset_token": token})


@auth.route("/reset-password", methods=["POST"])
def reset_password():
    data = request.json
    token = data["token"]
    new_password = data["new_password"]

    user = users_collection.find_one({
        "reset_token": token,
        "reset_token_expiry": {"$gt": datetime.datetime.now(datetime.timezone.utc)}
    })

    if not user:
        return jsonify({"error": "Invalid or expired token"}), 400

    hashed_password = hash_password(new_password)

    users_collection.update_one(
        {"_id": user["_id"]},
        {"$set": {
            "password": hashed_password,
            "reset_token": None,
            "reset_token_expiry": None
        }}
    )

    return jsonify({"message": "Password reset successful"})

# =====================================
# CONTACT US
# =====================================
@auth.route("/contact", methods=["POST"])
def contact_us():
    data = request.json or {}

    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    subject = (data.get("subject") or "").strip()
    message = (data.get("message") or "").strip()

    if not name or not email or not subject or not message:
        return jsonify({"error": "All fields are required"}), 400

    contact_messages_collection.insert_one({
        "name": name,
        "email": email,
        "subject": subject,
        "message": message,
        "createdAt": datetime.datetime.utcnow()
    })

    return jsonify({
        "message": "Thank you for contacting us. We will get back to you soon."
    }), 200