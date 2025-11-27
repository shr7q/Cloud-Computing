import Header from "@/components/Header";
import StatsCard from "@/components/StatsCard";
import WorkOrderForm from "@/components/WorkOrderForm";
import OrdersTable from "@/components/OrdersTable";
import OptimizationPanel from "@/components/OptimizationPanel";
import { Truck, Clock, TrendingUp, MapPin } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Active Orders"
            value="24"
            icon={Truck}
            trend="+12% from last week"
            trendUp={true}
          />
          <StatsCard
            title="Avg. Response Time"
            value="18 min"
            icon={Clock}
            trend="-5% improvement"
            trendUp={true}
          />
          <StatsCard
            title="Fleet Utilization"
            value="87%"
            icon={TrendingUp}
            trend="+3% this month"
            trendUp={true}
          />
          <StatsCard
            title="Total Distance Today"
            value="342 km"
            icon={MapPin}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Form */}
          <div className="lg:col-span-1">
            <WorkOrderForm />
          </div>

          {/* Right Column - Orders & Optimization */}
          <div className="space-y-6 lg:col-span-2">
            <OrdersTable />
            <OptimizationPanel />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
