import numpy as np
import tensorflow as tf
from flask import Blueprint, request, jsonify, send_file
from PIL import Image
from tensorflow.keras.applications.efficientnet import preprocess_input
import traceback
import datetime
import yagmail

from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import inch

from config import reports_collection, users_collection

from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId
from io import BytesIO

prediction = Blueprint("prediction", __name__)

# =====================================
# Load Model
# =====================================
try:
    model = tf.saved_model.load("models/cancer_saved_model")
    infer = model.signatures["serving_default"]
    print("✅ Model loaded successfully")
except Exception as e:
    print("❌ Model failed to load")
    print(e)

IMG_SIZE = 96


# =====================================
# Risk Calculation
# =====================================
def calculate_risk(age, lump, pain, family_history, image_prob):
    symptom_score = 0

    if age > 45:
        symptom_score += 2
    if str(lump).lower() == "yes":
        symptom_score += 3
    if str(pain).lower() == "yes":
        symptom_score += 1
    if str(family_history).lower() == "yes":
        symptom_score += 2

    image_score = float(image_prob) * 5
    total_score = symptom_score + image_score

    if total_score <= 3:
        category = "Low Risk"
    elif total_score <= 7:
        category = "Moderate Risk"
    else:
        category = "High Risk"

    return symptom_score, total_score, category


# =====================================
# Precautions
# =====================================
def get_precautions(risk_category):
    if risk_category == "Low Risk":
        return [
            "Maintain a healthy lifestyle",
            "Perform regular self-examinations",
            "Schedule routine annual checkups"
        ]
    elif risk_category == "Moderate Risk":
        return [
            "Consult a healthcare professional",
            "Schedule mammography screening",
            "Monitor symptoms carefully"
        ]
    else:
        return [
            "Seek immediate medical consultation",
            "Undergo diagnostic imaging",
            "Follow specialist recommendations"
        ]


# =====================================
# Generate PDF from Mongo document (Bytes)
# =====================================
def generate_pdf_bytes(doc):
    buffer = BytesIO()
    pdf = SimpleDocTemplate(buffer)
    styles = getSampleStyleSheet()
    elements = []

    # Title
    elements.append(Paragraph("<b>Breast Cancer Risk Assessment Report</b>", styles["Title"]))
    elements.append(Spacer(1, 0.2 * inch))

    # ✅ Fetch Patient Name from users collection
    patient_name = "N/A"
    user_id = doc.get("userId")

    if user_id:
        try:
            user = users_collection.find_one({"_id": ObjectId(user_id)})
            if user:
                patient_name = user.get("name", "N/A")
        except:
            pass

    # Date formatting
    report_date = doc.get("timestamp")
    if report_date:
        try:
            formatted_date = report_date.strftime("%d %B %Y, %I:%M %p")
        except:
            formatted_date = str(report_date)
    else:
        formatted_date = "N/A"

    elements.append(Paragraph(f"<b>Date:</b> {formatted_date}", styles["Normal"]))
    elements.append(Paragraph(f"<b>Patient Name:</b> {patient_name}", styles["Normal"]))
    elements.append(Spacer(1, 0.3 * inch))

    # Patient Details
    elements.append(Paragraph("<b>Patient Details</b>", styles["Heading2"]))
    elements.append(Spacer(1, 0.2 * inch))

    elements.append(Paragraph(f"Age: {doc.get('age','-')}", styles["Normal"]))
    elements.append(Paragraph(f"Lump Present: {doc.get('lump','-')}", styles["Normal"]))
    elements.append(Paragraph(f"Pain: {doc.get('pain','-')}", styles["Normal"]))
    elements.append(Paragraph(f"Family History: {doc.get('family_history','-')}", styles["Normal"]))
    elements.append(Spacer(1, 0.3 * inch))

    # Prediction Results
    elements.append(Paragraph("<b>Prediction Results</b>", styles["Heading2"]))
    elements.append(Spacer(1, 0.2 * inch))

    elements.append(Paragraph(f"AI Image Probability: {float(doc.get('image_probability',0)):.6f}", styles["Normal"]))
    elements.append(Paragraph(f"Symptom Score: {float(doc.get('symptom_score',0)):.2f}", styles["Normal"]))
    elements.append(Paragraph(f"Total Risk Score: {float(doc.get('total_score',0)):.2f}", styles["Normal"]))
    elements.append(Paragraph(f"<b>Risk Category: {doc.get('risk_category','-')}</b>", styles["Normal"]))
    elements.append(Spacer(1, 0.3 * inch))

    # Precautions
    precautions = doc.get("precautions", [])
    if precautions and isinstance(precautions, list):
        elements.append(Paragraph("<b>Recommended Precautions:</b>", styles["Heading2"]))
        elements.append(Spacer(1, 0.2 * inch))
        for p in precautions:
            elements.append(Paragraph(f"- {p}", styles["Normal"]))

    elements.append(Spacer(1, 0.4 * inch))

    # Footer Disclaimer
    elements.append(Paragraph(
        "<i>This report is AI-generated and for educational purposes only. Please consult a medical professional for proper diagnosis.</i>",
        styles["Normal"]
    ))

    pdf.build(elements)
    buffer.seek(0)
    return buffer


