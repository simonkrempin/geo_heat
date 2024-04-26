import React, {
	createContext,
} from "react";

interface LayerContext {
	selectedLayer: string | undefined;
	setSelectedLayer: React.Dispatch<React.SetStateAction<string | undefined>>;
	allLayers: string[];
}

const LayerContextComp = createContext<LayerContext | undefined>(undefined);

interface LayerContextProviderProps {
	children: React.ReactNode;
}

export const LayerContextProvider: React.FC<LayerContextProviderProps> = ({ children }) => {
	const [selectedLayer, setSelectedLayer] = React.useState<string | undefined>(undefined);

	const allLayers = ["layer1", "layer2", "layer3", "layer4", "layer5"];

	return (
		<LayerContextComp.Provider
			value={{
				selectedLayer,
				setSelectedLayer,
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