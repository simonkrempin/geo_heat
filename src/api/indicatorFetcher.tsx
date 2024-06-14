export const indicatorFetcher = async (): Promise<Indicator | null> => {
    const searchQuery = encodeURIComponent('wind energy');
    console.log(searchQuery);
    return await fetch(`https://api.worldbank.org/v2/indicator?format=json`)
        .then(response => response.json())
        .then((data) => {
            console.log(data);
            const dataSource: Indicator = {
                MetaData: data[0],
                Data: data[1]
            }

            return dataSource;
        })
        .catch(error => {
            console.error('Error:', error);
            return null;
        });
}