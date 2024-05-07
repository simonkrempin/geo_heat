interface Position {
	coordinates: [number, number]
	zoom: number;
}

interface LayerMetadata {
	unit: string;
	details: string;
}

interface LayerInformation {
	values: Record<string, number>;
	metadata: LayerMetadata,
	maxValue: number;
	minValue: number;
}