"use client";
import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

// Corrige os ícones padrão do Leaflet
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
  const [riskAreas, setRiskAreas] = useState<RiskArea[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([
    {
      id: "1",
      lat: -2.5828889,
      lng: -44.368611,
    },
  ]);
  const [drawing, setDrawing] = useState(false);
  const [newArea, setNewArea] = useState<[number, number][]>([]);
  const drawnLayer = useRef<L.Polygon | null>(null);

  useEffect(() => {
    if (!mapRef.current) {
      const map = L.map("map").setView([-2.567, -44.371], 14);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      map.on("click", (e: L.LeafletMouseEvent) => {
        if (drawing) {
          setNewArea((prev) => {
            const updated = [...prev, [e.latlng.lat, e.latlng.lng]];
            return updated;
          });
        }
      });

      mapRef.current = map;
    }
  }, [drawing]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Limpa camadas anteriores
    map.eachLayer((layer) => {
      if (layer instanceof L.Polygon || layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Renderiza áreas de risco
    riskAreas.forEach((area) => {
      L.polygon(area.coordinates, { color: "red" }).addTo(map);
    });

    // Renderiza a nova área em desenho
    if (drawing && newArea.length > 1) {
      if (drawnLayer.current) {
        map.removeLayer(drawnLayer.current);
      }
      drawnLayer.current = L.polygon(newArea, {
        color: "orange",
        dashArray: "4",
      }).addTo(map);
    }

    // Renderiza trabalhadores
    workers.forEach((worker) => {
      const marker = L.marker([worker.lat, worker.lng]).addTo(map);

      riskAreas.forEach((area) => {
        const polygon = L.polygon(area.coordinates);
        if (polygon.getBounds().contains([worker.lat, worker.lng])) {
          alert(`Alerta: Trabalhador ${worker.id} está em uma área de risco!`);
        }
      });
    });
  }, [riskAreas, workers, newArea, drawing]);

  const handleCreateRiskArea = () => {
    if (newArea.length > 2) {
      const newRisk: RiskArea = {
        id: Date.now().toString(),
        coordinates: newArea,
      };
      setRiskAreas((prev) => [...prev, newRisk]);
      setNewArea([]);
      setDrawing(false);
      if (drawnLayer.current && mapRef.current) {
        mapRef.current.removeLayer(drawnLayer.current);
        drawnLayer.current = null;
      }
    }
  };

  return (
    <div className="relative w-full h-[600px] rounded-xl overflow-hidden">
      <div id="map" className="absolute inset-0 z-0" />

      {drawing && (
        <div className="absolute top-4 left-4 z-20 flex gap-4">
          <Button variant="destructive" onClick={handleCreateRiskArea}>
            Confirmar Área
          </Button>
        </div>
      )}

      {!drawing && (
        <div className="absolute top-4 left-4 z-20">
          <Button
            onClick={() => {
              setNewArea([]);
              setDrawing(true);
            }}
          >
            Criar Área de Risco
          </Button>
        </div>
      )}
    </div>
  );
}
