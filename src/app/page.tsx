"use client";

import React, { Suspense } from "react";
import styles from "./page.module.css";

import { LayerContextProvider } from "@/context/layer-context";
import { Poppins } from "next/font/google";

import LayerSelection from "@/components/layer-selection";
import Map from "@/components/map";
import Pointer from "@/components/pointer";
import DataGrid from "@/components/data-grid";
import LoadingBuffer from "@/components/loading-buffer";
import {indicatorFetcher} from "@/api/indicatorFetcher";
import {dataFetcher} from "@/api/dataFetcher";

const poppins = Poppins({
	weight: "400",
	subsets: ["latin"],
	display: "swap",
});

export default function Home() {
	React.useEffect(() => {
		indicatorFetcher().then((dataSource) => {
			if (!dataSource) {
				return;
			}

            dataFetcher(dataSource.Data[0].id).then((data) => {
                console.log(data);
            });
        });
    }, []);

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
					</LayerContextProvider>
				</Suspense>
			</main>
		</>
	);
}
