"use client";

import styles from "./page.module.css";
import Map from "@/components/map";

export default function Home() {
    return (
        <main className={styles.main}>
            <Map />
        </main>
    );
}
