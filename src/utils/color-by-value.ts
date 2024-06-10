import tinygradient from "tinygradient";

const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max)

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

	const lowerQuantile = layerInformation.metadata.lowerQuantile;
	const upperQuantile = layerInformation.metadata.upperQuantile;

	let lowerBound = value - lowerQuantile;
	let upperBound = upperQuantile - lowerQuantile;

	// when lowerBound is below 0, the percentage goes negative,
	// which doesn't work with .rgbAt()
	if (lowerBound < 0) {
		lowerBound += Math.abs(lowerBound);
		upperBound += Math.abs(lowerBound);
	}

	let percentage = (lowerBound === 0 ? 1 : lowerBound) / (upperBound === 0 ? 1 : upperBound);
	percentage = clamp(percentage, 0, 1);

	return layerInformation.colorGradient.rgbAt(percentage) as any;
};
