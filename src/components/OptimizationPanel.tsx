import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Zap, CheckCircle2 } from "lucide-react";

interface Assignment {
  job_id: number;
  carrier_id: string | null;
  p90_time_min: number | null;
  reason?: string;
}

interface OptimizationResult {
  assignments: Assignment[];
  optimized_s3_key: string;
  deleted_input_file: boolean;
  deleted_key: string;
}

const OPTIMIZATION_API_URL =
  "https://25px4j4jh1.execute-api.us-east-1.amazonaws.com/run-optimizer";

const OptimizationPanel = ({ orders, updateOrder }) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [results, setResults] = useState<OptimizationResult | null>(null);

  const runOptimization = async () => {
    setIsOptimizing(true);
    setResults(null);

    try {
      const response = await fetch(OPTIMIZATION_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trigger: "run_optimizer" }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Optimization API returned an error");
      }

      const data: OptimizationResult = await response.json();
      setResults(data);

      // ⭐ Update Orders with optimization assignment data
      data.assignments.forEach((assignment, index) => {
        const order = orders[index];
        if (!order) return;

        updateOrder(order.id, {
          eta: assignment.p90_time_min
            ? assignment.p90_time_min.toFixed(2)
            : "0",
          status: "Assigned",
          carrier: assignment.carrier_id || "—",
        });
      });

      toast.success("Optimization complete", {
        description: `Assignments updated successfully`,
      });
    } catch (error: any) {
      toast.error("Optimization failed", {
        description: error.message || "Please check your optimizer.",
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
              Optimizing...
            </>
          ) : (
            <>
              <Zap className="mr-2 h-4 w-4" />
              Run Optimization
            </>
          )}
        </Button>

        {/* Results */}
        {results && (
          <div className="space-y-4">
            {/* Success Banner */}
            <div className="rounded-lg border border-success/30 bg-success/10 p-4">
              <div className="flex items-center gap-2 text-success">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-semibold">Optimization Complete</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Output saved to S3: {results.optimized_s3_key}
              </p>
            </div>

            {/* Assignments List */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Assignments</h3>

              {results.assignments.map((a, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-border bg-secondary/50 p-4"
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold text-foreground">
                        Job ID: {a.job_id}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Carrier ID: {a.carrier_id || "None Assigned"}
                      </p>
                      {a.reason && (
                        <p className="text-xs text-red-500 mt-1">{a.reason}</p>
                      )}
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">
                        Time:{" "}
                        {a.p90_time_min
                          ? `${a.p90_time_min.toFixed(2)} min`
                          : "N/A"}
                      </p>
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
