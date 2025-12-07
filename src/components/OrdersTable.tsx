import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";

const OrdersTable = ({ orders }) => {
  const getStatusBadge = (status) => {
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

      {orders.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">No active work orders</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead>Order ID</TableHead>
                <TableHead>Client Name</TableHead>
                <TableHead>Requested Time</TableHead>
                <TableHead>ETA (min)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned Carrier</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} className="border-border hover:bg-secondary/50">
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.clientName}</TableCell>
                  <TableCell>{new Date(order.requestedTime).toLocaleString()}</TableCell>
                  <TableCell>{order.eta}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>{order.assignedCarrier || "—"}</TableCell>
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
