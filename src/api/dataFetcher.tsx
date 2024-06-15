export const dataFetcher = async (id: string) => {
    return await getAllData(id, '1', null);
}

const getAllData = async (id: string, page: string, fetchedData: DataInformation | null): Promise<DataInformation> => {
    const url = `https://api.worldbank.org/v2/country/all/indicator/${id}?&page=${page}&format=json`;
    return fetch(url)
        .then(response => response.json())
        .then(data => {
            let newData: DataInformation = {
                metadata: data[0],
                Data: data[1]
            };

            if (fetchedData) {
                newData.Data = [...fetchedData.Data, ...data[1]];
            }

            if (data[0].page < data[0].pages) {
                return getAllData(id, (parseInt(page) + 1).toString(), newData);
            }

            return newData;
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