import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Package } from "lucide-react";

interface WorkOrder {
  id: string;
  clientName: string;
  requestedTime: string;
  distance: number;
  eta: number;
  status: "pending" | "assigned" | "completed";
}

const OrdersTable = () => {
  const [orders, setOrders] = useState<WorkOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // Mock data
        setOrders([
          {
            id: "WO-001",
            clientName: "Acme Corp",
            requestedTime: new Date().toISOString(),
            distance: 12.5,
            eta: 25,
            status: "pending",
          },
          {
            id: "WO-002",
            clientName: "TechStart Inc",
            requestedTime: new Date(Date.now() - 3600000).toISOString(),
            distance: 8.3,
            eta: 18,
            status: "assigned",
          },
          {
            id: "WO-003",
            clientName: "Global Logistics",
            requestedTime: new Date(Date.now() - 7200000).toISOString(),
            distance: 15.7,
            eta: 32,
            status: "pending",
          },
        ]);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusBadge = (status: WorkOrder["status"]) => {
    const variants = {
      pending: "bg-accent/20 text-accent border-accent/30",
      assigned: "bg-primary/20 text-primary border-primary/30",
      completed: "bg-success/20 text-success border-success/30",
    };

    return (
      <Badge variant="outline" className={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <Card className="gradient-card border-border p-6">
      <div className="mb-6 flex items-center gap-2">
        <Package className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">Current Orders</h2>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : orders.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">No active work orders</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Order ID</TableHead>
                <TableHead className="text-muted-foreground">Client Name</TableHead>
                <TableHead className="text-muted-foreground">Requested Time</TableHead>
                <TableHead className="text-muted-foreground">Distance (km)</TableHead>
                <TableHead className="text-muted-foreground">ETA (min)</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} className="border-border hover:bg-secondary/50">
                  <TableCell className="font-medium text-foreground">{order.id}</TableCell>
                  <TableCell className="text-foreground">{order.clientName}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(order.requestedTime).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-foreground">{order.distance.toFixed(1)}</TableCell>
                  <TableCell className="text-foreground">{order.eta}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </Card>
  );
};

export default OrdersTable;
