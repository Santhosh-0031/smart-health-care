// prediction.jsx
import React, { useState } from 'react';
import './prediction.css';

const Prediction = () => {
  const [showBoxes, setShowBoxes] = useState(false);
  const [selectedPrediction, setSelectedPrediction] = useState(null);

  const handleStartClick = () => {
    setShowBoxes(true);
  };

  const handlePredictionClick = (type) => {
    setSelectedPrediction(type);
  };

  const renderForm = () => (
    <div className="form-container">
      <h2 className="form-title">{selectedPrediction} Prediction Form</h2>
      <form className="prediction-form">
        <label htmlFor="age">Age:</label>
        <input type="number" id="age" placeholder="Enter your age" required />

        <label htmlFor="weight">Weight (kg):</label>
        <input type="number" id="weight" placeholder="Enter your weight" required />

        <label htmlFor="symptoms">Symptoms:</label>
        <textarea id="symptoms" rows="4" placeholder="Describe your symptoms" required></textarea>

        <button type="submit" className="submit-btn">Submit</button>
        <button className="back-btn" onClick={() => setSelectedPrediction(null)}>Back</button>
      </form>
    </div>
  );

  return (
    <div className="prediction-page">
      {!showBoxes ? (
        <div className="start-container">
          <button className="start-btn" onClick={handleStartClick}>Start Prediction</button>
        </div>
      ) : selectedPrediction ? (
        renderForm()
      ) : (
        <div className="prediction-grid">
          <div className="prediction-box" onClick={() => handlePredictionClick('Diabetes')}>
            <span role="img" aria-label="drop">🩸</span>
            <h3>Diabetes</h3>
          </div>
          <div className="prediction-box" onClick={() => handlePredictionClick('Blood Pressure')}>
            <span role="img" aria-label="heart">❤️‍🩹</span>
            <h3>Blood Pressure</h3>
          </div>
          <div className="prediction-box" onClick={() => handlePredictionClick('Heart Disease')}>
            <span role="img" aria-label="heart">❤️</span>
            <h3>Heart Disease</h3>
          </div>
          <div className="prediction-box" onClick={() => handlePredictionClick('Fever')}>
            <span role="img" aria-label="thermometer">🌡️</span>
            <h3>Fever</h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default Prediction;