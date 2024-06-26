import React from "react";
import styles from "./data-grid.module.css";
import { useLayerContext } from "@/context/layer-context";
import { getColorByValue } from "@/utils/color-by-value";

export default function DataGrid() {
	const {
		layerInformation,
		selectedYear,
		getCountryValue,
		displayCountryValue,
		setClickedCountry,
	} = useLayerContext();

	const selectCountry = (country: string) => {
		const countryElement = getCountryElement(country);

		if (countryElement) {
			countryElement.style.fill = "rgb(136, 136, 136)";
		}
	};

	const deselectCountry = (country: string) => {
		const countryElement = getCountryElement(country);

		if (countryElement) {
			countryElement.style.fill = getColorByValue(layerInformation, getCountryValue(country));
		}
	};

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
	};

	if (!layerInformation) {
		return null;
	}

	return (
		<table className={styles.table}>
			<thead style={{ backgroundColor: "white", position: "sticky", top: 0 }}>
			<tr>
				<th className={styles.table__header_item}>Country</th>
				<th className={styles.table__header_item}>Values</th>
			</tr>
			</thead>
			<tbody className={styles.table__tbody}>
			{Object.entries(layerInformation.values)
				.filter((x: [string, number]) => x[1] !== null)
				.sort((a, b) => {
					if (selectedYear !== undefined) {
						return compare(b[1][selectedYear], a[1][selectedYear]);
					}

					return compare(b[1], a[1]);
				})
				.map(([country]) => {
					return (
						<tr
							className={styles.table__entry}
							key={country}
							onMouseLeave={() => deselectCountry(country)}
							onMouseOver={() => selectCountry(country)}
							onClick={() => setClickedCountry(country)}
						>
							<td >{country}</td>
							<td>{displayCountryValue(country)}</td>
						</tr>
					);
				})}
			</tbody>
		</table>
	);
}

function compare(a: unknown, b: unknown): number {
	if (a === null) {
		return -1;
	}

	if (b === null) {
		return 1;
	}

	return Number(a) - Number(b);
}
