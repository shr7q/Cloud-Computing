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

const OPTIMIZATION_API_URL =
  "https://your-api-url.execute-api.amazonaws.com/prod/optimizer"; 
// ⬆️ Replace this with YOUR actual API Gateway URL

const OptimizationPanel = () => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [results, setResults] = useState<OptimizationResult | null>(null);

  const runOptimization = async () => {
    setIsOptimizing(true);
    setResults(null); // clear any previous results

    try {
      const response = await fetch(OPTIMIZATION_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ trigger: "run_optimizer" }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Optimization API returned an error");
      }

      const data: OptimizationResult = await response.json();
      setResults(data);

      toast.success("Optimization complete", {
        description: `Routes optimized in ${data.computationTime}s`,
      });

    } catch (error: any) {
      toast.error("Optimization failed", {
        description: error.message || "Please try again or check your optimizer.",
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <Card className="gradient-card border-border p-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-2">
        <Zap className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">
          Route Optimization
        </h2>
      </div>

      <div className="space-y-6">
        {/* Optimize Button */}
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

        {/* Results Display */}
        {results && (
          <div className="space-y-4">
            {/* Summary Card */}
            <div className="rounded-lg border border-success/30 bg-success/10 p-4">
              <div className="flex items-center gap-2 text-success">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-semibold">Optimization Complete</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Computed in {results.computationTime}s • Total Distance:{" "}
                {results.totalOptimizedDistance} km
              </p>
            </div>

            {/* Carrier Assignments */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">
                Carrier Assignments
              </h3>
              {results.carriers.map((carrier) => (
                <div
                  key={carrier.id}
                  className="rounded-lg border border-border bg-secondary/50 p-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-foreground">
                        {carrier.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ID: {carrier.id}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">
                        {carrier.totalDistance} km
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {carrier.totalTime} min
                      </p>
                    </div>
                  </div>

                  {/* Orders */}
                  <div className="mt-3">
                    <p className="text-sm text-muted-foreground">
                      Assigned Orders:
                    </p>
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

            {/* Raw JSON Viewer */}
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
