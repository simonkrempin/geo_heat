export const dataFetcher = (id: string) => {
    getAllData(id, '1', null)
        .then(data => {
            console.log(data);
        });
}

const getAllData = async (id: string, page: string, fetchedData: DataInformation | null):Promise<DataInformation> => {
    const url = `https://api.worldbank.org/v2/country/all/indicator/${id}?&page=${page}&format=json`;
    return fetch(url)
        .then(response => response.json())
        .then(data => {
            if (fetchedData) {
                fetchedData.Data.concat(data[1]);
            }

            fetchedData = {
                metadata: data[0],
                Data: data[1]
            }

            if (data[0].page < data[0].pages) {
                return getAllData(id, (parseInt(page) + 1).toString(), fetchedData);
            }

            return fetchedData;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            return {
                metadata: {
                    page: '0',
                    pages: '0',
                    per_page: '0',
                    total: '0'
                },
                Data: []
            };
        });
}