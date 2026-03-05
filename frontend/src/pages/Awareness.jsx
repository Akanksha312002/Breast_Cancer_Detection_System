import React, { useMemo, useState } from "react";
import "../styles/Awareness.css";

// Reuse your existing assets (no new images needed)
import bg from "../assets/background.png";
import doctor from "../assets/awareness1.png";     // hero doctor image
import cardImg1 from "../assets/awareness2.png";  // reuse
import cardImg2 from "../assets/awareness3.png";   // reuse
import cardImg3 from "../assets/awareness4.png";     // reuse
import cardImg4 from "../assets/awareness5.png";  // reuse
import cardImg5 from "../assets/awareness6.png";   // reuse
import cardImg6 from "../assets/awareness8.png";  // reuse

const SECTIONS = [
  {
    key: "what",
    title: "What is Breast Cancer?",
    img: cardImg1,
    short:
      "Breast cancer is the uncontrolled growth of abnormal cells in the breast tissue.",
    details: [
      "It can start in ducts (ductal) or lobules (lobular).",
      "Not every breast lump is cancer, but any new change should be checked.",
      "Early detection improves outcomes significantly.",
    ],
  },
  {
    key: "types",
    title: "Types of Breast Cancers",
    img: cardImg2,
    short:
      "Breast cancer includes non-invasive (in-situ) and invasive types.",
    details: [
      "DCIS (Ductal Carcinoma In Situ): non-invasive, inside ducts.",
      "Invasive Ductal Carcinoma (IDC): most common invasive type.",
      "Invasive Lobular Carcinoma (ILC): starts in lobules and spreads.",
      "Other rare types exist; final type is confirmed by medical tests.",
    ],
  },
  {
    key: "signs",
    title: "Warning Signs",
    img: cardImg3,
    short:
      "Recognizing warning signs early can help you seek medical advice sooner.",
    details: [
      "A new lump in breast or underarm.",
      "Change in breast size/shape, skin dimpling, or redness.",
      "Nipple discharge (especially bloody) or nipple inversion.",
      "Persistent pain in one area (pain alone doesn’t always mean cancer).",
    ],
  },
  {
    key: "selfexam",
    title: "How to Perform a Breast Self Exam",
    img: cardImg4,
    short:
      "Self-exams help you notice changes early. They are not a diagnosis.",
    details: [
      "Look: In mirror, check size/shape/skin changes with arms down and raised.",
      "Feel: Use 2–3 fingers in circular motion, cover whole breast and armpit.",
      "Check monthly (often recommended a few days after periods end).",
      "If you notice a new change, consult a doctor.",
    ],
  },
  {
    key: "mammogram",
    title: "What is a Mammogram?",
    img: cardImg5,
    short:
      "A mammogram is an X-ray imaging test used to detect breast changes.",
    details: [
      "It can detect changes before you can feel a lump.",
      "Screening schedules vary by age and risk—doctor advice matters.",
      "You might be asked for additional imaging (ultrasound/diagnostic mammogram).",
    ],
  },
  {
    key: "diagnosis",
    title: "Diagnose & Treatment",
    img: cardImg6,
    short:
      "Diagnosis usually involves imaging and may include biopsy. Treatment depends on stage/type.",
    details: [
      "Diagnosis: clinical exam + mammogram/ultrasound + biopsy if required.",
      "Treatment: surgery, radiation, chemotherapy, hormone therapy, targeted therapy (based on case).",
      "Supportive care and follow-ups are important for recovery and monitoring.",
    ],
  },
];

export default function Awareness() {
  const [openKey, setOpenKey] = useState(null);

  const active = useMemo(
    () => SECTIONS.find((s) => s.key === openKey),
    [openKey]
  );

  const closeModal = () => setOpenKey(null);

  return (
    <div className="awPage" style={{ "--aw-bg": `url(${bg})` }}>
      {/* HERO */}
      <section className="awHero">
        <div className="awHeroInner">
          <div className="awHeroLeft">
            <div className="awBreadcrumb">
              <span className="awCrumbIcon">⟳</span>
              <span>Dashboard</span>
              <span className="awCrumbSep">›</span>
              <span>Breast Cancer Information</span>
            </div>

            <h1>Breast Cancer Information</h1>
            <p className="awSub">
              Early detection saves lives. Stay informed, stay proactive.
            </p>

            <div className="awChips">
              <a href="#topics" className="awChip">Explore Topics</a>
              <a href="#cta" className="awChip awChipOutline">Read More</a>
            </div>
          </div>

          <div className="awHeroRight">
            <img src={doctor} alt="Doctor" />
          </div>
        </div>
      </section>

      {/* TOPICS */}
      <section id="topics" className="awSection">
        <div className="awGrid">
          {SECTIONS.map((item) => (
            <div key={item.key} className="awCard">
              <div className="awCardImgWrap">
                <img src={item.img} alt={item.title} className="awCardImg" />
              </div>

              <h3 className="awCardTitle">{item.title}</h3>
              <p className="awCardText">{item.short}</p>

              <button
                type="button"
                className="awBtn"
                onClick={() => setOpenKey(item.key)}
              >
                Learn More
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="awCTA">
        <div className="awCTALeft">
          <h2>Stay Informed, Stay Healthy</h2>
          <p>
            Knowledge is power. Learning about breast cancer helps you take
            timely action and support early detection.
          </p>
          <button
            type="button"
            className="awBtn awBtnWide"
            onClick={() => setOpenKey("what")}
          >
            Read More
          </button>
        </div>
      </section>

      {/* MODAL */}
      {active && (
        <div className="awModalOverlay" onClick={closeModal}>
          <div className="awModal" onClick={(e) => e.stopPropagation()}>
            <div className="awModalHeader">
              <h3>{active.title}</h3>
              <button className="awModalClose" onClick={closeModal} aria-label="Close">
                ✕
              </button>
            </div>

            <div className="awModalBody">
              <p className="awModalIntro">{active.short}</p>
              <ul className="awList">
                {active.details.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>

              <div className="awNote">
                ⚠ This information is for awareness only. For medical concerns,
                consult a healthcare professional.
              </div>
            </div>

            <div className="awModalFooter">
              <button className="awBtn" onClick={closeModal}>
                Okay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}