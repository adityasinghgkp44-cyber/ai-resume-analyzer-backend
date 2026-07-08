import "./ResumeDetails.css";

import { useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";

import {
  FileText,
  BrainCircuit,
  Star,
  Target,
  ArrowLeft,
} from "lucide-react";

import ExportPDF from "../../components/ExportPDF/ExportPDF";
import ATSGauge from "../../components/ATSGauge/ATSGauge";

function ResumeDetails() {
  const navigate = useNavigate();
  const location = useLocation();

  const resume = location.state;

  if (!resume) {
    return (
      <DashboardLayout>
        <div className="resume-empty">

          <h2>No Resume Selected</h2>

          <button
            className="back-btn"
            onClick={() => navigate("/history")}
          >
            <ArrowLeft size={18} />
            Back to History
          </button>

        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>

      <div
        className="resume-details-page"
        id="analysis-report"
      >

        <div className="details-header">

          <div>

            <h1>{resume.resume_name}</h1>

            <p>
              Complete AI Resume Analysis
            </p>

          </div>

          <button
            className="back-btn"
            onClick={() => navigate("/history")}
          >
            <ArrowLeft size={18} />
            Back
          </button>

        </div>

        <div className="details-grid">

          <div className="glass-card ats-card">

            <h2>

              <Target />

              ATS Score

            </h2>

            <ATSGauge
              score={resume.ats_score}
            />

            <h3>{resume.ats_score}%</h3>

          </div>

          <div className="glass-card">

            <h2>

              <FileText />

              Resume Information

            </h2>

            <div className="resume-info">

              <p>

                <strong>File:</strong>

                {resume.resume_name}

              </p>

              <p>

                <strong>Detected Skills:</strong>

                {resume.skills.length}

              </p>

              <p>

                <strong>ATS Score:</strong>

                {resume.ats_score}%

              </p>

            </div>

          </div>

        </div>

        <div className="glass-card">

          <h2>

            <Star />

            Skills

          </h2>

          <div className="skills-container">

            {resume.skills.map((skill, index) => (

              <span
                className="skill-chip"
                key={index}
              >
                {skill}
              </span>

            ))}

          </div>

        </div>

        <div className="glass-card">

          <h2>

            <BrainCircuit />

            AI Analysis

          </h2>

          <p className="analysis-text">

            {resume.analysis}

          </p>

        </div>

        <div className="action-buttons">

          <ExportPDF
            targetId="analysis-report"
          />

          <button
            onClick={() =>
              navigate("/match-jd", {
                state: resume,
              })
            }
          >
            Match Job Description
          </button>

          <button
            onClick={() =>
              navigate("/roadmap", {
                state: resume,
              })
            }
          >
            Generate Roadmap
          </button>

        </div>

      </div>

    </DashboardLayout>
  );
}

export default ResumeDetails;