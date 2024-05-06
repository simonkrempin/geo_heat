import { useLayerContext } from "@/context/layer-context";
import React, { useRef } from "react";
import styles from "./layer-selection.module.css";

interface LayerSelectionProps {
	initialValue: string | null;
}

const LayerSelection: React.FC<LayerSelectionProps> = ({ initialValue }) => {
	const [search, setSearch] = React.useState<string>(initialValue ?? "");
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
		<aside className={`${styles.selection} ${selectedLayer !== null ? styles.selection__active : ""}`}>
			<div className={styles.selection__layers_container}>
				<input
					ref={inputRef}
					className={styles.selection__search_bar}
					onFocus={() => setSearchSelected(true)}
					onBlur={handleBlur}
					onChange={(e) => {
						setSearch(e.target.value);
						setSelectedLayer(null);
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
								key={`${layer}-button`}
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

export default LayerSelection;