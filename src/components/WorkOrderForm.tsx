import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";

const workOrderSchema = z.object({
  clientName: z.string().trim().min(1, "Client name is required").max(100),
  pickupLat: z.string().trim().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= -90 && parseFloat(val) <= 90, {
    message: "Valid latitude required (-90 to 90)",
  }),
  pickupLon: z.string().trim().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= -180 && parseFloat(val) <= 180, {
    message: "Valid longitude required (-180 to 180)",
  }),
  dropoffLat: z.string().trim().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= -90 && parseFloat(val) <= 90, {
    message: "Valid latitude required (-90 to 90)",
  }),
  dropoffLon: z.string().trim().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= -180 && parseFloat(val) <= 180, {
    message: "Valid longitude required (-180 to 180)",
  }),
  requestedTime: z.string().optional(),
});

type WorkOrderFormData = z.infer<typeof workOrderSchema>;

const WorkOrderForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WorkOrderFormData>({
    resolver: zodResolver(workOrderSchema),
  });

  const onSubmit = async (data: WorkOrderFormData) => {
    setIsSubmitting(true);
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Submitting order:", data);
      
      toast.success("Work order submitted successfully", {
        description: `Order for ${data.clientName} has been added to the queue.`,
      });
      reset();
    } catch (error) {
      toast.error("Failed to submit work order", {
        description: "Please try again or contact support.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="gradient-card border-border p-6">
      <div className="mb-6 flex items-center gap-2">
        <Plus className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">New Work Order</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="clientName">Client Name</Label>
          <Input
            id="clientName"
            {...register("clientName")}
            placeholder="Enter client name"
            className="bg-secondary border-border"
          />
          {errors.clientName && (
            <p className="text-sm text-destructive">{errors.clientName.message}</p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="pickupLat">Pickup Latitude</Label>
            <Input
              id="pickupLat"
              {...register("pickupLat")}
              placeholder="39.1547"
              className="bg-secondary border-border"
            />
            {errors.pickupLat && (
              <p className="text-sm text-destructive">{errors.pickupLat.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="pickupLon">Pickup Longitude</Label>
            <Input
              id="pickupLon"
              {...register("pickupLon")}
              placeholder="-77.2405"
              className="bg-secondary border-border"
            />
            {errors.pickupLon && (
              <p className="text-sm text-destructive">{errors.pickupLon.message}</p>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="dropoffLat">Dropoff Latitude</Label>
            <Input
              id="dropoffLat"
              {...register("dropoffLat")}
              placeholder="39.0839"
              className="bg-secondary border-border"
            />
            {errors.dropoffLat && (
              <p className="text-sm text-destructive">{errors.dropoffLat.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dropoffLon">Dropoff Longitude</Label>
            <Input
              id="dropoffLon"
              {...register("dropoffLon")}
              placeholder="-77.1528"
              className="bg-secondary border-border"
            />
            {errors.dropoffLon && (
              <p className="text-sm text-destructive">{errors.dropoffLon.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="requestedTime">Requested Start Time (Optional)</Label>
          <Input
            id="requestedTime"
            type="datetime-local"
            {...register("requestedTime")}
            className="bg-secondary border-border"
          />
          {errors.requestedTime && (
            <p className="text-sm text-destructive">{errors.requestedTime.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Work Order"
          )}
        </Button>
      </form>
    </Card>
  );
};

export default WorkOrderForm;
