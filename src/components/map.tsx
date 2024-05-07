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
	const { layerInformation } = useLayerContext();

	const [position, setPosition] = useState<Position>({
		coordinates: [0, 0],
		zoom: 1,
	});

	return <ComposableMap>
		<ZoomableGroup
			zoom={position.zoom}
			center={position.coordinates}
			minZoom={1}
			maxZoom={4}
			onMoveEnd={(position: Position) => setPosition(position)}
		>
			<Geographies geography={geoJSON}>
				{({ geographies }) => {
					return geographies.map((geo) => <Geography
						key={geo.rsmKey}
						geography={geo}
						data-ente={geo.data}
						data-countryname={geo.properties.name}
						stroke="#555"
						style={{
							pressed: {
								outline: "none",
							},
							default: {
								fill: getColorByValue(layerInformation, geo.properties.name),
								outline: "none",
							},
							hover: {
								outline: "none",
								fill: "#888",
							},
						}}
					/>);
				}}
			</Geographies>
		</ZoomableGroup>
	</ComposableMap>;
}