"use client";
import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: icon,
  shadowUrl: iconShadow,
});

interface Worker {
  id: string;
  lat: number;
  lng: number;
}

interface RiskArea {
  id: string;
  coordinates: [number, number][];
}

export default function MapaPorto() {
  const mapRef = useRef<L.Map | null>(null);
  const drawnPolygon = useRef<L.Polygon | null>(null);
  const [riskAreas, setRiskAreas] = useState<RiskArea[]>([]);
  const [workers] = useState<Worker[]>([
    {
      id: "1",
      lat: -2.5828889,
      lng: -44.368611,
    },
  ]);
  const [drawing, setDrawing] = useState(false);
  const [newArea, setNewArea] = useState<[number, number][]>([]);

  useEffect(() => {
    if (!mapRef.current) {
      const map = L.map("map", {
        center: [-2.567, -44.371],
        zoom: 14,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      map.on("click", (e: L.LeafletMouseEvent) => {
        if (drawing) {
          const latlng: [number, number] = [e.latlng.lat, e.latlng.lng];
          setNewArea((prev) => [...prev, latlng]);
        }
      });

      mapRef.current = map;
    }
  }, [drawing]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove visualização anterior do polígono sendo desenhado
    if (drawnPolygon.current) {
      map.removeLayer(drawnPolygon.current);
    }

    if (drawing && newArea.length > 1) {
      drawnPolygon.current = L.polygon(newArea, {
        color: "orange",
        dashArray: "4",
      }).addTo(map);
    }

    // Renderizar áreas de risco salvas
    riskAreas.forEach((area) => {
      L.polygon(area.coordinates, { color: "red" }).addTo(map);
    });

    // Renderizar trabalhadores
    workers.forEach((worker) => {
      const marker = L.marker([worker.lat, worker.lng]).addTo(map);

      riskAreas.forEach((area) => {
        const polygon = L.polygon(area.coordinates);
        if (polygon.getBounds().contains([worker.lat, worker.lng])) {
          alert(`Alerta: Trabalhador ${worker.id} está em uma área de risco!`);
        }
      });
    });
  }, [riskAreas, newArea, drawing]);

  const handleCreateRiskArea = () => {
    if (newArea.length > 2) {
      const newRisk: RiskArea = {
        id: Date.now().toString(),
        coordinates: newArea,
      };
      setRiskAreas((prev) => [...prev, newRisk]);
      setNewArea([]);
      setDrawing(false);

      if (drawnPolygon.current && mapRef.current) {
        mapRef.current.removeLayer(drawnPolygon.current);
        drawnPolygon.current = null;
      }
    }
  };

  return (
    <div className="relative w-full h-[600px]">
      <div id="map" className="absolute inset-0 z-0 rounded-xl" />

      <div className="absolute top-4 left-4 z-20 flex gap-4">
        {!drawing && (
          <Button
            onClick={() => {
              setNewArea([]);
              setDrawing(true);
            }}
          >
            Criar Área de Risco
          </Button>
        )}
        {drawing && newArea.length > 2 && (
          <Button variant="destructive" onClick={handleCreateRiskArea}>
            Confirmar Área
          </Button>
        )}
      </div>
    </div>
  );
}
