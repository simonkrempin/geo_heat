import styles from "@/components/layer-selection.module.css";
import { useLayerContext } from "@/context/layer-context";
import React from "react";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
);

export default function LineChart() {
	const { clickedCountry, setClickedCountry, layerInformation } = useLayerContext();

	if (!clickedCountry) {
		return null;
	}

	if (!layerInformation || !layerInformation.metadata.timeData) {
		return null;
	}

	if (!layerInformation.values[clickedCountry]) {
		return null;
	}

	return <div
		style={{
			position: "fixed",
			width: "100vw",
			height: "100vh",
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
			padding: "100px 500px",
			backgroundColor: "rgba(0, 0, 0, 0.5)",
		}}
	>
		<div
			style={{
				position: "relative",
				width: "100%",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				flexDirection: "column",
				backgroundColor: "white",
				borderRadius: "16px",
				padding: "24px",
			}}
		>
			<div>
				<p
					style={{
						color: "black",
						fontSize: "24px",
					}}
				>{clickedCountry}</p>
				<button
					onClick={() => setClickedCountry(undefined)}
					style={{
						position: "absolute",
						top: "8px",
						right: "8px",
						color: "white",
						borderRadius: "16px",
						cursor: "pointer",
						border: "none",
						backgroundColor: "transparent",
					}}
				>
					<img
						className={styles.selection__search_bar__xmark}
						src="svg/xmark.svg"
						alt="X mark"
					/>
				</button>
			</div>
			<Line
				style={{}}
				data={{
					labels: Object.keys((layerInformation?.values[clickedCountry] as Record<string, number>)),
					datasets: [
						{
							label: layerInformation.metadata.details,
							data: Object.values((layerInformation?.values[clickedCountry] as Record<string, number>)), // Data points for the line
							fill: false,
							borderColor: "rgb(243,165,63)", // Line color
							tension: 0.1, // Smoothening of the line
						},
					],
				}}
				options={{
					scales: {
						y: {
							beginAtZero: true,
						},
					},
				}}
			/>
		</div>
	</div>;
}
