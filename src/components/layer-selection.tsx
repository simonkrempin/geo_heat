import { useLayerContext } from "@/context/layer-context";
import { useSearchParams } from "next/navigation";
import React, {
	useEffect,
	useRef,
} from "react";
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
	const [layersToDisplay, setLayersToDisplay] = React.useState<{
		href: string,
		title: string,
	}[]>([])
	const layersRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	let throttle = useRef<any>();

	const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
		if (layersRef.current?.contains(event.relatedTarget as Node)) {
			return;
		}

		setSearchSelected(false);
	};

	useEffect(() => {
		if (throttle.current !== undefined) {
			clearTimeout(throttle.current);
		}

		throttle.current = setTimeout(() => {
			fetch(`https://${"VYV3Q7P27P"}-dsn.algolia.net/1/indexes/${"OPENWORLD_DATA"}/query`, {
				method: 'POST',
				body: JSON.stringify({
					params: `query=${search}`
				}),
				mode: 'cors',
				headers: new Headers({
					'Accept': 'application/json',
					'Content-Type': 'application/json; charset=UTF-8',
					'X-Algolia-API-Key': "98aa5a2d8b053c2e8800ac5205d65544",
					'X-Algolia-Application-Id': "VYV3Q7P27P"
				})
			})
				.then(result => result.json())
				.then(data => {
					if (!data.hits) {
						setLayersToDisplay([]);
						return;
					}

					setLayersToDisplay(data.hits.map((item: any) => ({
						id: item.href,
						title: item.title
					})));
				});
		}, 400);

		return () => {
			clearTimeout(throttle.current);
		}
	}, [search])

	const timeLayerMetadata = (layerInformation?.metadata as TimeLayerMetadata)?.timeData
		? layerInformation?.metadata as unknown as TimeLayerMetadata
		: undefined;
	const isTimeData = timeLayerMetadata !== undefined;

	return (
		<aside className={`${styles.selection} ${selectedLayer !== null ? styles.selection__active : ""}`}>
			<div style={{ width: "calc(100% - 40px)", position: "absolute", zIndex: 100 }}>
				<div className={styles.selection__layers_container}>
					<div className={styles.selection__search_bar_container}>
						<input
							ref={inputRef}
							className={styles.selection__search_bar}
							onFocus={() => setSearchSelected(true)}
							onBlur={handleBlur}
							onChange={(e) => {
								setSearch(e.target.value);
								setSelectedLayer(null);
							}}
							placeholder={"Search for statistics"}
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
						{/*<SearchBox*/}
						{/*	placeholder={"Search for statistics"}*/}
						{/*/>*/}
						{search
							? <img
								className={styles.selection__search_bar__xmark}
								src="svg/xmark.svg"
								alt="X mark"
								onClick={() => {
									if (inputRef.current !== null) {
										setSearch("");
										setSelectedLayer(null);
									}
								}}
							/>
							: <img
								className={styles.selection__search_bar__search_icon}
								src="svg/search.svg"
								alt="Search"
							/>
						}
					</div>
					{searchSelected &&
                        <div
                            className={styles.selection__layers}
                            ref={layersRef}
                        >
							{layersToDisplay.map((layer, index) => {
								return (
									<button
										tabIndex={index}
										key={`${layer.href}-button`}
										className={styles.selection__layers__button}
										onClick={() => {
											setSelectedLayer(layer.title);
											setSearchSelected(false);
											setSearch(layer.href);
										}}
									>
										{layer.title}
									</button>
								);
							})}
                        </div>
					}
				</div>
				{!searchSelected && selectedLayer !== null && isTimeData && selectedYear !== undefined && <div style={{ marginBottom: "10px" }}>
                    <input
                        type={"range"}
                        min={timeLayerMetadata.timeMin}
                        max={timeLayerMetadata.timeMax}
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        style={{
							padding: "10px 0",
							width: "100%",
							"--percent": (selectedYear - timeLayerMetadata.timeMin) / (timeLayerMetadata.timeMax - timeLayerMetadata.timeMin) * 100 + "%",
						} as any}
                    />
                    <div style={{ display: "flex", justifyContent: "space-between", color: "black" }}>
                        <p>{timeLayerMetadata.timeMin}</p>
                        <p>{selectedYear}</p>
                        <p>{timeLayerMetadata.timeMax}</p>
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
