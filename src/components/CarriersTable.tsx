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

const getStatusBadge = (hours: number) => {
  if (hours >= 9)
    return <span className="text-red-500 font-medium">Exceeded</span>;

  if (hours >= 7)
    return <span className="text-yellow-500 font-medium">Getting Close</span>;

  return <span className="text-green-500 font-medium">OK</span>;
};

const CarriersTable = ({ carriers }) => {
  return (
    <Card className="gradient-card border-border p-6">
      <div className="mb-6 flex items-center gap-2">
        <Truck className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">Carriers Overview</h2>
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
                <TableHead>Longitude</TableHead>
                <TableHead>Latitude</TableHead>
                <TableHead>Hours Worked</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {carriers.map((carrier) => {
                return (
                  <TableRow
                    key={carrier.id}
                    className="border-border hover:bg-secondary/50"
                  >
                    <TableCell>{carrier.id}</TableCell>
                    <TableCell>{carrier.lng.toFixed(4)}</TableCell>
                    <TableCell>{carrier.lat.toFixed(4)}</TableCell>
                    <TableCell>{carrier.hours_worked.toFixed(2)} hr</TableCell>
                    <TableCell>{getStatusBadge(carrier.hours_worked)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </Card>
  );
};

export default CarriersTable;
