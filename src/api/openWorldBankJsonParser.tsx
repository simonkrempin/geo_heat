import tinygradient from "tinygradient";

export const openWorldBankJsonParser = (dataInformation: DataInformation, indicatorInformation: IndicatorInformation): TimeLayerInformation => {
    let values: Record<string, Record<string, number>> = {};
    let maxValue: number = 0;
    let minValue: number = Number.MAX_VALUE;
    let colorGradient = tinygradient(['rgb(255, 255, 255)', 'rgb(255, 155, 0)']);
    let metadata: TimeLayerMetadata = {
        unit: "€",
        details: indicatorInformation.name,
        timeMin: Number.MAX_VALUE,
        timeMax: 0,
        lowerQuantile: 1,
        upperQuantile: 0,
        timeData: true,
        downloadUrl: `https://api.worldbank.org/v2/country/all/indicator/${indicatorInformation.id}`,
        colors: {
            '0': "rgb(255, 255, 255)",
            '1': "rgb(255, 155, 0)"
        }
    };

    dataInformation.Data.forEach((countryData: CountryData) => {
        if (countryData) {
            if (!values[countryData.country.value]) {
                values[countryData.country.value] = {};
            }

            values[countryData.country.value][countryData.date] = countryData.value;

            if (countryData.value > maxValue) {
                maxValue = countryData.value;
            }

            if (countryData.value < minValue) {
                minValue = countryData.value;
            }

            if (metadata.timeMin > parseInt(countryData.date)) {
                metadata.timeMin = parseInt(countryData.date);
            }

            if (metadata.timeMax < parseInt(countryData.date)) {
                metadata.timeMax = parseInt(countryData.date);
            }
        }
    });

    const allValues = [];

    for (const country in values) {
        for (const date in values[country]) {
            allValues.push(values[country][date]);
        }
    }

    allValues.sort((a, b) => a - b);

    const percent = 0.02;
    const lowerQuantileCalc = Math.round(allValues.length * percent);
    const upperQuantileCalc = Math.round(allValues.length * (1 - percent));
    metadata.lowerQuantile = allValues[lowerQuantileCalc] == null ? 0 : allValues[lowerQuantileCalc];
    metadata.upperQuantile = allValues[upperQuantileCalc] == null ? 0 : allValues[upperQuantileCalc];

    return {
        values: values,
        metadata: metadata,
        maxValue: maxValue,
        minValue: minValue,
        colorGradient: colorGradient
    };
}