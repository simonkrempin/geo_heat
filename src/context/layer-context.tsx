"use client";

import {
	useRouter,
	useSearchParams,
} from "next/navigation";
import React, {
	createContext,
	useEffect,
	useState,
} from "react";

interface LayerContext {
	selectedLayer: string | null;
	setSelectedLayer: (layer: string | null) => void;
	allLayers: string[];
	layerInformation?: LayerInformation | TimeLayerInformation;
	selectedYear?: number;
	setSelectedYear: (year: number | undefined) => void;
	getCountryValue: (country: string, year?: number) => number | undefined;
}

const LayerContextComp = createContext<LayerContext | undefined>(undefined);

interface LayerContextProviderProps {
	children: React.ReactNode;
}

export const LayerContextProvider: React.FC<LayerContextProviderProps> = ({ children }) => {
	const searchParams = useSearchParams();
	const initialValue = searchParams.get("layer");

	const [selectedLayer, setSelectedLayer] = React.useState<string | null>(initialValue);
	const [selectedYear, setSelectedYear] = React.useState<number | undefined>(undefined);
	const [layerInformation, setLayerInformation] = useState<LayerInformation | TimeLayerInformation | undefined>(undefined);

	const router = useRouter();

	const allLayers = [
		"Average Height",
		"Consumption of beer per capita",
		"Access To Electricity",
		"Forest Area",
		"GDP Growth",
		"GDP Per Capita",
		"Population",
	];

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

			// so only the values are in the object
			delete data["__meta"];

			setLayerInformation({
				values: data,
				metadata: metadata,
				maxValue: getBound(Math.max, data, metadata.timeData),
				minValue: getBound(Math.min, data, metadata.timeData),
			});
			setSelectedYear(metadata.timeMax);
		})();
	}, [selectedLayer]);

	const getCountryValue = React.useCallback((country: string): number | undefined => {
		if (!layerInformation) {
			return undefined;
		}

		if (selectedYear === undefined) {
			return Number((layerInformation as LayerInformation).values[country.toLowerCase()]?.toFixed(2));
		}

		return Number((layerInformation as TimeLayerInformation).values[country.toLowerCase()]?.[selectedYear]?.toFixed(2));
	}, [layerInformation, selectedYear]);

	return (
		<LayerContextComp.Provider
			value={{
				selectedLayer,
				setSelectedLayer: onSelectedLayerChange,
				allLayers,
				layerInformation,
				selectedYear,
				setSelectedYear,
				getCountryValue,
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

function getBound(calculatorFunction: (...values: number[]) => number, data: Record<string, number> | Record<string, Record<string, number>>, isTimeData: boolean): number {
	if (!isTimeData) {
		return calculatorFunction(...Object.values(data) as number[]);
	}

	return calculatorFunction(...Object.values(data).flatMap(x => Object.values(x)) as number[]);
}
