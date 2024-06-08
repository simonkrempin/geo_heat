const tinygradient = require("tinygradient");

// this can absolutely be optimized by only calling this function once when loading the layer
// but i don't know how to do that :(
function getGradientFromMetadata(metadata: LayerMetadata) {
	const positions = Object.keys(metadata.colors);
	positions.sort((a, b) => Number(a) - Number(b));
	const colors: {color: string, pos: number}[] = [];
	positions.forEach((position: string) => {
		colors.push({
			color: metadata.colors[position],
			pos: Number(position)
		});
	})
	return tinygradient(colors);
}

export const getColorByValue = (
	layerInformation: LayerInformation | TimeLayerInformation | undefined,
	value: number | undefined
): string => {
	if (!value || !layerInformation) {
		return "#fff";
	}
	const gradient = getGradientFromMetadata(layerInformation.metadata);

	let lowerBound = value - layerInformation.minValue;
	let upperBound = layerInformation.maxValue - layerInformation.minValue;

	// when lowerBound is below 0, the percentage goes negative,
	// which doesn't work with .rgbAt()
	if (lowerBound < 0) {
		lowerBound += Math.abs(lowerBound);
		upperBound += Math.abs(lowerBound);
	}

	const percentage = (lowerBound === 0 ? 1 : lowerBound) / (upperBound === 0 ? 1 : upperBound);

	return gradient.rgbAt(percentage);
};
