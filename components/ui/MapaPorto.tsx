"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Polygon,
  useMapEvents,
} from "react-leaflet";
import { useState } from "react";
import L from "leaflet";
import { Button } from "@/components/ui/button";

// Coordenadas do centro do Porto do Itaqui
const CENTER: [number, number] = [-2.5715, -44.372];

// Pontos de referência fixos
const pontosFixos: { nome: string; coords: [number, number] }[] = [
  { nome: "M01", coords: [-2.58289, -44.36861] },
  { nome: "M02", coords: [-2.57658, -44.36967] },
  { nome: "PT A’", coords: [-2.57, -44.37964] },
  { nome: "PT A", coords: [-2.56783, -44.37475] },
  { nome: "PT B", coords: [-2.56658, -44.37411] },
  { nome: "MG", coords: [-2.56947, -44.35736] },
  { nome: "PT 6", coords: [-2.57678, -44.36408] },
  { nome: "PT H", coords: [-2.61839, -44.35711] },
  { nome: "PT J", coords: [-2.61931, -44.36253] },
];

// Componente auxiliar para capturar cliques no mapa
function CriadorDeArea({
  ativa,
  onAdicionarPonto,
}: {
  ativa: boolean;
  onAdicionarPonto: (coords: [number, number]) => void;
}) {
  useMapEvents({
    click(e) {
      if (ativa) {
        const novaCoord: [number, number] = [e.latlng.lat, e.latlng.lng];
        onAdicionarPonto(novaCoord);
      }
    },
  });
  return null;
}

export default function MapaPorto() {
  const [areasDeRisco, setAreasDeRisco] = useState<[number, number][][]>([]);
  const [areaTemp, setAreaTemp] = useState<[number, number][]>([]);
  const [modoCriacao, setModoCriacao] = useState(false);

  const adicionarPonto = (coords: [number, number]) => {
    setAreaTemp((prev) => [...prev, coords]);
  };

  const finalizarArea = () => {
    if (areaTemp.length >= 3) {
      setAreasDeRisco((prev) => [...prev, areaTemp]);
      setAreaTemp([]);
      setModoCriacao(false);
    }
  };

  const cancelarArea = () => {
    setAreaTemp([]);
    setModoCriacao(false);
  };

  return (
    <div className="w-full h-[200px] rounded-xl overflow-hidden border shadow">
      <MapContainer
        center={CENTER}
        zoom={17}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <CriadorDeArea ativa={modoCriacao} onAdicionarPonto={adicionarPonto} />

        {/* Pontos fixos */}
        {pontosFixos.map((p, i) => (
          <Marker key={i} position={p.coords} />
        ))}

        {/* Área em edição */}
        {areaTemp.length > 1 && <Polygon positions={areaTemp} color="red" />}

        {/* Áreas de risco salvas */}
        {areasDeRisco.map((area, i) => (
          <Polygon key={i} positions={area} color="red" />
        ))}
      </MapContainer>

      {/* Controles */}
      <div className="p-4 bg-white border-t flex flex-wrap gap-2 justify-between items-center">
        {!modoCriacao ? (
          <Button onClick={() => setModoCriacao(true)}>
            Criar Área de Risco
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={finalizarArea} variant="destructive">
              Salvar Área
            </Button>
            <Button variant="outline" onClick={cancelarArea}>
              Cancelar
            </Button>
          </div>
        )}
        <span className="text-sm text-muted-foreground">
          {modoCriacao
            ? `Clique no mapa para adicionar pontos (mín. 3)`
            : `Clique no botão para criar uma nova área`}
        </span>
      </div>
    </div>
  );
}
