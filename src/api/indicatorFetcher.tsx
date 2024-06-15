export const indicatorFetcher = async (): Promise<Indicator | null> => {
    const searchQuery = encodeURIComponent('wind energy');
    console.log(searchQuery);
    return await fetch(`https://api.worldbank.org/v2/indicator?format=json`)
        .then(response => response.json())
        .then((data) => ({
            MetaData: data[0],
            Data: data[1]
        }))
        .catch(error => {
            console.error('Error:', error);
            return null;
        });
}