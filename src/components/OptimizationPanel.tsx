import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Zap, CheckCircle2 } from "lucide-react";

interface OptimizationResult {
  carriers: {
    id: string;
    name: string;
    orders: string[];
    totalDistance: number;
    totalTime: number;
  }[];
  totalOptimizedDistance: number;
  computationTime: number;
}

const OptimizationPanel = () => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [results, setResults] = useState<OptimizationResult | null>(null);

  const runOptimization = async () => {
    setIsOptimizing(true);
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Mock optimization results
      const mockResults: OptimizationResult = {
        carriers: [
          {
            id: "C-001",
            name: "Carrier Alpha",
            orders: ["WO-001", "WO-003"],
            totalDistance: 28.2,
            totalTime: 57,
          },
          {
            id: "C-002",
            name: "Carrier Beta",
            orders: ["WO-002"],
            totalDistance: 8.3,
            totalTime: 18,
          },
        ],
        totalOptimizedDistance: 36.5,
        computationTime: 1.8,
      };

      setResults(mockResults);
      toast.success("Optimization complete", {
        description: `Routes optimized in ${mockResults.computationTime}s`,
      });
    } catch (error) {
      toast.error("Optimization failed", {
        description: "Please try again or check your data.",
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <Card className="gradient-card border-border p-6">
      <div className="mb-6 flex items-center gap-2">
        <Zap className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">Route Optimization</h2>
      </div>

      <div className="space-y-6">
        <Button
          onClick={runOptimization}
          disabled={isOptimizing}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isOptimizing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Optimizing Routes...
            </>
          ) : (
            <>
              <Zap className="mr-2 h-4 w-4" />
              Run Optimization
            </>
          )}
        </Button>

        {results && (
          <div className="space-y-4">
            <div className="rounded-lg border border-success/30 bg-success/10 p-4">
              <div className="flex items-center gap-2 text-success">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-semibold">Optimization Complete</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Computed in {results.computationTime}s • Total Distance: {results.totalOptimizedDistance} km
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Carrier Assignments</h3>
              {results.carriers.map((carrier) => (
                <div
                  key={carrier.id}
                  className="rounded-lg border border-border bg-secondary/50 p-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-foreground">{carrier.name}</p>
                      <p className="text-sm text-muted-foreground">ID: {carrier.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">
                        {carrier.totalDistance} km
                      </p>
                      <p className="text-xs text-muted-foreground">{carrier.totalTime} min</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-sm text-muted-foreground">Assigned Orders:</p>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {carrier.orders.map((orderId) => (
                        <span
                          key={orderId}
                          className="rounded-md bg-primary/20 px-2 py-1 text-xs font-medium text-primary"
                        >
                          {orderId}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <details className="rounded-lg border border-border bg-secondary/30 p-4">
              <summary className="cursor-pointer font-semibold text-foreground">
                View Raw JSON
              </summary>
              <pre className="mt-3 overflow-x-auto rounded-md bg-background p-3 text-xs text-foreground">
                {JSON.stringify(results, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>
    </Card>
  );
};

export default OptimizationPanel;
