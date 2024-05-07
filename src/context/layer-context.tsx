"use client";

import { useRouter } from "next/navigation";
import React, {
	createContext,
	useEffect,
	useState,
} from "react";

interface LayerContext {
	selectedLayer: string | null;
	setSelectedLayer: (layer: string | null) => void;
	allLayers: string[];
	layerInformation?: LayerInformation;
}

const LayerContextComp = createContext<LayerContext | undefined>(undefined);

interface LayerContextProviderProps {
	initialValue: string | null;
	children: React.ReactNode;
}

export const LayerContextProvider: React.FC<LayerContextProviderProps> = ({ children , initialValue}) => {
	const [selectedLayer, setSelectedLayer] = React.useState<string | null>(initialValue);
	const [layerInformation, setLayerInformation] = useState<LayerInformation | undefined>(undefined);

	const router = useRouter();

	const allLayers = ["Average Height", "layer1"];

	const onSelectedLayerChange = (layer: string | null) => {
		setSelectedLayer(layer);

		if (!layer) {
			router.push(`/`);
			return;
		}

		router.push(`?layer=${layer}`);
	};

	useEffect(() => {
		(async () => {
			if (selectedLayer === null) {
				setLayerInformation(undefined);
				return;
			}

			const response = await fetch(`/${selectedLayer}.json`, {
				cache: "force-cache",
			});

			if (!response.ok) {
				setLayerInformation(undefined);
			}

			const data = await response.json();

			const metadata = data["__meta"];

			delete data["__meta"];

			setLayerInformation({
				values: data,
				metadata: metadata,
				maxValue: Math.max(...Object.values(data) as number[]),
				minValue: Math.min(...Object.values(data) as number[]),
			});
		})();
	}, [selectedLayer]);

	return (
		<LayerContextComp.Provider
			value={{
				selectedLayer,
				setSelectedLayer: onSelectedLayerChange,
				allLayers,
				layerInformation,
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