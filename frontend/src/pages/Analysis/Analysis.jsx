import "./Analysis.css";

import { useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";

import {
  CheckCircle,
  BrainCircuit,
  Target,
  Briefcase,
} from "lucide-react";

function Analysis() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return (
      <DashboardLayout>
        <div className="analysis-empty">
          <h2>No analysis available.</h2>

          <button
            className="analysis-btn"
            onClick={() => navigate("/upload")}
          >
            Upload Resume
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const {
    analysis,
    skills,
    ats_score,
  } = state;

  return (
    <DashboardLayout>
      <div className="analysis-page">

        <div className="score-card">

          <Target size={35} />

          <h2>ATS Score</h2>

          <div className="score-circle">
            {ats_score}%
          </div>

        </div>

        <div className="analysis-grid">

          <div className="glass-card">

            <h2>
              <BrainCircuit size={22} />
              AI Analysis
            </h2>

            <p className="analysis-text">
              {analysis}
            </p>

          </div>

          <div className="glass-card">

            <h2>
              <CheckCircle size={22} />
              Skills Detected
            </h2>

            <div className="skills-grid">

              {skills &&
                skills.map((skill, index) => (
                  <span
                    key={index}
                    className="skill-chip"
                  >
                    {skill}
                  </span>
                ))}

            </div>

          </div>

        </div>

        <div className="action-card">

          <h2>Next Step</h2>

          <p>
            Compare your resume against a Job
            Description and discover missing skills.
          </p>

          <button
            className="analysis-btn"
            onClick={() => navigate("/match-jd")}
          >
            <Briefcase size={18} />
            Match Job Description
          </button>

        </div>

      </div>
    </DashboardLayout>
  );
}

export default Analysis;