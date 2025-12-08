import Header from "@/components/Header";
import StatsCard from "@/components/StatsCard";
import WorkOrderForm from "@/components/WorkOrderForm";
import OrdersTable from "@/components/OrdersTable";
import OptimizationPanel from "@/components/OptimizationPanel";
import CarriersTable from "@/components/CarriersTable";

import { Truck, Clock, TrendingUp, MapPin } from "lucide-react";
import { useState } from "react";

const Index = () => {

  // ✅ Hardcoded carriers here
  const [carriers, setCarriers] = useState([
    { id: "C1", lat: 39.0082, lng: -76.9597, hours_worked: 5.2 },
    { id: "C2", lat: 39.0150, lng: -76.9401, hours_worked: 6.8 },
    { id: "C3", lat: 39.0205, lng: -76.9305, hours_worked: 4.1 },
    { id: "C4", lat: 39.0165, lng: -76.9273, hours_worked: 8.92 },
    { id: "C5", lat: 38.9845, lng: -76.9676, hours_worked: 9.1 },
  ]);

  const [orders, setOrders] = useState([]);

  const addOrder = (order) => {
    setOrders((prev) => [...prev, order]);
  };

  const updateOrder = (orderId, updates) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, ...updates } : order
      )
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">

        {/* Stats Grid */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard title="Active Orders" value={orders.length.toString()} icon={Truck} />
          <StatsCard title="Avg. Response Time" value="18 min" icon={Clock} />
          <StatsCard title="Fleet Utilization" value="87%" icon={TrendingUp} />
          <StatsCard title="Total Distance Today" value="342 km" icon={MapPin} />
        </div>

        <div className="space-y-6">
          <CarriersTable carriers={carriers} />

          <div className="grid gap-6 lg:grid-cols-3 mt-6">
            <div className="lg:col-span-1">
              <WorkOrderForm addOrder={addOrder} />
            </div>

            <div className="space-y-6 lg:col-span-2">
              <OrdersTable orders={orders} />
              <OptimizationPanel orders={orders} updateOrder={updateOrder} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
