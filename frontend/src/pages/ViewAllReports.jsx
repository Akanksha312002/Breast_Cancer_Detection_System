import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "../styles/ViewAllReports.css";

const API_BASE = "http://localhost:5000";

function ViewAllReports() {
  const [reports, setReports] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  const token = useMemo(() => localStorage.getItem("token"), []);
  const headers = useMemo(
    () => ({ Authorization: `Bearer ${token}` }),
    [token]
  );

  useEffect(() => {
    if (!token) {
      setErr("Token not found. Please login again.");
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        setErr("");
        const res = await axios.get(`${API_BASE}/predictions`, { headers });
        setReports(res.data.predictions || []);
      } catch (e) {
        console.error(e);
        setErr("Failed to load reports. Please login again.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token, headers]);

  const formatDate = (iso) => {
    if (!iso) return "-";
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? iso : d.toLocaleString();
  };

  const downloadPdf = async (id) => {
    try {
      const res = await axios.get(`${API_BASE}/predictions/${id}/pdf`, {
        headers,
        responseType: "blob",
      });

      const blobUrl = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `risk_report_${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (e) {
      console.error(e);
      alert("PDF download failed.");
    }
  };

  const sendEmail = async (id) => {
    try {
      await axios.post(`${API_BASE}/predictions/${id}/email`, {}, { headers });
      alert("Report sent to your email successfully!");
    } catch (e) {
      console.error(e);
      alert("Failed to send email.");
    }
  };

    // ✅ add these BEFORE return
    if (loading) return <p style={{ padding: 30 }}>Loading...</p>;
    if (err) return <p style={{ padding: 30, color: "red" }}>{err}</p>;
    if (!reports.length) return <p style={{ padding: 30 }}>No reports yet.</p>;

  return (
    <div className="vrPage">
      <div className="vrContainer">
        <h2 className="vrTitle">All Risk Reports</h2>

        {loading && <p className="vrMuted">Loading reports...</p>}
        {!loading && err && <div className="vrError">{err}</div>}

        {!loading && !err && reports.length === 0 && (
          <div className="vrEmpty">
            No reports yet. Go to <b>Check Risk</b> to generate one.
          </div>
        )}

        {!loading && !err && reports.length > 0 && (
          <div className="vrTableWrap">
            <table className="vrTable">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Risk</th>
                  <th>Prediction</th>
                  <th>Total Score</th>
                  <th>Precautions</th>
                  <th>PDF</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r._id}>
                    <td>{formatDate(r.timestamp)}</td>
                    <td>{r.risk_category}</td>
                    <td>{r.prediction_type}</td>
                    <td>{Number(r.total_score).toFixed(2)}</td>
                    <td className="vrPrecautions">
                      {Array.isArray(r.precautions) ? r.precautions.join(", ") : "-"}
                    </td>
                    <td>
                      <button className="vrBtn" onClick={() => downloadPdf(r._id)}>
                        Download
                      </button>

                      <button className="vrBtn" style={{ marginLeft: "8px", background: "#4CAF50" }} onClick={() => sendEmail(r._id)}>
                        Email
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewAllReports;