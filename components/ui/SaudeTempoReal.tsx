"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Gauge, Thermometer, HeartPulse, Activity } from "lucide-react";

interface HealthData {
  bpm: number;
  spo2: number;
  stress: number;
  temperature: number;
}

export default function SaudeTempoReal() {
  const [data, setData] = useState<HealthData>({
    bpm: 0,
    spo2: 0,
    stress: 0,
    temperature: 0,
  });

  // Simulação de recebimento de dados em tempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setData({
        bpm: Math.floor(60 + Math.random() * 40),
        spo2: Math.floor(95 + Math.random() * 4),
        stress: Math.floor(Math.random() * 100),
        temperature: parseFloat((36 + Math.random()).toFixed(1)),
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="w-full max-w-md mx-auto p-4">
      <CardContent>
        <h2 className="text-xl font-bold mb-4 text-center">Dados de Saúde em Tempo Real</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HeartPulse className="text-red-600" />
              <span>BPM:</span>
            </div>
            <span className="font-semibold">{data.bpm}</span>
          </div>
          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="text-blue-600" />
              <span>SpO₂:</span>
            </div>
            <span className="font-semibold">{data.spo2}%</span>
          </div>
          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gauge className="text-yellow-600" />
              <span>Nível de Estresse:</span>
            </div>
            <span className="font-semibold">{data.stress}</span>
          </div>
          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Thermometer className="text-orange-500" />
              <span>Temperatura:</span>
            </div>
            <span className="font-semibold">{data.temperature} ºC</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
