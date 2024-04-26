"use client";

import LayerSelection from "@/components/layer-selection";
import { LayerContextProvider } from "@/context/layer-context";
import styles from "./page.module.css";
import Map from "@/components/map";

export default function Home() {
    return (
        <main className={styles.main}>
            <LayerContextProvider>
                <LayerSelection />
                <Map />
            </LayerContextProvider>
        </main>
    );
}
