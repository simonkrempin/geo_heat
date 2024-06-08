import tinygradient from "tinygradient";

// this can absolutely be optimized by only calling this function once when loading the layer
// but i don't know how to do that :(
export const getGradientFromMetadata = (metadata: LayerMetadata) => {
	if (metadata.colors === undefined) {
		return tinygradient("#ffc8a1", "#ff7300");
	}

	const positions = Object.keys(metadata.colors);

	positions.sort((a, b) => Number(a) - Number(b));

	return tinygradient(positions.map(position => ({
		color: metadata.colors[position],
		pos: Number(position)
	})));
}

export const getColorByValue = (
	layerInformation: LayerInformation | TimeLayerInformation | undefined,
	value: number | undefined
): string => {
	if (value === undefined || !layerInformation) {
		return "#fff";
	}

	let lowerBound = value - layerInformation.minValue;
	let upperBound = layerInformation.maxValue - layerInformation.minValue;

	// when lowerBound is below 0, the percentage goes negative,
	// which doesn't work with .rgbAt()
	if (lowerBound < 0) {
		lowerBound += Math.abs(lowerBound);
		upperBound += Math.abs(lowerBound);
	}

	const percentage = (lowerBound === 0 ? 1 : lowerBound) / (upperBound === 0 ? 1 : upperBound);

	return layerInformation.colorGradient.rgbAt(percentage) as any;
};
