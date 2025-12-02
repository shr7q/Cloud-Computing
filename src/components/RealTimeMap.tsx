import { useEffect, useRef } from "react";

declare const H: any;

interface Carrier {
  carrier_id: string;
  lat: number;
  lng: number;
}

interface RealTimeMapProps {
  optimizedRoutes: Record<string, { lat: number; lng: number }[]>;
  runSimulationTrigger: number;
}

export default function RealTimeMap({
  optimizedRoutes,
  runSimulationTrigger,
}: RealTimeMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const map = useRef<any>(null);
  const markers = useRef<Record<string, any>>({});

  // Hardcoded starting positions for 3 carriers
  const initialCarriers: Carrier[] = [
    { carrier_id: "C1", lat: 39.1500, lng: -77.2000 },
    { carrier_id: "C2", lat: 39.1200, lng: -77.1500 },
    { carrier_id: "C3", lat: 39.0950, lng: -77.2500 },
  ];

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || map.current) return;

    const platform = new H.service.Platform({
      apikey: import.meta.env.VITE_HERE_API_KEY,
    });

    const layers = platform.createDefaultLayers();

    map.current = new H.Map(
      mapRef.current,
      layers.vector.normal.map,
      {
        zoom: 11,
        center: { lat: 39.100, lng: -77.200 },
      }
    );

    new H.mapevents.Behavior(new H.mapevents.MapEvents(map.current));
    const ui = H.ui.UI.createDefault(map.current, layers);

    // Place initial carriers on map
    initialCarriers.forEach((c) => {
      const marker = new H.map.Marker({ lat: c.lat, lng: c.lng });
      map.current.addObject(marker);
      markers.current[c.carrier_id] = marker;
    });
  }, []);

  // Movement animator
  const animateCarrier = (carrierId: string, route: any[]) => {
    let index = 0;

    const interval = setInterval(() => {
      if (index >= route.length) {
        clearInterval(interval);
        return;
      }

      const point = route[index];

      if (markers.current[carrierId]) {
        markers.current[carrierId].setGeometry({
          lat: point.lat,
          lng: point.lng,
        });
      }

      index++;
    }, 1000); // moves every 1 second
  };

  // Start animation when user clicks "Run Optimization"
  useEffect(() => {
    if (!runSimulationTrigger) return;

    Object.keys(optimizedRoutes).forEach((carrierId) => {
      animateCarrier(carrierId, optimizedRoutes[carrierId]);
    });
  }, [runSimulationTrigger]);

  return (
    <div className="w-full mt-6">
      <h2 className="text-xl font-semibold text-white mb-2">Real-Time Fleet Map</h2>
      <div
        ref={mapRef}
        className="w-full h-[400px] rounded-xl overflow-hidden border border-slate-700"
      />
    </div>
  );
}
