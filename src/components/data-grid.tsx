import React from "react";
import styles from "./data-grid.module.css";

import { useLayerContext } from "@/context/layer-context";

export default function DataGrid() {
	const { layerInformation } = useLayerContext();

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
				{Object.entries(layerInformation.values).map(([country, value]) => (
					<tr key={country}>
						<td className={styles.table__entry}>{country}</td>
						<td className={styles.table__entry}>{value} {layerInformation.metadata.unit}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}