from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
import pandas as pd
import pickle
import tensorflow as tf
from sklearn.preprocessing import StandardScaler
import numpy as np
import logging

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Paths to model and scaler files
DIABETES_MODEL_PATH = r"C:/Users/Dell 5410/Desktop/PN-healthcare/backend/models/diabetes_nn_model.pth"
DIABETES_SCALER_PATH = r"C:/Users/Dell 5410/Desktop/PN-healthcare/backend/models/scaler (1).pkl"
BP_MODEL_PATH = r"C:/Users/Dell 5410/Desktop/PN-healthcare/backend/models/improved_blood_pressure_model (1).h5"
HEART_DISEASE_MODEL_PATH = r"C:/Users/Dell 5410/Desktop/PN-healthcare/backend/models/cardio_model (1).pth"
FEVER_MODEL_PATH = r"C:/Users/Dell 5410/Desktop/PN-healthcare/backend/models/fever_model_with_temperature.h5"

# Load the diabetes model
class DiabetesNN(torch.nn.Module):
    def __init__(self, input_size):
        super(DiabetesNN, self).__init__()
        self.fc1 = torch.nn.Linear(input_size, 128)
        self.fc2 = torch.nn.Linear(128, 64)
        self.fc3 = torch.nn.Linear(64, 1)
        self.relu = torch.nn.ReLU()
        self.sigmoid = torch.nn.Sigmoid()

    def forward(self, x):
        x = self.relu(self.fc1(x))
        x = self.relu(self.fc2(x))
        x = self.sigmoid(self.fc3(x))
        return x

# Initialize the diabetes model
try:
    input_size = 6
    diabetes_model = DiabetesNN(input_size)
    diabetes_model.load_state_dict(torch.load(DIABETES_MODEL_PATH, map_location=torch.device("cpu")))
    diabetes_model.eval()
except Exception as e:
    raise RuntimeError(f"Error loading diabetes model: {str(e)}")

# Load the diabetes scaler
try:
    with open(DIABETES_SCALER_PATH, "rb") as f:
        diabetes_scaler = pickle.load(f)
except Exception as e:
    raise RuntimeError(f"Error loading diabetes scaler: {str(e)}")

# Load the blood pressure model
try:
    bp_model = tf.keras.models.load_model(BP_MODEL_PATH)
except Exception as e:
    raise RuntimeError(f"Error loading blood pressure model: {str(e)}")

# Load the heart disease model
class HeartDiseaseModel(torch.nn.Module):
    def __init__(self):
        super(HeartDiseaseModel, self).__init__()
        self.fc = torch.nn.Sequential(
            torch.nn.Linear(11, 64),
            torch.nn.ReLU(),
            torch.nn.Linear(64, 32),
            torch.nn.ReLU(),
            torch.nn.Linear(32, 3)  # 3 classes for heart disease
        )

    def forward(self, x):
        return self.fc(x)

try:
    heart_disease_model = HeartDiseaseModel()
    heart_disease_model.load_state_dict(torch.load(HEART_DISEASE_MODEL_PATH, map_location=torch.device("cpu")), strict=False)
    heart_disease_model.eval()
except Exception as e:
    raise RuntimeError(f"Error loading heart disease model: {str(e)}")

# Load the fever model
try:
    fever_model = tf.keras.models.load_model(FEVER_MODEL_PATH)
    fever_scaler = StandardScaler()
    fever_training_data = pd.read_json(r"C:/Users/Dell 5410/Desktop/PN-healthcare/backend/models/updated_data (4) (1).json", lines=True)
    fever_features = fever_training_data[['Age', 'BMI', 'Headache', 'Body_Ache', 'Chronic_Conditions', 
                                           'Allergies', 'Smoking_History', 'Alcohol_Consumption', 
                                           'Humidity', 'Physical_Activity', 'Heart_Rate','Temperature']].values
    fever_scaler.fit(fever_features)
except Exception as e:
    raise RuntimeError(f"Error loading fever model or data: {str(e)}")

# Helper function for blood pressure type
def determine_bp_type(systolic, diastolic):
    if systolic < 90 or diastolic < 60:
        return "Low Blood Pressure (Hypotension)"
    elif systolic < 120 and diastolic < 80:
        return "Normal Blood Pressure"
    elif 120 <= systolic < 130 and diastolic < 80:
        return "Elevated Blood Pressure (Prehypertension)"
    elif 130 <= systolic < 140 or 80 <= diastolic < 90:
        return "Hypertension Stage 1"
    elif systolic >= 140 or diastolic >= 90:
        return "Hypertension Stage 2"
    elif systolic > 180 or diastolic > 120:
        return "Hypertensive Crisis"
    elif systolic > 140 and diastolic < 90:
        return "Isolated Systolic Hypertension"
    else:
        return "Unknown"

scaler = StandardScaler()

# Endpoint to predict diabetes
@app.route('/predict/diabetes', methods=['POST'])
def predict_diabetes():
    try:
        data = request.get_json()
        required_fields = ['Glucose', 'BloodPressure', 'SkinThickness', 'Insulin', 'BMI', 'Age']
        
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing fields in input data"}), 400

        input_data = pd.DataFrame([data])
        scaled_input = diabetes_scaler.transform(input_data)
        input_tensor = torch.tensor(scaled_input, dtype=torch.float32)

        with torch.no_grad():
            prediction = diabetes_model(input_tensor)
            probability = prediction.item()

        probability_percentage = probability * 100

        if data["Age"] < 25 and data["Insulin"] < 10 and data["Glucose"] < 100:
            diabetes_type = "Type 1"
        elif data["Age"] >= 45 and data["BMI"] > 35 and data["Insulin"] < 50:
            diabetes_type = "Type 2"
        elif 18 <= data["Age"] <= 45 and data["Insulin"] >= 50:
            diabetes_type = "Gestational"
        else:
            diabetes_type = "Unknown"

        result = {
            "result": f"Diabetes detected with {probability_percentage:.2f}% likelihood. Type: {diabetes_type}" if probability >= 0.5
            else f"No Diabetes detected with {100 - probability_percentage:.2f}% likelihood. Type: {diabetes_type}"
        }
        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Endpoint to predict blood pressure
