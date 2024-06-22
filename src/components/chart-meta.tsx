import styles from "@/components/layer-selection.module.css";
import { useLayerContext } from "@/context/layer-context";
import React from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
);

export default function ChartMeta() {
    const [visibility, setVisibility] = React.useState(true);
    const { clickedCountry, setClickedCountry, layerInformation } = useLayerContext();

    if (!clickedCountry) {
        return null;
    }

    if (!layerInformation || !layerInformation.metadata.timeData) {
        return null;
    }

    if (!layerInformation.values[clickedCountry]) {
        return null;
    }

    const calculateStats = () => {
        const values = Object.entries(layerInformation?.values[clickedCountry] || {})
            .filter(([year, value]) => value !== 0)
            .map(([year, value]) => {
                return { year, value };
            });

        const min = Math.min(...values.map(obj => obj.value));
        const minYear = values.find(obj => obj.value === min);

        const max = Math.max(...values.map(obj => obj.value));
        const maxYear = values.find(obj => obj.value === max);

        const average = values.reduce((sum, { value }) => sum + value, 0) / values.length;
        const biggestDifference = Math.max(...values.map(value => Math.abs(value.value - min)));
        const differenceLastFirst = values[values.length - 1].value - values[0].value;
        const span = values[0].year + " - " + values[values.length - 1].year;
        return { minYear, maxYear, average, biggestDifference, differenceLastFirst, span };
    };

    const { minYear, maxYear, average, biggestDifference, differenceLastFirst, span } = calculateStats();

    return <div
      style={{
        display: !visibility ? "none" : "",
        marginLeft: "10px"
      }}
    >
        <div
            style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                backgroundColor: "white",
                borderRadius: "16px",
                //top right bottom left
				padding: "100px 80px 100px 80px"
            }}
        >
            <div>
                <p
                    style={{
                        color: "black",
                        fontSize: "24px",
                    }}
                >statistics</p>
                <button
                    onClick={() => setVisibility(false)}
                    style={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        color: "white",
                        borderRadius: "16px",
                        cursor: "pointer",
                        border: "none",
                        backgroundColor: "transparent",
                    }}
                >
                    <img
                        className={styles.selection__search_bar__xmark}
                        src="svg/xmark.svg"
                        alt="X mark"
                    />
                </button>
            </div>
            <div
                style={{ color: "black" }}
            >
                <table><thead>
                    <tr>
                        <th></th>
                        <th>Year</th>
                        <th>Value</th>
                    </tr></thead>
                    <tbody>
                        <tr>
                            <td>Max</td>
                            <td>{maxYear?.year}</td>
                            <td>{maxYear?.value.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>Min</td>
                            <td>{minYear?.year}</td>
                            <td>{minYear?.value.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>Average</td>
                            <td></td>
                            <td>{average.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>Difference between last and first value</td>
                            <td>{span}</td>
                            <td>{biggestDifference.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>Biggest difference</td>
                            <td></td>
                            <td>{differenceLastFirst.toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>;
}
