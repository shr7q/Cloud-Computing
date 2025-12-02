import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Truck } from "lucide-react";

const CarriersTable = ({ carriers }) => {
  return (
    <Card className="gradient-card border-border p-6">
      <div className="mb-6 flex items-center gap-2">
        <Truck className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">Available Carriers</h2>
      </div>

      {carriers.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">No carriers available</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead>Carrier ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Current Load</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {carriers.map((carrier) => (
                <TableRow key={carrier.id} className="border-border hover:bg-secondary/50">
                  <TableCell>{carrier.id}</TableCell>
                  <TableCell>{carrier.name}</TableCell>
                  <TableCell>{carrier.status}</TableCell>
                  <TableCell>{carrier.currentLoad}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </Card>
  );
};

export default CarriersTable;
