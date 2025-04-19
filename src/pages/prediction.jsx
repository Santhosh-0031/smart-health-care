import React, { useState } from 'react';
import './prediction.css';

const Prediction = () => {
    const [selectedPrediction, setSelectedPrediction] = useState(null);
    const [result, setResult] = useState('');
    const [confidence, setConfidence] = useState('');
    const [condition, setCondition] = useState('');
    const [loading, setLoading] = useState(false);

    const initialFormStates = {
        diabetes: {
            Glucose: '',
            BloodPressure: '',
            SkinThickness: '',
            Insulin: '',
            BMI: '',
            Age: '',
        },
        bp: {
            level_of_hemoglobin: '',
            age: '',
            bmi: '',
            sex: '',
            smoking: '',
            salt_content: '',
            stress_level: '',
            chronic_kidney_disease: '',
            thyroid_disorders: '',
            systolic_pressure: '',
            diastolic_pressure: '',
        },
        heartDisease: {
            age: '',
            gender: '',
            height: '',
            weight: '',
            ap_hi: '',
            ap_lo: '',
            cholesterol: '',
            gluc: '',
            smoke: '',
            alco: '',
            active: '',
        },
        fever: {
            age: '',
            bmi: '',
            headache: '',
            bodyAche: '',
            chronicConditions: '',
            allergies: '',
            smokingHistory: '',
            alcohol: '',
            humidity: '',
            physicalActivity: '',
            heartRate: '',
            temperature: '',
        }
    };

    const [formStates, setFormStates] = useState(initialFormStates);

    const labels = {
        diabetes: {
            Glucose: 'Glucose',
            BloodPressure: 'Blood Pressure',
            SkinThickness: 'Skin Thickness',
            Insulin: 'Insulin',
            BMI: 'BMI',
            Age: 'Age',
        },
        bp: {
            level_of_hemoglobin: 'Level of Hemoglobin',
            age: 'Age',
            bmi: 'BMI',
            sex: 'Sex (1 for Male, 0 for Female)',
            smoking: 'Smoking (1 for Yes, 0 for No)',
            salt_content: 'Salt Content (1-5)',
            stress_level: 'Stress Level (1-5)',
            chronic_kidney_disease: 'Chronic Kidney Disease (1 for Yes, 0 for No)',
            thyroid_disorders: 'Thyroid Disorders (1 for Yes, 0 for No)',
            systolic_pressure: 'Systolic Pressure',
            diastolic_pressure: 'Diastolic Pressure',
        },
        heartDisease: {
            age: 'Age',
            gender: 'Gender (1 for Male, 0 for Female)',
            height: 'Height (in cm)',
            weight: 'Weight (in kg)',
            ap_hi: 'Systolic Blood Pressure (ap_hi)',
            ap_lo: 'Diastolic Blood Pressure (ap_lo)',
            cholesterol: 'Cholesterol (1 = Normal, 2 = Above Normal, 3 = Well Above Normal)',
            gluc: 'Glucose (1 = Normal, 2 = Above Normal, 3 = Well Above Normal)',
            smoke: 'Do you smoke? (1 = Yes, 0 = No)',
            alco: 'Do you drink alcohol? (1 = Yes, 0 = No)',
            active: 'Are you physically active? (1 = Yes, 0 = No)',
        },
        fever: {
            age: 'Enter Age',
            bmi: 'Enter BMI',
            headache: 'Do you have Headache? (1 for Yes, 0 for No)',
            bodyAche: 'Do you have Body Ache? (1 for Yes, 0 for No)',
            chronicConditions: 'Do you have Chronic Conditions? (1 for Yes, 0 for No)',
            allergies: 'Do you have Allergies? (1 for Yes, 0 for No)',
            smokingHistory: 'Do you have Smoking History? (1 for Yes, 0 for No)',
            alcohol: 'Do you consume Alcohol? (1 for Yes, 0 for No)',
            humidity: 'Enter Humidity (%)',
            physicalActivity: 'Physical Activity Level (Low, Moderate, High)',
            heartRate: 'Heart Rate (bpm)',
            temperature: 'Temperature (°C)',
        },
    };

    const endpoints = {
        diabetes: '/predict/diabetes',
        bp: '/predict/blood-pressure',
        heartDisease: '/predict/heart-disease',
        fever: '/predict/fever',
    };

    const handlePredictionClick = (key) => {
        setSelectedPrediction(key);
        setResult('');
        setConfidence('');
        setCondition('');
    };

    const handleInputChange = (e, formType) => {
        const { name, value } = e.target;
        const newValue = !isNaN(value) && value !== '' ? parseFloat(value) : value;

        setFormStates(prev => ({
            ...prev,
            [formType]: {
                ...prev[formType],
                [name]: newValue,
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedPrediction) return;

        setLoading(true);
        const formData = formStates[selectedPrediction];
        const endpoint = endpoints[selectedPrediction];

        if (Object.values(formData).some(value => value === '' || value === null || value === undefined)) {
            setResult('❌ Please fill in all fields correctly.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:5000${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (response.ok) {
                setResult(data.result || 'Prediction done.');
                setConfidence(data.confidence || '');
                setCondition(data.condition || '');
            } else {
                setResult(data.error || 'An error occurred.');
            }
        } catch (err) {
            console.error(err);
            setResult('❌ Error connecting to the backend.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="prediction-container">
            <h1>Health Prediction Center</h1>
            <div className="prediction-buttons">
                <button onClick={() => handlePredictionClick('diabetes')}>Diabetes</button>
                <button onClick={() => handlePredictionClick('bp')}>Blood Pressure</button>
                <button onClick={() => handlePredictionClick('heartDisease')}>Heart Disease</button>
                <button onClick={() => handlePredictionClick('fever')}>Fever</button>
            </div>

            {selectedPrediction && (
                <form className="prediction-form" onSubmit={handleSubmit}>
                    <h2>{selectedPrediction.replace(/([A-Z])/g, ' $1')} Prediction</h2>
                    {Object.entries(labels[selectedPrediction]).map(([key, label]) => (
                        <div className="form-group" key={key}>
                            <label>{label}:</label>
                            <input
                                type="text"
                                name={key}
                                value={formStates[selectedPrediction][key]}
                                onChange={(e) => handleInputChange(e, selectedPrediction)}
                                required
                            />
                        </div>
                    ))}
                    <button type="submit" disabled={loading}>
                        {loading ? 'Predicting...' : 'Predict'}
                    </button>
                </form>
            )}

            {result && (
                <div className="prediction-result">
                    <h3>Prediction Result</h3>
                    <p><strong>Result:</strong> {result}</p>
                    {confidence && <p><strong>Confidence:</strong> {confidence}</p>}
                    {condition && <p><strong>Condition:</strong> {condition}</p>}
                </div>
            )}
        </div>
    );
};

export default Prediction;
