interface Position {
	coordinates: [number, number]
	zoom: number;
}

interface LayerMetadata {
	unit: string;
	details: string;
	timeMin: number;
	timeMax: number;
	lowerQuantile: number;
	upperQuantile: number;
	timeData: boolean;
	downloadUrl: string;
	colors: {[position: string]: string};
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
	colorGradient: tinygradient.Instance;
}

interface TimeLayerInformation {
	values: Record<string, Record<string, number>>;
	metadata: TimeLayerMetadata;
	maxValue: number;
	minValue: number;
	colorGradient: tinygradient.Instance;
}
