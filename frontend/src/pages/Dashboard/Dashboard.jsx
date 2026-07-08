import "./Dashboard.css";

import { useEffect, useState } from "react";

import DashboardLayout from "../../layouts/DashboardLayout";
import StatCard from "../../components/StatCard/StatCard";
import Loading from "../../components/Loading/Loading";

import {
  FileText,
  BrainCircuit,
  Target,
  TrendingUp,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  Tooltip,
} from "recharts";

import { getDashboardData } from "../../services/dashboardService";

function Dashboard() {
  const [dashboard, setDashboard] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const data =
        await getDashboardData();

      setDashboard(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Loading
          text="Loading Dashboard..."
          fullScreen={false}
        />
      </DashboardLayout>
    );
  }

  const chartData =
    dashboard.history.map(
      (resume, index) => ({
        name: `Resume ${index + 1}`,
        ats: resume.ats_score,
      })
    );

  return (
    <DashboardLayout>
      <div className="dashboard-page">

        <div className="stats-grid">

          <StatCard
            title="Average ATS"
            value={
              dashboard.averageATS
            }
            color="#ff6a00"
            icon={<Target />}
          />

          <StatCard
            title="Highest ATS"
            value={
              dashboard.highestATS
            }
            color="#ff2d55"
            icon={<TrendingUp />}
          />

          <StatCard
            title="Uploaded Resumes"
            value={
              dashboard.totalResumes
            }
            color="#00d084"
            icon={<FileText />}
          />

          <StatCard
            title="Detected Skills"
            value={
              dashboard.totalSkills
            }
            color="#ff9800"
            icon={<BrainCircuit />}
          />

        </div>

        <div className="dashboard-grid">

          <div className="glass-card">

            <h2>
              ATS Performance
            </h2>

            <ResponsiveContainer
              width="100%"
              height={300}
            >
              <LineChart
                data={chartData}
              >
                <CartesianGrid
                  stroke="#222"
                />

                <XAxis
                  dataKey="name"
                />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="ats"
                  stroke="#ff6a00"
                  strokeWidth={4}
                />
              </LineChart>
            </ResponsiveContainer>

          </div>

          <div className="glass-card">

            <h2>
              Recent Uploads
            </h2>

            <div className="activity">

              {dashboard.history
                .slice(-5)
                .reverse()
                .map(
                  (
                    resume,
                    index
                  ) => (
                    <div
                      key={index}
                      className="activity-item"
                    >
                      {
                        resume.resume_name
                      }

                      <span>
                        {
                          resume.ats_score
                        }
                        %
                      </span>
                    </div>
                  )
                )}

              {dashboard.history
                .length === 0 && (
                <div
                  className="activity-item"
                >
                  No resumes uploaded
                </div>
              )}

            </div>

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}

export default Dashboard;