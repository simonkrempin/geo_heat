"use client";

import {getGradientFromMetadata} from "@/utils/color-by-value";
import {useRouter, useSearchParams,} from "next/navigation";
import React, {createContext, useEffect, useState,} from "react";
import {indicatorFetcher} from "@/api/indicatorFetcher";
import {dataFetcher} from "@/api/dataFetcher";
import {SearchClient} from "algoliasearch";

interface LayerContext {
    searchClient: SearchClient,
    selectedLayer: string | null;
    setSelectedLayer: (layer: string | null) => void;
    allLayers: string[];
    layerInformation?: LayerInformation | TimeLayerInformation;
    selectedYear?: number;
    setSelectedYear: (year: number | undefined) => void;
    getCountryValue: (country: string, year?: number) => number | undefined;
    displayCountryValue: (country: string) => string;
    clickedCountry?: string;
    setClickedCountry: (country: string | undefined) => void;
}

const LayerContextComp = createContext<LayerContext | undefined>(undefined);

interface LayerContextProviderProps {
    searchClient: SearchClient;
    children: React.ReactNode;
}

export const LayerContextProvider: React.FC<LayerContextProviderProps> = ({searchClient, children}) => {
        const searchParams = useSearchParams();
        const initialValue = searchParams.get("layer");

        const [selectedLayer, setSelectedLayer] = React.useState<string | null>(null);
        const [selectedYear, setSelectedYear] = React.useState<number | undefined>(undefined);
        const [layerInformation, setLayerInformation] = useState<LayerInformation | TimeLayerInformation | undefined>(undefined);
        const [clickedCountry, setClickedCountry] = useState<string | undefined>(undefined);

        const router = useRouter();
        const [allIndicators, setIndicators] = useState<IndicatorInformation[]>([]);

        useEffect(() => {
            indicatorFetcher().then((data) => {
                if (data) {
                    console.log(data?.IndicatorInformation);
                    setIndicators(data?.IndicatorInformation);
                }

                if (initialValue) {
                    onSelectedLayerChange(initialValue);
                }
            });
        }, []);

        const allLayers = allIndicators.map((indicator) => indicator.name);

        const onSelectedLayerChange = (layer: string | null) => {
            setSelectedLayer(layer);

            if (!layer) {
                router.push(`/`);
                return;
            }

            router.push(`?layer=${layer}`);
        };

        useEffect(() => {
            setLayer();
        }, [selectedLayer]);

        const setLayer = async () => {
            if (selectedLayer === null) {
                setLayerInformation(undefined);
                return;
            }

            const selectedIndicator = allIndicators.find((indicator) => indicator.name === selectedLayer) ?? null;
            if (selectedIndicator === null) {
                setLayerInformation(undefined);
                return;
            }

            await dataFetcher(selectedIndicator).then(((data) => {
                setLayerInformation({
                    values: data.values,
                    metadata: data.metadata,
                    maxValue: getBound(Math.max, data.values, data.metadata.timeData),
                    minValue: getBound(Math.min, data.values, data.metadata.timeData),
                    colorGradient: getGradientFromMetadata(data.metadata),
                });
                setSelectedYear(data.metadata.timeMax);
            }));
        }

        const getCountryValue = React.useCallback((country: string): number | undefined => {
            if (!layerInformation) {
                return undefined;
            }

            const countryValue = layerInformation.values[country.toLowerCase()];

            if (!countryValue) {
                return undefined;
            }

            return selectedYear === undefined
                ? countryValue as number
                : (countryValue as Record<string, number>)[selectedYear];
        }, [layerInformation, selectedYear]);

        const displayCountryValue = React.useCallback((country: string): string => {
            const value = getCountryValue(country);

            if (value === null || value === undefined || !layerInformation) {
                return "No data";
            }

            return Number(value.toFixed(2).replace(/[.,]00$/, "")).toLocaleString() + " " + layerInformation.metadata.unit;
        }, [layerInformation, getCountryValue]);

        return (
            <LayerContextComp.Provider
                value={{
                    searchClient,
                    selectedLayer,
                    setSelectedLayer: onSelectedLayerChange,
                    allLayers,
                    layerInformation,
                    selectedYear,
                    setSelectedYear,
                    getCountryValue,
                    displayCountryValue,
                    clickedCountry,
                    setClickedCountry: (value: string | undefined) => setClickedCountry(value),
                }}
            >
                {children}
            </LayerContextComp.Provider>
        );
    }
;

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
