import "./Roadmap.css";

import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { toast } from "react-hot-toast";
import { Map, BookOpen, Rocket } from "lucide-react";
import { generateRoadmap } from "../../services/roadmapService";

function Roadmap() {
  const [skills, setSkills] = useState("");
  const [roadmap, setRoadmap] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    const missingSkills = skills
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill !== "");

    if (missingSkills.length === 0) {
      toast.error("Enter at least one missing skill.");
      return;
    }

    try {
      setLoading(true);

      const response = await generateRoadmap(missingSkills);

      setRoadmap(response.roadmap);

      toast.success("Roadmap generated successfully!");
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
          "Unable to generate roadmap."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="roadmap-page">
        <h1>
          <Map size={32} />
          AI Learning Roadmap
        </h1>

        <p>
          Enter missing skills separated by commas.
        </p>

        <textarea
          placeholder="Example: Docker, AWS, Kubernetes"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
        />

        <button
          className="roadmap-btn"
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Roadmap"}
        </button>

        {roadmap.map((item, index) => (
          <div className="roadmap-card" key={index}>

            <h2>{item.skill}</h2>

            <div className="roadmap-stage">

              <BookOpen size={20} />

              <div>
                <h3>Beginner</h3>
                <p>{item.beginner}</p>
              </div>

            </div>

            <div className="roadmap-stage">

              <BookOpen size={20} />

              <div>
                <h3>Intermediate</h3>
                <p>{item.intermediate}</p>
              </div>

            </div>

            <div className="roadmap-stage">

              <Rocket size={20} />

              <div>
                <h3>Advanced</h3>
                <p>{item.advanced}</p>
              </div>

            </div>

          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}

export default Roadmap;