@app.route('/predict/blood-pressure', methods=['POST'])
def predict_blood_pressure():
    try:
        data = request.get_json()
        required_fields = ['level_of_hemoglobin', 'age', 'bmi', 'sex', 'smoking', 'salt_content', 
                           'stress_level', 'chronic_kidney_disease', 'thyroid_disorders', 
                           'systolic_pressure', 'diastolic_pressure']

        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing fields in input data"}), 400

        systolic = data['systolic_pressure']
        diastolic = data['diastolic_pressure']
        
        # Use the new BP type determination function
        bp_type = determine_bp_type(systolic, diastolic)

        result = {
            "result": f"Predicted Blood Pressure Type: {bp_type}"
        }
        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Endpoint to predict heart disease
@app.route('/predict/heart-disease', methods=['POST'])
def predict_heart_disease():
    try:
        data = request.get_json()
        required_fields = ['age', 'gender', 'height', 'weight', 'ap_hi', 'ap_lo', 'cholesterol', 'gluc', 'smoke', 'alco', 'active']

        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing fields in input data"}), 400

        age = data['age']
        ap_hi = data['ap_hi']
        ap_lo = data['ap_lo']
        cholesterol = data['cholesterol']
        gluc = data['gluc']
        smoke = data['smoke']

        if age < 40 and ap_hi < 120 and ap_lo < 80 and cholesterol == 1 and gluc == 1:
            prediction = 0
            confidence = 1.0
        elif (age > 40 and ap_hi > 130 and ap_lo > 85) or cholesterol == 3 or gluc == 3:
            prediction = 2
            confidence = 1.0
        elif smoke == 1 or (age > 50 and ap_hi > 120):
            prediction = 1
            confidence = 1.0
        else:
            input_data = [data[field] for field in required_fields]
            input_tensor = torch.tensor([input_data], dtype=torch.float32)

            with torch.no_grad():
                output = heart_disease_model(input_tensor)
                prediction = torch.argmax(output, dim=1).item()
                confidence = torch.softmax(output, dim=1).max().item()

        disease_types = {
            0: "No heart disease",
            1: "Coronary artery disease",
            2: "Heart failure"
        }

        conditions = {
            0: "Great! You don't show signs of heart disease. Continue maintaining a healthy lifestyle.",
            1: "The prediction suggests a possibility of coronary artery disease. Please consult a doctor for further evaluation.",
            2: "The prediction indicates potential heart failure. Immediate medical attention is recommended."
        }

        result = {
            "result": disease_types[prediction],
            "confidence": f"{confidence * 100:.2f}%",
            "condition": conditions[prediction]
        }

        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# Endpoint to predict fever
@app.route('/predict/fever', methods=['POST'])
def predict_fever():
    try:
        data = request.get_json()
        logging.info("Received input data: %s", data)

        # Required fields
        required_fields = ['Age', 'BMI', 'Headache', 'Body_Ache', 'Chronic_Conditions', 
                           'Allergies', 'Smoking_History', 'Alcohol_Consumption', 'Humidity', 
                           'Physical_Activity', 'Heart_Rate', 'Temperature']

        # Check for missing fields
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({"error": f"Missing fields in input data: {', '.join(missing_fields)}"}), 400

        # Prepare input features
        input_features = [
            float(data['Age']),
            float(data['BMI']),
            int(data['Headache']),
            int(data['Body_Ache']),
            int(data['Chronic_Conditions']),
            int(data['Allergies']),
            int(data['Smoking_History']),
            int(data['Alcohol_Consumption']),
            float(data['Humidity']),
            float(data['Physical_Activity']),
            float(data['Heart_Rate']),
            float(data['Temperature'])
        ]

        # Normalize input
        normalized_input = fever_scaler.transform([input_features])

        # Predict using the model
        predictions = fever_model.predict(normalized_input)
        fever_severity = np.argmax(predictions[0])  # First output
        fever_type = np.argmax(predictions[1])  # Second output
        medication_class = np.argmax(predictions[2])  # Third output

        # Adjust predictions based on temperature
        temperature = float(data['Temperature'])
        if temperature < 37:
            fever_severity = 0
            fever_type = 0
            medication_class = 0
        elif 37 <= temperature < 38:
            fever_severity = 1
            medication_class = 1
        else:
            fever_severity = 2
            medication_class = 2

        # Map results
        fever_severity_map = {0: "Normal", 1: "Low", 2: "High"}
        fever_type_map = {0: "No Fever", 1: "Viral", 2: "Bacterial"}
        medication_map = {0: "None", 1: "Paracetamol", 2: "Ibuprofen"}

        result = {
            "Fever Severity": fever_severity_map[fever_severity],
            "Fever Type": fever_type_map[fever_type],
            "Recommended Medication": medication_map[medication_class]
        }

        return jsonify({"result": result})

    except Exception as e:
        logging.error("Error in fever prediction: %s", str(e))
        return jsonify({"error": str(e)}), 500

# Configure logging
logging.basicConfig(level=logging.INFO)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
