interface Position {
	coordinates: [number, number]
	zoom: number;
}

interface LayerMetadata {
	unit: string;
	details: string;
}

interface TimeLayerMetadata extends LayerMetadata {
	timeData: true;
	timeMin: number;
	timeMax: number;
}

interface LayerInformation {
	values: Record<string, number>;
	metadata: LayerMetadata,
	maxValue: number;
	minValue: number;
}

interface TimeLayerInformation {
	values: Record<string, Record<string, number>>;
	metadata: TimeLayerMetadata;
	maxValue: number;
	minValue: number;
}
