import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Predict.css";
import shield from "../assets/Predict_shield3.png"; // shield image

function Predict() {
  const [image, setImage] = useState(null);
  const [age, setAge] = useState("");
  const [lump, setLump] = useState("");
  const [pain, setPain] = useState("");
  const [familyHistory, setFamilyHistory] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!image || !age || !lump || !pain || !familyHistory) {
      setError("Please fill in all fields before predicting.");
      return;
    }
  
    if (age <= 0 || age > 100) {
      setError("Please enter a valid age.");
      return;
    }
  
    setError("");
  
    const formData = new FormData();
    formData.append("image", image);
    formData.append("age", age);
    formData.append("lump", lump);
    formData.append("pain", pain);
    formData.append("family_history", familyHistory);
  
    try {
      const token = localStorage.getItem("token");
  
      const response = await axios.post("http://127.0.0.1:5000/predict", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
  
      navigate("/result", { state: response.data });
    } catch (err) {
      console.error(err);
      alert("Prediction failed. Please try again.");
    }
  };

  return (
    <div className="predict-wrapper">
      {/* MAIN GLASS CARD */}
      <div className="outer-card">
        {/* TOP TITLE CARD */}
        <div className="title-card">
          <h2>Breast Cancer Risk Prediction</h2>
          <p>Fill in the information below to assess your breast cancer risk.</p>
        </div>

        {/* ✅ FORM START */}
        <form onSubmit={handleSubmit}>
          {/* INNER FORM CARD */}
          <div className="form-card" style={{ "--shield": `url(${shield})` }}>
            <div className="form-grid">
              {/* IMAGE */}
              <label>Breast Tissue Image:</label>
              <div>
              <input
              type="file"
              accept=".jpg,.png,.tif"
              onChange={(e) => setImage(e.target.files[0])}
              required
            />

                <span className="file-types">File types: JPG, PNG, TIF</span>
              </div>

              <hr className="divider" />

              {/* AGE */}
              <label>Age:</label>
              <input
                type="number"
                placeholder="Enter age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="predict-small-input"
                required
              />

              {/* LUMP */}
              <label>Lump Present:</label>
              <select
                value={lump}
                onChange={(e) => setLump(e.target.value)}
                className="predict-small-select"
                required
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>

              {/* PAIN */}
              <label>Pain:</label>
              <select
                value={pain}
                onChange={(e) => setPain(e.target.value)}
                className="predict-small-select"
                required
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>

              {/* FAMILY HISTORY */}
              <label>Family History:</label>
              <select
                value={familyHistory}
                onChange={(e) => setFamilyHistory(e.target.value)}
                className="predict-small-select"
                required
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            {/* ✅ Error message (keeps UI clean) */}
            {error && <p className="predict-error">{error}</p>}

            <hr className="divider divider-bottom" />
            <button type="submit" className="predict-btn">
              Predict
            </button>
          </div>
        </form>
        {/* ✅ FORM END */}

        {/* FOOTER TEXT */}
        <p className="footer-text">
          ⚠ This tool is for educational purposes only and does not provide a medical diagnosis.
        </p>
      </div>
    </div>
  );
}

export default Predict;