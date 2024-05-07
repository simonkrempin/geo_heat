export const getColorByValue = (layerInformation?: LayerInformation, countryName?: string): string => {
	if (!layerInformation || !countryName) {
		return "#fff";
	}

	const value = layerInformation.values[countryName.toLowerCase()];

	if (!value) {
		return "#fff";
	}

	const lowerBound = value - layerInformation.minValue;
	const upperBound = layerInformation.maxValue - layerInformation.minValue;
	
	const percentage = (lowerBound === 0 ? 1 : lowerBound) / (upperBound === 0 ? 1 : upperBound);

	return `rgba(0,89,255,${percentage})`;
}