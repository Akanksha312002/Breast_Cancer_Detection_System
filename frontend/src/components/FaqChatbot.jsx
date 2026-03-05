import React, { useEffect, useMemo, useRef, useState } from "react";
import "../styles/FaqChatbot.css";

const DEFAULT_BOT_MSG =
    "Hi! 👋 I’m your help bot. Ask me about breast cancer, risk levels, mammogram, self-exam, symptoms, reports, or login.";

function normalize(text) {
    return (text || "")
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function FaqChatbot() {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState(() => [
        { from: "bot", text: DEFAULT_BOT_MSG },
    ]);

    const endRef = useRef(null);

    // ✅ FAQ data (you can edit/add more Q&A)
    const faqs = useMemo(
        () => [
            {
                keywords: ["breast cancer", "what is breast cancer", "cancer"],
                answer:
                    "Breast cancer is a disease where breast cells grow uncontrollably. Early detection improves treatment success a lot.",
            },
            {
                keywords: ["symptoms", "signs", "warning", "lump", "pain", "nipple", "discharge", "swelling"],
                answer:
                    "Common signs include a new lump, breast or armpit swelling, skin dimpling, nipple changes, unusual discharge, or persistent pain. If you notice changes, consult a doctor.",
            },
            {
                keywords: ["self exam", "self-exam", "how to check", "check at home"],
                answer:
                    "Self-exam: Look in the mirror (shape/skin changes), then feel the breast and armpit with 3 fingers in circular motions. If you find a new lump or change, consult a doctor.",
            },
            {
                keywords: ["mammogram", "screening", "test", "scan"],
                answer:
                    "A mammogram is an X-ray screening test that helps detect breast changes early. Your doctor suggests when you need it based on age and risk.",
            },
            {
                keywords: ["risk category", "low risk", "moderate risk", "high risk"],
                answer:
                    "Risk category is based on symptom score + image probability score. Low means fewer warning signs, Moderate needs more monitoring/doctor advice, High means you should consult a doctor urgently.",
            },
            {
                keywords: ["precautions", "what to do", "care", "tips"],
                answer:
                    "General precautions: healthy diet, exercise, limit alcohol, don’t smoke, regular checkups, and follow doctor screening advice. If risk is Moderate/High, consult a healthcare professional.",
            },
            {
                keywords: ["report", "pdf", "download", "email report", "view reports"],
                answer:
                    "You can view all reports in 'View Reports'. From there you can download PDF and also send the report to your email (if you enabled that feature).",
            },
            {
                keywords: ["otp", "signup otp", "email otp", "verification"],
                answer:
                    "OTP helps verify your email so fake accounts don’t register. We send a code to your email, and you verify it to complete signup.",
            },
            {
                keywords: ["login", "token", "session expired", "logout"],
                answer:
                    "If you see 'session expired', your token may be missing/cleared. Login again to generate a fresh token. Logout removes token from localStorage.",
            },
            {
                keywords: ["disclaimer", "not a doctor", "accuracy"],
                answer:
                    "Important: This system is for awareness and early guidance. It is NOT a medical diagnosis. Always confirm with a qualified doctor.",
            },
        ],
        []
    );

    const quickChips = useMemo(
        () => [
            "What is breast cancer?",
            "Symptoms",
            "Self-exam steps",
            "What is mammogram?",
            "Explain risk category",
            "Precautions",
            "How to download report?",
            "Disclaimer",
        ],
        []
    );

    const getBotAnswer = (userText) => {
        const q = normalize(userText);

        // fallback if user says hi etc.
        if (["hi", "hello", "hey"].includes(q)) {
            return "Hello 👋 Ask me about symptoms, self-exam, mammogram, risk category, precautions, or reports.";
        }

        for (const item of faqs) {
            for (const kw of item.keywords) {
                const k = normalize(kw);
                if (q.includes(k)) return item.answer;
            }
        }

        // keyword scoring fallback (more flexible)
        const tokens = q.split(" ").filter(Boolean);
        let best = null;
        let bestScore = 0;

        for (const item of faqs) {
            const joined = normalize(item.keywords.join(" "));
            let score = 0;
            for (const t of tokens) {
                if (joined.includes(t)) score++;
            }
            if (score > bestScore) {
                bestScore = score;
                best = item;
            }
        }

        if (best && bestScore >= 2) return best.answer;

        return "I couldn’t match that exactly. Try asking about: symptoms, self-exam, mammogram, risk category, precautions, reports, OTP, or disclaimer.";
    };

    const send = (text) => {
        const trimmed = (text || "").trim();
        if (!trimmed) return;

        setMessages((prev) => [...prev, { from: "user", text: trimmed }]);
        setInput("");

        const reply = getBotAnswer(trimmed);
        setTimeout(() => {
            setMessages((prev) => [...prev, { from: "bot", text: reply }]);
        }, 250);
    };

    useEffect(() => {
        if (!open) return;
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, open]);

    // ESC closes
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "Escape") setOpen(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    return (
        <>
            {/* Floating Button */}
            <button
                className="faqFab"
                type="button"
                onClick={() => setOpen((s) => !s)}
                aria-label={open ? "Close chat" : "Help"}
            >
                <span className="faqTooltip">{open ? "Close" : "Any Questions??"}</span>

                {open ? (
                    <i className="fas fa-times"></i>
                ) : (
                    <i className="fas fa-robot"></i>
                )}
            </button>

            {/* Panel */}
            {open && (
                <div className="faqPanel" role="dialog" aria-modal="true">
                    <div className="faqHeader">
                        <div className="faqTitle">
                            <div className="faqDot" />
                            Help Chat
                        </div>
                        <button className="faqClose" type="button" onClick={() => setOpen(false)}>
                            ✕
                        </button>
                    </div>

                    <div className="faqDisclaimer">
                        This bot gives awareness guidance only — not a medical diagnosis.
                    </div>

                    <div className="faqBody">
                        {messages.map((m, idx) => (
                            <div
                                key={idx}
                                className={`faqMsg ${m.from === "user" ? "user" : "bot"}`}
                            >
                                <div className="faqBubble">{m.text}</div>
                            </div>
                        ))}
                        <div ref={endRef} />
                    </div>

                    {/* Quick chips */}
                    <div className="faqChips">
                        {quickChips.map((c) => (
                            <button
                                key={c}
                                type="button"
                                className="faqChip"
                                onClick={() => send(c)}
                            >
                                {c}
                            </button>
                        ))}
                    </div>

                    <form
                        className="faqInputRow"
                        onSubmit={(e) => {
                            e.preventDefault();
                            send(input);
                        }}
                    >
                        <input
                            className="faqInput"
                            placeholder="Type your question..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <button className="faqSend" type="submit">
                            Send
                        </button>
                    </form>
                </div>
            )}
        </>
    );
}

export default FaqChatbot;