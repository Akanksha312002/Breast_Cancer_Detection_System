# Breast Cancer Detection System

A full-stack web application that helps in **early risk assessment of breast cancer** using a machine learning model combined with symptom-based analysis.

The system allows users to upload breast tissue images, enter health symptoms, and receive an AI-generated risk prediction along with a downloadable medical report.

---

## Project Overview

Breast cancer is one of the most common cancers among women worldwide. Early detection significantly improves treatment success and survival rates.

This project aims to spread **awareness and early risk indication** through a web-based platform that combines:

* Image-based prediction using a trained ML model
* Symptom-based risk scoring
* AI-generated precaution suggestions
* Medical report generation

---

## Tech Stack

### Frontend

* React (Vite)
* HTML5
* CSS3
* JavaScript
* Recharts (data visualization)

### Backend

* Python
* Flask

### Machine Learning

* TensorFlow
* CNN model for image classification

### Database

* MongoDB Atlas

### Authentication

* JWT (JSON Web Tokens)
* Bcrypt password hashing

### Other Libraries

* Axios
* ReportLab (PDF generation)
* Yagmail (Email reports)

---

## Features

### User Authentication

* User Signup & Login
* Secure password hashing
* JWT-based authentication

### Risk Prediction

Users can:

* Upload breast tissue images
* Enter symptoms such as:

  * Age
  * Lump presence
  * Pain
  * Family history

The system analyzes the data and predicts:

* Image probability
* Symptom score
* Total risk score
* Risk category (Low / Moderate / High)

---

### Visualization

Prediction results are displayed using interactive charts for better understanding.

---

### Medical Report Generation

Users can:

* Download a **PDF medical report**
* Receive the report via **email**

---

### User Dashboard

Logged-in users can:

* View previous prediction reports
* Download past reports
* Manage profile information

---

### Breast Cancer Awareness Page

The system includes an educational section containing:

* Causes of breast cancer
* Risk factors
* Symptoms
* Prevention tips
* Self-examination awareness

---

### FAQ Chatbot

A simple chatbot that helps users get quick answers about breast cancer awareness and system usage.

---

## Project Structure

```
Breast_Cancer_Detection_System
│
├── Backend
│   ├── models
│   ├── routes
│   ├── utils
│   └── app.py
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── layouts
│   │   └── styles
│   └── package.json
│
└── README.md
```

---
## Installation

Clone the repository

git clone https://github.com/Akanksha312002/Breast_Cancer_Detection_System.git

Backend setup

cd Backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

Frontend setup

cd ../frontend
npm install
npm run dev


## How to Run the Project

### Backend Setup

1. Navigate to backend folder

```
cd Backend
```

2. Create virtual environment

```
python -m venv venv
```

3. Activate environment

```
venv\Scripts\activate
```

4. Install dependencies

```
pip install -r requirements.txt
```

5. Run the server

```
python app.py
```

---

### Frontend Setup

1. Navigate to frontend folder

```
cd frontend
```

2. Install dependencies

```
npm install
```

3. Start development server

```
npm run dev
```

---

## Future Improvements

* Real medical dataset integration
* Advanced AI models
* Doctor consultation integration
* Real-time chatbot support
* Mobile application

---

## Disclaimer

This project is developed for **educational and awareness purposes only**.
It does **not provide medical diagnosis**. Users should always consult qualified medical professionals for proper medical advice.

---

## Author

**Akanksha Ghorpade**

BCS Graduate
Aspiring React Developer & Full-Stack Developer
