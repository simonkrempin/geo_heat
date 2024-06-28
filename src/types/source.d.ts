interface Indicators {
    MetaData: MetaData;
    IndicatorInformation: IndicatorInformation[];
}

interface MetaData {
    page: string;
    pages: string;
    per_page: string;
    total: string;
}

interface IndicatorInformation {
    id: string;
    name: string;
    source: Source;
    sourceNote: string;
    sourceOrganization: string;
    topics: Topic[];
    unit: string;
}

interface Source {
    id: string;
    value: string;
}

interface DataInformation {
    metadata: MetaData;
    Data: CountryData[];
}

interface CountryData {
    country: Country;
    date: string;
    value: number;
}

interface Country {
    id: string;
    value: string;
}

interface Indicator {
    id: string;
    title: string;
}
