export const indicatorFetcher = async (): Promise<Indicators | null> => {
    return await fetch(`https://api.worldbank.org/v2/indicator?format=json`)
        .then(response => response.json())
        .then((data) =>
            ({
                MetaData: data[0],
                IndicatorInformation: data[1]
            }))
        .catch(error => {
            console.error('Error:', error);
            return null;
        });
}