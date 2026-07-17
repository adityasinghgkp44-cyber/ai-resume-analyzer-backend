import "./History.css";

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import {
  FileText,
  Star,
  BrainCircuit,
  Eye,
  Trash2,
  Search,
} from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import Loading from "../../components/Loading/Loading";
import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog";

import { getHistory } from "../../services/historyService";
import { deleteResume } from "../../services/resumeService";

function History() {
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedResume, setSelectedResume] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await getHistory();
      setHistory(response.history || []);
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
        "Failed to load history"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedResume) return;

    try {
      await deleteResume(selectedResume.resume_name);

      setHistory((prev) =>
        prev.filter(
          (item) =>
            item.resume_name !== selectedResume.resume_name
        )
      );

      toast.success("Resume deleted successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
        "Delete failed"
      );
    }

    setOpenDialog(false);
    setSelectedResume(null);
  };

  const filteredHistory = useMemo(() => {
    let data = [...history];

    data = data.filter((resume) =>
      resume.resume_name
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );

    if (filter === "high") {
      data = data.filter(
        (resume) => resume.ats_score >= 80
      );
    }

    if (filter === "medium") {
      data = data.filter(
        (resume) =>
          resume.ats_score >= 60 &&
          resume.ats_score < 80
      );
    }

    if (filter === "low") {
      data = data.filter(
        (resume) => resume.ats_score < 60
      );
    }

    return data;
  }, [history, search, filter]);

  if (loading) {
    return (
      <DashboardLayout>
        <Loading
          text="Loading Resume History..."
          fullScreen={false}
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="history-page">

        <h1>Resume History</h1>

        <div className="history-controls">

          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search Resume..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>

          <select
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value)
            }
          >
            <option value="all">All Scores</option>
            <option value="high">ATS ≥ 80</option>
            <option value="medium">ATS 60 - 79</option>
            <option value="low">ATS &lt; 60</option>
          </select>

        </div>

        {filteredHistory.length === 0 ? (
          <div className="empty-history">
            <FileText size={80} />
            <h2>No Resume Found</h2>
          </div>
        ) : (
          <div className="history-grid">

            {filteredHistory.map((resume, index) => (

              <div
                className="history-card"
                key={index}
              >

                <div className="history-header">
                  <FileText />
                  <h2>{resume.resume_name}</h2>
                </div>

                <div className="history-score">
                  <Star />
                  ATS Score
                  <span>{resume.ats_score}%</span>
                </div>

                <div className="history-skills">

                  {resume.matched_skills?.map(
                    (skill, i) => (
                      <span key={i}>
                        {skill}
                      </span>
                    )
                  )}

                </div>

                <div className="analysis-preview">

                  <BrainCircuit size={18} />

                  <p>
                    {resume.analysis?.suggestions?.[0] ||
                      "No suggestions available"}
                  </p>

                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    marginTop: "20px",
                  }}
                >

                  <button
                    className="view-btn"
                    onClick={() =>
                      navigate("/analysis", {
                        state: resume,
                      })
                    }
                  >
                    <Eye size={18} />
                    View Report
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => {
                      setSelectedResume(resume);
                      setOpenDialog(true);
                    }}
                  >
                    <Trash2 size={18} />
                    Delete
                  </button>

                </div>

              </div>

            ))}

          </div>
        )}

        <ConfirmDialog
          isOpen={openDialog}
          title="Delete Resume"
          message={`Delete "${selectedResume?.resume_name}" ?`}
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={handleDelete}
          onCancel={() => {
            setOpenDialog(false);
            setSelectedResume(null);
          }}
        />

      </div>
    </DashboardLayout>
  );
}

export default History;