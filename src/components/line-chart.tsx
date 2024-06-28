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

	const calculateStats = () => {
		const values = Object.entries(layerInformation?.values[clickedCountry] || {})
			.filter(([year, value]) => value !== null)
			.map(([year, value]) => ({ year, value }));

		const min = Math.min(...values.map(obj => obj.value));
		const minYear = values.find(obj => obj.value === min);

		const max = Math.max(...values.map(obj => obj.value));
		const maxYear = values.find(obj => obj.value === max);

		const average = values.reduce((sum, { value }) => sum + value, 0) / values.length;
		const biggestDifference = Math.max(...values.map(value => Math.abs(value.value - min)));
		const differenceLastFirst = values[values.length - 1].value - values[0].value;
		const span = values[0].year + " - " + values[values.length - 1].year;
		return { minYear, maxYear, average, biggestDifference, differenceLastFirst, span };
	};

	const { minYear, maxYear, average, biggestDifference, differenceLastFirst, span } = calculateStats();

	return (
		<div
			style={{
				justifyContent: "center",
				position: "relative",
				display: "flex",
				alignItems: "center",
				flexDirection: "column",
				backgroundColor: "white",
				borderRadius: "16px",
				width: "50vw",
				height: "90vh",
				//top right bottom left
				padding: "10px 10px 10px 10px"
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
							data: Object.values(layerInformation?.values[clickedCountry] as Record<string, number>).filter(value => value !== 0), // Data points for the line
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
			<div
				style={{ color: "black" }}
			>
				<table>
					<thead
						style={{ textAlign: "left"}}
					>
						<tr>
							<th></th>
							<th>Year</th>
							<th>Value</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td className="field">Max</td>
							<td>{maxYear?.year}</td>
							<td>{maxYear?.value.toFixed(2)}</td>
						</tr>
						<tr>
							<td>Min</td>
							<td>{minYear?.year}</td>
							<td>{minYear?.value.toFixed(2)}</td>
						</tr>
						<tr>
							<td>Average</td>
							<td></td>
							<td>{average.toFixed(2)}</td>
						</tr>
						<tr>
							<td>Difference between <br /> last and first value</td>
							<td>{span}</td>
							<td>{differenceLastFirst.toFixed(2)}</td>
						</tr>
						<tr>
							<td>Biggest difference</td>
							<td>{maxYear?.year + " - " + minYear?.year}</td>
							<td>{biggestDifference.toFixed(2)}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>);
}
