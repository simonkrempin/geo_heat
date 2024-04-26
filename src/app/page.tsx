"use client";

import React from "react";
import styles from "./page.module.css";

import { LayerContextProvider } from "@/context/layer-context";

import LayerSelection from "@/components/layer-selection";
import Map from "@/components/map";
import Pointer from "@/components/pointer";

export default function Home() {
    return (
        <main className={styles.main}>
            <LayerContextProvider>
                <Pointer />
                <LayerSelection />
                <Map />
            </LayerContextProvider>
        </main>
    );
}
