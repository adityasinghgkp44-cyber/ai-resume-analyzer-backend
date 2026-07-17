import "./Analysis.css";

import { useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";

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

  return (
    <DashboardLayout>

      <div className="analysis-page">

        <h1>Resume Analysis</h1>

        <h2>ATS Score</h2>
        <h3>{state.ats_score}%</h3>

        <hr />

        <h2>Matched Skills</h2>

        <ul>
          {state.matched_skills?.map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>

        <h2>Missing Skills</h2>

        <ul>
          {state.missing_skills?.map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>

        <h2>Strengths</h2>

        <ul>
          {state.analysis?.strengths?.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

        <h2>Weaknesses</h2>

        <ul>
          {state.analysis?.weaknesses?.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

        <h2>Suggestions</h2>

        <ul>
          {state.analysis?.suggestions?.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

        <h2>Interview Questions</h2>

        <ul>
          {state.analysis?.interview_questions?.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

        <h2>Roadmap</h2>

        <ul>
          {state.roadmap?.map((item, index) => (
            <li key={index}>
              {typeof item === "string"
                ? item
                : JSON.stringify(item)}
            </li>
          ))}
        </ul>

      </div>

    </DashboardLayout>
  );
}

export default Analysis;