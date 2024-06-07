import { useLayerContext } from "@/context/layer-context";
import { useSearchParams } from "next/navigation";
import React, { useRef } from "react";
import styles from "./layer-selection.module.css";

interface LayerSelectionProps {
	children?: React.ReactNode;
}

const LayerSelection: React.FC<LayerSelectionProps> = ({ children }) => {
	const searchParams = useSearchParams();
	const {
		setSelectedLayer,
		allLayers,
		selectedLayer,
		selectedYear,
		setSelectedYear,
		layerInformation,
	} = useLayerContext();

	const [search, setSearch] = React.useState<string>(searchParams.get("layer") ?? "");
	const [searchSelected, setSearchSelected] = React.useState<boolean>(false);
	const layersRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
		if (layersRef.current?.contains(event.relatedTarget as Node)) {
			return;
		}

		setSearchSelected(false);
	};

	const layersToDisplay = search === ""
		? allLayers
		: allLayers.filter((layer) => layer.toLowerCase().includes(search.toLowerCase()));

	const isTimeData = layerInformation?.metadata?.timeData ?? false;

	return (
		<aside className={`${styles.selection} ${selectedLayer !== null ? styles.selection__active : ""}`}>
			<div style={{ width: "calc(100% - 40px)", position: "absolute", zIndex: 100, backgroundColor: "white" }}>
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
					{searchSelected &&
                        <div
                            className={styles.selection__layers}
                            ref={layersRef}
                        >
							{layersToDisplay.map((layer, index) => {
								return (
									<button
										tabIndex={index}
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
                        </div>
					}
				</div>
				{!searchSelected && selectedLayer !== null && isTimeData && <div style={{ marginBottom: "10px" }}>
                    <input
                        type={"range"}
                        min={0}
                        max={100}
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        style={{ padding: "10px 0", width: "100%" }}
                    />
					<div style={{ display: "flex", justifyContent: "space-between", color: "black" }}>
						<p>{layerInformation?.metadata?.timeMin}</p>
						<p>{selectedYear}</p>
						<p>{layerInformation?.metadata?.timeMax}</p>
					</div>
                </div>}
			</div>
			<div className={`${styles.selection__body} ${isTimeData ? styles.selection__body__slide_active : ""}`}>
				{children}
			</div>
		</aside>
	);
};

export default LayerSelection;
