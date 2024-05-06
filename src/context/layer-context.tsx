"use client";

import { useRouter } from "next/navigation";
import React, {
	createContext,
} from "react";

interface LayerContext {
	selectedLayer: string | undefined;
	setSelectedLayer: (layer: string | undefined) => void;
	allLayers: string[];
}

const LayerContextComp = createContext<LayerContext | undefined>(undefined);

interface LayerContextProviderProps {
	children: React.ReactNode;
}

export const LayerContextProvider: React.FC<LayerContextProviderProps> = ({ children }) => {
	const [selectedLayer, setSelectedLayer] = React.useState<string | undefined>(undefined);
	const router = useRouter();

	const allLayers = ["layer1", "layer2", "layer3", "layer4", "layer5"];

	const onSelectedLayerChange = (layer: string | undefined) => {
		setSelectedLayer(layer);

		if (layer === undefined) {
			router.push(`/`);
			return;
		}

		router.push(`?layer=${layer}`);
	};

	return (
		<LayerContextComp.Provider
			value={{
				selectedLayer,
				setSelectedLayer: onSelectedLayerChange,
				allLayers,
			}}
		>
			{children}
		</LayerContextComp.Provider>
	);
};

export const useLayerContext = () => {
	const context = React.useContext(LayerContextComp);

	if (!context) {
		throw new Error("useLayerContext must be used within a LayerContextProvider");
	}

	return context;
};