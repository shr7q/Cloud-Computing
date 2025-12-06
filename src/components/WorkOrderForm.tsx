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

// -----------------------------
// Validation Schema
// -----------------------------
const workOrderSchema = z.object({
  clientName: z.string().trim().min(1, "Client name is required").max(100),

  dropoffLat: z
    .string()
    .trim()
    .refine(
      (val) => !isNaN(parseFloat(val)) && parseFloat(val) >= -90 && parseFloat(val) <= 90,
      { message: "Valid latitude required (-90 to 90)" }
    ),

  dropoffLon: z
    .string()
    .trim()
    .refine(
      (val) => !isNaN(parseFloat(val)) && parseFloat(val) >= -180 && parseFloat(val) <= 180,
      { message: "Valid longitude required (-180 to 180)" }
    ),

  requestedDate: z.string().optional(),    // <-- FIXED NAME
  requestedHour24: z.string().min(1, "Hour required"), // 00–23
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

  // -----------------------------
  // SUBMIT HANDLER
  // -----------------------------
  const onSubmit = async (data: WorkOrderFormData) => {
    setIsSubmitting(true);

    try {
      // Convert date → weekday (0–6)
      const dayOfWeek = data.requestedDate
        ? new Date(data.requestedDate).getDay()
        : new Date().getDay();

      // Build ML payload
      const mlPayload = {
        clientName: data.clientName,
        dropoffLat: parseFloat(data.dropoffLat),
        dropoffLon: parseFloat(data.dropoffLon),
        dayOfWeek,
        hour: parseInt(data.requestedHour24),   // ONLY hour
      };

      // -----------------------------
      // API URL
      // -----------------------------
      const PREDICT_API_URL =
        "https://scunlt76a3.execute-api.us-east-1.amazonaws.com/predict";
      // ❗ IMPORTANT: Make sure /predict exists in your API routes

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

      // Build work order entry for dashboard display
      const newOrder = {
        id: "WO-" + Math.floor(Math.random() * 10000),
        clientName: data.clientName,
        requestedTime: `${data.requestedDate} ${data.requestedHour24}:00`,
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

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <Card className="gradient-card border-border p-6">
      <div className="mb-6 flex items-center gap-2">
        <Plus className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">New Work Order</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* CLIENT NAME */}
        <div className="space-y-2">
          <Label htmlFor="clientName">Client Name</Label>
          <Input
            id="clientName"
            placeholder="Enter client name"
            {...register("clientName")}
            className="bg-secondary border-border"
          />
          {errors.clientName && (
            <p className="text-sm text-destructive">{errors.clientName.message}</p>
          )}
        </div>

        {/* LAT & LON */}
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
              <p className="text-sm text-destructive">{errors.dropoffLat.message}</p>
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
              <p className="text-sm text-destructive">{errors.dropoffLon.message}</p>
            )}
          </div>
        </div>

        {/* DATE */}
        <div className="space-y-2">
          <Label>Requested Start Date</Label>
          <Input
            type="date"
            {...register("requestedDate")}
            className="bg-secondary border-border"
          />
          {errors.requestedDate && (
            <p className="text-sm text-destructive">{errors.requestedDate.message}</p>
          )}
        </div>

        {/* 24 HOUR SELECTOR */}
        <div className="space-y-2">
          <Label>Departure Hour (24-hour format)</Label>
          <select
            {...register("requestedHour24")}
            className="bg-secondary border-border rounded-md p-2 w-full"
          >
            {Array.from({ length: 24 }, (_, i) =>
              i.toString().padStart(2, "0")
            ).map((hour) => (
              <option key={hour} value={hour}>
                {hour}:00
              </option>
            ))}
          </select>
          {errors.requestedHour24 && (
            <p className="text-sm text-destructive">{errors.requestedHour24.message}</p>
          )}
        </div>

        {/* SUBMIT BUTTON */}
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
