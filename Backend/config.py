from pymongo import MongoClient

MONGO_URI = "mongodb+srv://goodhopes027_db_user:ZeVTxKUlxwQ6GeL5@cluster0.qstfc3s.mongodb.net/?appName=Cluster0"

client = MongoClient(MONGO_URI)
db = client["breast_cancer_db"]

users_collection = db["users"]
reports_collection = db["risk_reports"]

# ✅ NEW: OTP collection
otp_collection = db["signup_otps"]