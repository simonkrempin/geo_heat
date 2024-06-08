export const getColorByValue = (
	layerInformation: LayerInformation | TimeLayerInformation | undefined,
	value: number | undefined
): string => {
	if (!value || !layerInformation) {
		return "#fff";
	}

	const lowerBound = value - layerInformation.minValue;
	const upperBound = layerInformation.maxValue - layerInformation.minValue;

	const percentage = (lowerBound === 0 ? 1 : lowerBound) / (upperBound === 0 ? 1 : upperBound);

	return `rgb(255, ${255 - percentage * 100}, ${255 - percentage * 255})`;
};
