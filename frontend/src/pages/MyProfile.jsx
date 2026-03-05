import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "../styles/MyProfile.css";
import bg from "../assets/background.png";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:5000";

function MyProfile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [latest, setLatest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [showPopup, setShowPopup] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupMsg, setPopupMsg] = useState("");

  // ✅ token + headers accessible everywhere
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

    const loadData = async () => {
      try {
        setLoading(true);
        setErr("");

        const meRes = await axios.get(`${API_BASE}/me`, { headers });
        setUser(meRes.data.user);

        const predRes = await axios.get(`${API_BASE}/predictions/latest`, { headers });
        setLatest(predRes.data.prediction);
      } catch (e) {
        console.error(e);

        const status = e?.response?.status;
        const msg = e?.response?.data?.msg || e?.response?.data?.error || "";

        if (status === 401 || status === 422) {
          setErr("Session expired. Please login again.");
        } else {
          setErr(`Failed to load profile data. ${msg}`);
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [token, headers]);

  const formatDate = (iso) => {
    if (!iso) return "-";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString();
  };

  const safe = (v) => (v === null || v === undefined || v === "" ? "-" : String(v));

  const formatNumber = (num, digits = 4) => {
    if (num === null || num === undefined || num === "") return "-";
    const n = Number(num);
    if (Number.isNaN(n)) return String(num);
    return n.toFixed(digits);
  };

  // ✅ Download latest PDF
  const downloadLatestPdf = async () => {
    if (!latest?._id) return;

    try {
      const res = await axios.get(`${API_BASE}/predictions/${latest._id}/pdf`, {
        headers,
        responseType: "blob",
      });

      const blobUrl = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `risk_report_${latest._id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (e) {
      console.error(e);
      alert("PDF download failed.");
    }
  };

  const handleDeleteAccount = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login again.");
      return;
    }

    const sure = window.confirm(
      "Are you sure? This will permanently delete your account and all reports. This cannot be undone."
    );
    if (!sure) return;

    try {
      await axios.delete(`${API_BASE}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // clear everything
      localStorage.removeItem("token");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userName");
      localStorage.removeItem("userEmail");

      alert("Account deleted successfully.");
      window.location.href = "/signup"; // or navigate("/signup")
    } catch (e) {
      console.error(e);
      alert("Failed to delete account.");
    }
  };

  const openComingSoon = (title, msg) => {
    setPopupTitle(title);
    setPopupMsg(msg);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setPopupTitle("");
    setPopupMsg("");
  };

  return (
    <div className="mpPage" style={{ "--bg-image": `url(${bg})` }}>
      <div className="mpContainer">
        <h1 className="mpTitle">My Profile</h1>

        {loading && (
          <div className="mpCard mpInfoCard">
            <p className="mpMuted">Loading profile...</p>
          </div>
        )}

        {!loading && err && (
          <div className="mpCard mpInfoCard mpError">
            <p>{err}</p>
          </div>
        )}

        {!loading && !err && user && (
          <div className="mpGrid">
            {/* LEFT */}
            <aside className="mpCard mpLeft">
              <div className="mpAvatarWrap">
                <img
                  className="mpAvatar"
                  src={user.profileImageUrl || "/images/avatar.jpg"}
                  alt="Profile"
                />
              </div>

              <h2 className="mpName">{safe(user.name)}</h2>
              <p className="mpEmail">{safe(user.email)}</p>

              <div className="mpSmallInfo">
                <div className="mpRow">
                  <span className="mpLabel">Member Since:</span>
                  <span className="mpValue">{formatDate(user.createdAt)}</span>
                </div>
              </div>

              <div className="mpBtnRow">
                <button
                  className="mpBtnPrimary"
                  type="button"
                  onClick={() =>
                    openComingSoon(
                      "Edit Profile",
                      "This feature will be available soon and will allow you to update your name and profile photo."
                    )
                  }
                >
                  Edit Profile
                </button>
                <button
                  className="mpBtnSecondary"
                  type="button"
                  onClick={() =>
                    openComingSoon(
                      "Change Password",
                      "This feature will be available soon and will allow you to change your password securely."
                    )
                  }
                >
                  Change Password
                </button>
              </div>
              <button className="mpBtnDanger" type="button" onClick={handleDeleteAccount}>
                Delete My Account
              </button>
            </aside>

            {/* RIGHT */}
            <section className="mpRight">
              {/* STATS */}
              <div className="mpCard mpSection">
                <div className="mpSectionHeader">Health &amp; Prediction Stats</div>

                <div className="mpStats">
                  <div className="mpStatBox">
                    <div className="mpIcon">🎗️</div>
                    <div className="mpStatTitle">Risk Category</div>
                    <div className="mpPill neutral">{safe(latest?.risk_category || "No data")}</div>
                  </div>

                  <div className="mpStatBox">
                    <div className="mpIcon">🧠</div>
                    <div className="mpStatTitle">Prediction Type</div>
                    <div className="mpPill warn">{safe(latest?.prediction_type || "No data")}</div>
                  </div>

                  <div className="mpStatBox">
                    <div className="mpIcon">📅</div>
                    <div className="mpStatTitle">Last Prediction</div>
                    <div className="mpPill neutral">{formatDate(latest?.timestamp)}</div>
                  </div>
                </div>
              </div>

              {/* BOTTOM */}
              <div className="mpBottomRow">
                {/* DETAILS */}
                <div className="mpCard mpSection">
                  <div className="mpSectionHeader">Latest Prediction Details</div>

                  {!latest ? (
                    <div className="mpPad">
                      <p className="mpMuted">
                        No predictions found. Please go to <b>Check Risk</b>.
                      </p>
                    </div>
                  ) : (
                    <div className="mpPad">
                      <div className="mpDetailGrid">
                        <div className="mpDetailItem">
                          <span className="mpLabel">Age : </span>
                          <span className="mpValue">{safe(latest.age)}</span>
                        </div>

                        <div className="mpDetailItem">
                          <span className="mpLabel">Lump : </span>
                          <span className="mpValue">{safe(latest.lump)}</span>
                        </div>

                        <div className="mpDetailItem">
                          <span className="mpLabel">Pain : </span>
                          <span className="mpValue">{safe(latest.pain)}</span>
                        </div>

                        <div className="mpDetailItem">
                          <span className="mpLabel">Family History : </span>
                          <span className="mpValue">{safe(latest.family_history)}</span>
                        </div>

                        <div className="mpDetailItem">
                          <span className="mpLabel">Image Probability : </span>
                          <span className="mpValue">{formatNumber(latest.image_probability, 4)}</span>
                        </div>

                        <div className="mpDetailItem">
                          <span className="mpLabel">Total Score : </span>
                          <span className="mpValue">{formatNumber(latest.total_score, 2)}</span>
                        </div>
                      </div>

                      {/* ✅ Precautions */}
                      {Array.isArray(latest?.precautions) && latest.precautions.length > 0 && (
                        <div className="mpPrecautions">
                          <h4 className="mpPrecautionsTitle">Precautions</h4>
                          <ul className="mpPrecautionsList">
                            {latest.precautions.map((p, i) => (
                              <li key={i}>{p}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* ✅ Actions */}
                      <div className="mpActionRow">
                        <button className="mpBtnPrimary" type="button" onClick={downloadLatestPdf}>
                          Download PDF
                        </button>

                        <button
                          className="mpBtnSecondary"
                          type="button"
                          onClick={() => navigate("/reports")}
                        >
                          View All Reports
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* SETTINGS */}
                <div className="mpCard mpSection">
                  <div className="mpSectionHeader">Account Settings</div>

                  <div
                    className="mpSettingRow"
                    role="button"
                    tabIndex={0}
                    onClick={() =>
                      openComingSoon(
                        "Notification Preferences",
                        "Notification settings will be available soon."
                      )
                    }
                    onKeyDown={(e) => e.key === "Enter" && openComingSoon("Notification Preferences", "Notification settings will be available soon.")}
                  >
                    <span className="mpSettingIcon">🔔</span>
                    <span className="mpSettingText">Notification Preferences</span>
                    <span className="mpChev">›</span>
                  </div>

                  <div
                    className="mpSettingRow"
                    role="button"
                    tabIndex={0}
                    onClick={() => openComingSoon("Privacy Settings", "Privacy options will be available soon.")}
                    onKeyDown={(e) => e.key === "Enter" && openComingSoon("Privacy Settings", "Privacy options will be available soon.")}
                  >
                    <span className="mpSettingIcon">🔒</span>
                    <span className="mpSettingText">Privacy Settings</span>
                    <span className="mpChev">›</span>
                  </div>

                  <div
                    className="mpSettingRow"
                    role="button"
                    tabIndex={0}
                    onClick={() => openComingSoon("Connected Devices", "Device management will be available soon.")}
                    onKeyDown={(e) => e.key === "Enter" && openComingSoon("Connected Devices", "Device management will be available soon.")}
                  >
                    <span className="mpSettingIcon">📱</span>
                    <span className="mpSettingText">Connected Devices</span>
                    <span className="mpChev">›</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
      {showPopup && (
        <div className="mpModalOverlay" onClick={closePopup}>
          <div className="mpModal" onClick={(e) => e.stopPropagation()}>
            <div className="mpModalHeader">
              <h3>{popupTitle}</h3>
              <button className="mpModalClose" onClick={closePopup}>×</button>
            </div>

            <p className="mpModalText">{popupMsg}</p>

            <div className="mpModalActions">
              <button className="mpModalBtn" onClick={closePopup}>
                Okay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>


  );
}

export default MyProfile;