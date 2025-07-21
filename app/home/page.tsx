"use client";

import React from "react";
import Layout from "../layout/layout";
import MapaPorto from "@/components/ui/MapaPorto";
import SaudeTempoReal from "@/components/ui/SaudeTempoReal";

export default function Page() {
  return (
    <Layout>
      <div className="flex flex-col lg:flex-row gap-6 p-4">
        <div className="flex-1">
          <MapaPorto />
        </div>
        <div className="w-full lg:max-w-sm">
          <SaudeTempoReal />
        </div>
      </div>
    </Layout>
  );
}
