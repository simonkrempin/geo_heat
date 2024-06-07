interface Position {
	coordinates: [number, number]
	zoom: number;
}

interface LayerMetadata {
	unit: string;
	details: string;
	timeData?: boolean;
	timeMin?: number;
	timeMax?: number;
}

interface LayerInformation {
	values: Record<string, number>;
	metadata: LayerMetadata,
	maxValue: number;
	minValue: number;
}
