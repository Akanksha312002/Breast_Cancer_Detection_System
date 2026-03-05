from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from datetime import timedelta

from routes.prediction_routes import prediction
from routes.auth_routes import auth

app = Flask(__name__)
CORS(app)

app.config["JWT_SECRET_KEY"] = "change_this_to_a_strong_secret_key_123"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=7)  # or hours=6
jwt = JWTManager(app)

app.register_blueprint(prediction)
app.register_blueprint(auth)

@app.route("/")
def home():
    return "Server is running successfully 🚀"

if __name__ == "__main__":
    app.run(debug=True)