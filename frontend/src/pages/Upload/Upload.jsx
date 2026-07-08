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
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF resume.");
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a resume.");
      return;
    }

    try {
      setLoading(true);

      const response = await uploadResume(selectedFile);

      toast.success(response.message);

      navigate("/analysis", {
        state: response,
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
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
            Upload a PDF resume to receive AI-powered
            analysis, ATS scoring, skill extraction,
            and personalized recommendations.
          </p>

          <label className="upload-box">

            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              hidden
            />

            <FileText size={45} />

            <span>
              {selectedFile
                ? selectedFile.name
                : "Choose Resume PDF"}
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