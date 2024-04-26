import { useLayerContext } from "@/context/layer-context";
import React, { useRef } from "react";
import styles from "./layer-selection.module.css";

export default function LayerSelection() {
	const [search, setSearch] = React.useState<string>("");
	const [searchSelected, setSearchSelected] = React.useState<boolean>(false);
	const layersRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const { setSelectedLayer, allLayers, selectedLayer } = useLayerContext();

	const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
		if (layersRef.current?.contains(event.relatedTarget as Node)) {
			return;
		}

		setSearchSelected(false);
	};

	const layersToDisplay = search === ""
		? allLayers
		: allLayers.filter((layer) => layer.includes(search.toLowerCase()));

	return (
		<aside className={`${styles.selection} ${selectedLayer !== undefined ? styles.selection__active : ""}`}>
			<div className={styles.selection__layers_container}>
				<input
					ref={inputRef}
					className={styles.selection__search_bar}
					onFocus={() => setSearchSelected(true)}
					onBlur={handleBlur}
					onChange={(e) => {
						setSearch(e.target.value);
						setSelectedLayer(undefined);
					}}
					value={search}
					onKeyDown={(event) => {
						if (event.key === "Enter" && layersToDisplay.length > 0) {
							setSelectedLayer(layersToDisplay[0]);
							setSearchSelected(false);
							setSearch(layersToDisplay[0]);
							inputRef.current?.blur();
						}
					}}
				/>
				{ searchSelected && <div
					className={styles.selection__layers}
					ref={layersRef}
				>
					{layersToDisplay.map(layer => {
						return (
							<button
								className={styles.selection__layers__button}
								onClick={() => {
									setSelectedLayer(layer);
									setSearchSelected(false);
									setSearch(layer);
								}}
							>
								{layer}
							</button>
						);
					})}
				</div>}
			</div>
		</aside>
	);
}