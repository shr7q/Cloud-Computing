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

  dropoffLat: z
    .string()
    .trim()
    .refine(
      (val) =>
        !isNaN(parseFloat(val)) &&
        parseFloat(val) >= -90 &&
        parseFloat(val) <= 90,
      { message: "Valid latitude required (-90 to 90)" }
    ),

  dropoffLon: z
    .string()
    .trim()
    .refine(
      (val) =>
        !isNaN(parseFloat(val)) &&
        parseFloat(val) >= -180 &&
        parseFloat(val) <= 180,
      { message: "Valid longitude required (-180 to 180)" }
    ),

  requestedDate: z.string().optional(),
  requestedHour: z.string().optional(),
  requestedMinute: z.string().optional(),
  requestedAmPm: z.string().optional(),
});

type WorkOrderFormData = z.infer<typeof workOrderSchema>;

const WorkOrderForm = ({ addOrder }) => {
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
      // Convert date → dayOfWeek (0–6)
      let dayOfWeek = null;
      if (data.requestedDate) {
        dayOfWeek = new Date(data.requestedDate).getDay();
      } else {
        dayOfWeek = new Date().getDay();
      }

      // Build time string
      const timeString = `${data.requestedHour}:${data.requestedMinute} ${data.requestedAmPm}`;

      // Build ML payload
      const mlPayload = {
        clientName: data.clientName,
        dropoffLat: parseFloat(data.dropoffLat),
        dropoffLon: parseFloat(data.dropoffLon),
        dayOfWeek,
        time: timeString,
      };
        
      //API url
      const PREDICT_API_URL = "https://scunlt76a3.execute-api.us-east-1.amazonaws.com";

      const mlResponse = await fetch(PREDICT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mlPayload),
      });

      if (!mlResponse.ok) {
        const text = await mlResponse.text();
        throw new Error(text || "Prediction API failed");
      }

      const prediction = await mlResponse.json();

      const etaMinutes = prediction.etaMinutes ?? 0;
      const distanceKm = prediction.distanceKm ?? 0;

      // Build final work order
      const newOrder = {
        id: "WO-" + Math.floor(Math.random() * 10000),
        clientName: data.clientName,
        requestedTime: `${data.requestedDate} ${timeString}`,
        distance: distanceKm,
        eta: etaMinutes,
        status: "pending",
        dropoffLat: data.dropoffLat,
        dropoffLon: data.dropoffLon,
      };

      addOrder(newOrder);

      toast.success("Work order submitted successfully", {
        description: `Order for ${data.clientName} has been added.`,
      });

      reset();
    } catch (error: any) {
      console.error(error);
      toast.error("Failed to submit work order", {
        description: error.message || "Please try again.",
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
            placeholder="Enter client name"
            {...register("clientName")}
            className="bg-secondary border-border"
          />
          {errors.clientName && (
            <p className="text-sm text-destructive">
              {errors.clientName.message}
            </p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="dropoffLat">Dropoff Latitude</Label>
            <Input
              id="dropoffLat"
              placeholder="39.0839"
              {...register("dropoffLat")}
              className="bg-secondary border-border"
            />
            {errors.dropoffLat && (
              <p className="text-sm text-destructive">
                {errors.dropoffLat.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dropoffLon">Dropoff Longitude</Label>
            <Input
              id="dropoffLon"
              placeholder="-77.1528"
              {...register("dropoffLon")}
              className="bg-secondary border-border"
            />
            {errors.dropoffLon && (
              <p className="text-sm text-destructive">
                {errors.dropoffLon.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Requested Start Date (Optional)</Label>
          <Input type="date" {...register("requestedDate")} className="bg-secondary border-border" />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Hour</Label>
            <select {...register("requestedHour")} className="bg-secondary border-border rounded-md p-2">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label>Minute</Label>
            <select {...register("requestedMinute")} className="bg-secondary border-border rounded-md p-2">
              <option value="00">00</option>
              <option value="30">30</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label>AM/PM</Label>
            <select {...register("requestedAmPm")} className="bg-secondary border-border rounded-md p-2">
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>
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