# =====================================
# Predict Route (JWT Required)
# =====================================
@prediction.route("/predict", methods=["POST"])
@jwt_required()
def predict():
    try:
        if "image" not in request.files:
            return jsonify({"error": "No image uploaded"}), 400

        file = request.files["image"]

        # Load + preprocess image
        image = Image.open(file.stream).convert("RGB")
        image = image.resize((IMG_SIZE, IMG_SIZE))

        img_array = np.array(image)
        img_array = np.expand_dims(img_array, axis=0)
        img_array = preprocess_input(img_array)
        img_array = img_array.astype("float32")

        input_tensor = tf.convert_to_tensor(img_array)

        input_name = list(infer.structured_input_signature[1].keys())[0]
        output = infer(**{input_name: input_tensor})

        prediction_value = float(list(output.values())[0].numpy()[0][0])
        prediction_type = "Malignant" if prediction_value >= 0.5 else "Benign"

        # Form fields
        age = int(request.form["age"])
        lump = request.form["lump"]
        pain = request.form["pain"]
        family_history = request.form["family_history"]

        symptom_score, total_score, risk_category = calculate_risk(
            age, lump, pain, family_history, prediction_value
        )

        precautions = get_precautions(risk_category)

        # ✅ Attach user
        user_id = get_jwt_identity()  # stored as string in JWT
        user_email = None
        try:
            u = users_collection.find_one({"_id": ObjectId(user_id)})
            if u:
                user_email = u.get("email")
        except:
            pass

        mongo_data = {
            "userId": user_id,
            "userEmail": user_email,

            "age": age,
            "lump": lump,
            "pain": pain,
            "family_history": family_history,

            "image_probability": prediction_value,
            "prediction_type": prediction_type,
            "symptom_score": symptom_score,
            "total_score": float(total_score),
            "risk_category": risk_category,
            "precautions": precautions,

            "timestamp": datetime.datetime.utcnow()
        }

        inserted = reports_collection.insert_one(mongo_data)

        return jsonify({
            "_id": str(inserted.inserted_id),
            "image_probability": round(prediction_value, 6),
            "prediction_type": prediction_type,
            "symptom_score": symptom_score,
            "total_score": round(float(total_score), 2),
            "risk_category": risk_category,
            "precautions": precautions
        }), 200

    except Exception:
        traceback.print_exc()
        return jsonify({"error": "Prediction failed"}), 500


# =====================================
# Latest Prediction for Logged-in User
# =====================================
@prediction.route("/predictions/latest", methods=["GET"])
@jwt_required()
def latest_prediction():
    user_id = get_jwt_identity()

    doc = reports_collection.find_one(
        {"userId": user_id},
        sort=[("timestamp", -1)]
    )

    if not doc:
        return jsonify({"prediction": None}), 200

    doc["_id"] = str(doc["_id"])
    return jsonify({"prediction": doc}), 200


# =====================================
# All Predictions for Logged-in User
# =====================================
@prediction.route("/predictions", methods=["GET"])
@jwt_required()
def all_predictions():
    user_id = get_jwt_identity()

    cursor = reports_collection.find({"userId": user_id}).sort("timestamp", -1)
    results = []
    for d in cursor:
        d["_id"] = str(d["_id"])
        results.append(d)

    return jsonify({"predictions": results}), 200


# =====================================
# Download PDF for a specific report (Owner only)
# =====================================
@prediction.route("/predictions/<report_id>/pdf", methods=["GET"])
@jwt_required()
def download_report_pdf(report_id):
    user_id = get_jwt_identity()

    try:
        doc = reports_collection.find_one({"_id": ObjectId(report_id)})
    except:
        return jsonify({"error": "Invalid report id"}), 400

    if not doc:
        return jsonify({"error": "Report not found"}), 404

    # ✅ security check
    if str(doc.get("userId")) != str(user_id):
        return jsonify({"error": "Unauthorized"}), 403

    pdf_buffer = generate_pdf_bytes(doc)

    return send_file(
        pdf_buffer,
        as_attachment=True,
        download_name=f"risk_report_{report_id}.pdf",
        mimetype="application/pdf"
    )

@prediction.route("/predictions/<report_id>/email", methods=["POST"])
@jwt_required()
def email_report(report_id):
    user_id = get_jwt_identity()

    try:
        doc = reports_collection.find_one({"_id": ObjectId(report_id)})
    except:
        return jsonify({"error": "Invalid report id"}), 400

    if not doc:
        return jsonify({"error": "Report not found"}), 404

    # Security check
    if str(doc.get("userId")) != str(user_id):
        return jsonify({"error": "Unauthorized"}), 403

    # Get user email
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        return jsonify({"error": "User not found"}), 404

    recipient_email = user.get("email")

    # Generate PDF
    pdf_buffer = generate_pdf_bytes(doc)

    # Send Email (Use Gmail App Password)
    try:
        yag = yagmail.SMTP(
            user="ghorpadeakanksha31@gmail.com",
            password="xwli mwxt snbu dqgz"
        )

        yag.send(
            to=recipient_email,
            subject="Your Breast Cancer Risk Report",
            contents="Please find your AI-generated risk report attached.",
            attachments=[pdf_buffer]
        )

        return jsonify({"message": "Report sent successfully to your email!"}), 200

    except Exception as e:
        print(e)
        return jsonify({"error": "Email sending failed"}), 500