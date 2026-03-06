from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

client = MongoClient(MONGO_URI)
db = client["breast_cancer_db"]

users_collection = db["users"]
reports_collection = db["risk_reports"]
otp_collection = db["signup_otps"]
contact_messages_collection = db["contact_messages"]