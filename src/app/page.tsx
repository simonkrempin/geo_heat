"use client";

import React from "react";
import styles from "./page.module.css";
import { useSearchParams } from "next/navigation";
import { LayerContextProvider } from "@/context/layer-context";

import LayerSelection from "@/components/layer-selection";
import Map from "@/components/map";
import Pointer from "@/components/pointer";
import DataGrid from "@/components/data-grid";

export default function Home() {
    const searchParams = useSearchParams();
    const initialLayer = searchParams.get("layer");

    return (
        <main className={styles.main}>
            <LayerContextProvider initialValue={initialLayer}>
                <Pointer />
                <LayerSelection initialValue={initialLayer}>
                    <DataGrid />
                </LayerSelection>
                <Map />
            </LayerContextProvider>
        </main>
    );
}
