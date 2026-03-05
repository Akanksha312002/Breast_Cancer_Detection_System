import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Result.css";
import axios from "axios";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

const API_BASE = "http://localhost:5000";

function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;

  if (!data) {
    return <h2 style={{ textAlign: "center" }}>No result found</h2>;
  }

  const chartData = [
    { name: "Image Probability", value: Number(data.image_probability) || 0 },
    { name: "Symptom Score", value: Number(data.symptom_score) || 0 },
    { name: "Total Score", value: Number(data.total_score) || 0 },
  ];

  const barColors = ["#4c6ef5", "#20c997", "#f59f00"];

  // ✅ NEW: Download latest report PDF using _id
  const downloadPdf = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Session expired. Please login again.");
        return;
      }

      const reportId = data?._id;
      if (!reportId) {
        alert("Report ID not found. Please check prediction response.");
        return;
      }

      const res = await axios.get(`${API_BASE}/predictions/${reportId}/pdf`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });

      const blobUrl = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `risk_report_${reportId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (e) {
      console.error(e);
      alert("PDF download failed.");
    }
  };

  return (
    <div className="result-wrapper">
      <div className="result-outer-card">
        <div className="result-inner-card">
          <h2 className="result-heading">
            Prediction <span>Result</span>
          </h2>

          <div className="prediction-type">
            <span>Prediction Type:</span>
            <span
              className={`badge ${
                String(data.prediction_type).toLowerCase() === "malignant"
                  ? "badge-danger"
                  : "badge-safe"
              }`}
            >
              {data.prediction_type}
            </span>
          </div>

          <hr />

          <div className="result-grid">
            <div className="result-left">
              <div className="result-details">
                <p>
                  <span className="dot"></span>
                  <strong>Image Probability:</strong> {data.image_probability}
                </p>

                <p>
                  <span className="dot"></span>
                  <strong>Risk Category:</strong> {data.risk_category}
                </p>

                <p>
                  <span className="dot"></span>
                  <strong>Total Score:</strong> {data.total_score}
                </p>
              </div>
            </div>

            <div className="result-chart">
              <p className="chart-title">Risk Analysis</p>

              <div className="chart-box">
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={chartData} barSize={38}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {chartData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={barColors[index]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <hr />

          <div className="precautions-section">
            <h3>Precautions:</h3>
            <ul>
              {data.precautions?.map((item, index) => (
                <li key={index}>
                  <span className="tick">✓</span> {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="result-buttons">
            {/* ✅ Updated */}
            <button className="download-btn" onClick={downloadPdf} type="button">
              ⬇ Download PDF Report
            </button>

            <button className="back-btn" onClick={() => navigate("/predict")}>
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Result;