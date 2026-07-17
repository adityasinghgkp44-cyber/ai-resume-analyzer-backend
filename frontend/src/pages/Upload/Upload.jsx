import "./Upload.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UploadCloud, FileText } from "lucide-react";
import { toast } from "react-hot-toast";

import DashboardLayout from "../../layouts/DashboardLayout";
import { uploadResume } from "../../services/resumeService";

function Upload() {
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState(null);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a PDF or DOCX resume.");
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a resume.");
      return;
    }

    if (!role) {
      toast.error("Please select a job role.");
      return;
    }

    try {
      setLoading(true);

      const response = await uploadResume(selectedFile, role);

      toast.success("Resume analyzed successfully.");

      navigate("/analysis", {
        state: response,
      });
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
          "Resume upload failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="upload-page">

        <div className="upload-card">

          <UploadCloud size={80} className="upload-icon" />

          <h1>Upload Your Resume</h1>

          <p>
            Upload your resume and select your target job role to
            receive ATS score, skill analysis, roadmap and interview
            preparation.
          </p>

          <div style={{ width: "100%", marginBottom: "20px" }}>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                fontSize: "16px",
              }}
            >
              <option value="">Select Job Role</option>
              <option value="Backend Developer">Backend Developer</option>
              <option value="Frontend Developer">Frontend Developer</option>
              <option value="Full Stack Developer">Full Stack Developer</option>
              <option value="Data Analyst">Data Analyst</option>
              <option value="AI Engineer">AI Engineer</option>
              <option value="Cyber Security">Cyber Security</option>
            </select>
          </div>

          <label className="upload-box">
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileChange}
              hidden
            />

            <FileText size={45} />

            <span>
              {selectedFile
                ? selectedFile.name
                : "Choose Resume (PDF/DOCX)"}
            </span>
          </label>

          <button
            className="upload-btn"
            onClick={handleUpload}
            disabled={loading}
          >
            {loading
              ? "Analyzing Resume..."
              : "Upload & Analyze"}
          </button>

        </div>
      </div>
    </DashboardLayout>
  );
}

export default Upload;