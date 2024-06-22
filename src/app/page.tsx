"use client";

import React, { Suspense } from "react";
import styles from "./page.module.css";

import { LayerContextProvider, useLayerContext } from "@/context/layer-context";
import { Poppins } from "next/font/google";

import LayerSelection from "@/components/layer-selection";
import Map from "@/components/map";
import Pointer from "@/components/pointer";
import DataGrid from "@/components/data-grid";
import LoadingBuffer from "@/components/loading-buffer";
import LineChart from "@/components/line-chart";
import ChartMeta from "@/components/chart-meta";

const poppins = Poppins({
	weight: "400",
	subsets: ["latin"],
	display: "swap",
});

export default function Home() {
	return (
		<>
        	<style jsx global>
				{`
					* {
						font-family: ${poppins.style.fontFamily};
					}
				`}
			</style>
			<main className={styles.main}>
				<Suspense fallback={<LoadingBuffer />}>
					<LayerContextProvider>
						<Pointer />
						<LayerSelection>
							<DataGrid />
						</LayerSelection>
						<Map />
						<Statistics />
					</LayerContextProvider>
				</Suspense>
			</main>
		</>
	);
}

function Statistics() {
	const { clickedCountry, layerInformation } = useLayerContext();

    if (!clickedCountry) {
        return null;
    }

    if (!layerInformation || !layerInformation.metadata.timeData) {
        return null;
    }

    if (!layerInformation.values[clickedCountry]) {
        return null;
    }

	return (<div style={{
 		position: "fixed",
		width: "100vw",
		height: "100vh",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		// padding: "100px 500px",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	}}>
		<LineChart />
		<ChartMeta />
	</div>);
}