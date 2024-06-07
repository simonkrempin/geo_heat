import React from "react";
import styles from "./data-grid.module.css";
import { useLayerContext } from "@/context/layer-context";
import { getColorByValue } from "@/utils/color-by-value";

export default function DataGrid() {
	const { layerInformation } = useLayerContext();

	const selectCountry = (country: string) => {
		const countryElement = getCountryElement(country);

		if (countryElement) {
			countryElement.style.fill = "rgb(136, 136, 136)";
		}
	}

	const deSelectCountry = (country: string) => {
		const countryElement = getCountryElement(country);

		if (countryElement) {
			countryElement.style.fill = getColorByValue(layerInformation, country);
		}
	}

	const getCountryElement = (country: string): HTMLElement | null => {
		const elements = document.getElementsByClassName("rsm-geography");

		let countryElement = null;
		for (let i = 0; i < elements.length; i++) {
			const element = elements[i] as HTMLElement;
			const dataCountryName = element.getAttribute("data-countryname");
			if (dataCountryName?.toLowerCase() === country.toLowerCase()) {
				countryElement = element;
				break;
			}
		}

		return countryElement;
	}

	if (!layerInformation) {
		return null;
	}

	return (
		<table className={styles.table}>
			<thead>
			<tr>
				<th className={styles.table__header_item}>Country</th>
				<th className={styles.table__header_item}>Values</th>
			</tr>
			</thead>
			<tbody>
			{Object.entries(layerInformation.values).filter(x => x[1] !== null).map(([country, value]) => (
				<tr className={styles.table__entry} key={country} onMouseLeave={() => deSelectCountry(country)} onMouseOver={() => selectCountry(country)}>
					<td >{country}</td>
					<td >{value} {layerInformation.metadata.unit}</td>
				</tr>
			))}
			</tbody>
		</table>
	);
}
