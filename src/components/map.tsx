import { useLayerContext } from "@/context/layer-context";
import { getColorByValue } from "@/utils/color-by-value";
import {
	ComposableMap,
	Geography,
	Geographies,
	ZoomableGroup,
} from "react-simple-maps";
import React, {
	useState,
} from "react";

const geoJSON: string = "/world-110m.json";

export default function Map() {
	const { layerInformation, getCountryValue, setClickedCountry, selectedLayer } = useLayerContext();

	const [position, setPosition] = useState<Position>({
		coordinates: [0, 0],
		zoom: 1,
	});

	const onClick = (clickedCountry: string) => {
		if (selectedLayer === null) {
			return;
		}

		setClickedCountry(clickedCountry.toLowerCase());
	}

	const setMoveCursor = () => {
		document.getElementsByTagName("body")[0].style.cursor = "grab";
	}

	const resetCursor = () => {
		document.getElementsByTagName("body")[0].style.cursor = "";
	}

	return <ComposableMap>
		<ZoomableGroup
			zoom={position.zoom}
			center={position.coordinates}
			minZoom={1}
			maxZoom={4}
			onMoveEnd={(position: Position) => {
				setPosition(position);
				resetCursor();
			}}
			onMoveStart={setMoveCursor}
		>
			<Geographies geography={geoJSON}>
				{({ geographies }) => {
					return geographies.map((geo) => <Geography
						key={geo.rsmKey}
						geography={geo}
						data-countryname={geo.properties.name}
						stroke="#555"
						onClick={() => onClick(geo.properties.name)}
						style={{
							pressed: {
								outline: "none",
								fill: getColorByValue(layerInformation, getCountryValue(geo.properties.name)),
							},
							default: {
								fill: getColorByValue(layerInformation, getCountryValue(geo.properties.name)),
								outline: "none",
							},
							hover: {
								outline: "none",
								fill: getColorByValue(layerInformation, getCountryValue(geo.properties.name)),
							},
						}}
					/>);
				}}
			</Geographies>
		</ZoomableGroup>
	</ComposableMap>;
}
