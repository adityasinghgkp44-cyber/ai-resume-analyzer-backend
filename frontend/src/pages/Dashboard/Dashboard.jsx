import DashboardLayout from "../../layouts/DashboardLayout";
import StatCard from "../../components/StatCard/StatCard";
import { Target } from "lucide-react";

function Dashboard() {
  return (
    <DashboardLayout>
      <StatCard
        title="Average ATS"
        value={0}
        color="#ff6a00"
        icon={<Target />}
      />
    </DashboardLayout>
  );
}

export default Dashboard;