const csv_parser = require("csv-parse");
const fs = require("fs");








let csv_path = "/Users/jbes/Downloads/API_SP.POP.TOTL_DS2_en_csv_v2_144171/API_SP.POP.TOTL_DS2_en_csv_v2_144171.csv";
//let csv_path = "/Users/jbes/Downloads/API_EG.ELC.ACCS.ZS_DS2_en_csv_v2_82/API_EG.ELC.ACCS.ZS_DS2_en_csv_v2_82.csv";

const out_file = "public/Population.json";
const metadata = {
    "details": "The population in each country",
    "unit": "people"
};






// cook islands gibt's nicht
// niue auch nicht
// tokelau auch nicht
// palestine auch nicht
// taiwan auch nicht
const name_map = {
    "slovak republic": "slovakia",
    "bermuda": "bermuda (uk)",
    "french polynesia": "french polynesia (france)",
    "american samoa": "american samoa (us)",
    "st. vincent and the grenadines": "saint vincent and the grenadines",
    "st. lucia": "saint lucia",
    "russian federation": "russia",
    "united states": "united states of america",
    "cabo verde": "cape verde",
    "korea, dem. people's rep.": "south korea",
    "turkiye": "turkey",
    "bahamas, the": "bahamas",
    "iran, islamic rep.": "iran",
    "st. kitts and nevis": "saint kitts and nevis",
    "korea, rep.": "north korea",
    "dominican republic": "dominican rep.",
    "egypt, arab rep.": "egypt",
    "hong kong sar, china": "hong kong",
    "venezuela, rb": "venezuela",
    "south sudan": "s. sudan",
    "kyrgyz republic": "kyrgyzstan",
    "syrian arab republic": "syria",
    "sao tome and principe": "são tomé and príncipe",
    "gambia, the": "gambia",
    "congo, rep.": "congo",
    "micronesia, fed. sts.": "federated states of micronesia",
    "central african republic": "central african rep.",
    "viet nam": "vietnam",
    "cote d'ivoire": "ivory coast",
    "equatorial guinea": "eq. guinea",
    "congo, dem. rep.": "dem. rep. congo",
    "brunei darussalam": "brunei",
    "solomon islands": "solomon is.",
    "yemen, rep.": "yemen",
    "lao pdr": "laos",
    "timor-leste": "timor leste"
}



const res = fs.readFileSync(csv_path, {encoding: 'utf-8'});
csv_parser.parse(res, {
    relaxQuotes: true,
    from_line: 5,
    columns: true
}, (err, records) => {
    if (err !== undefined) return;

    let res = {
        "__meta": metadata,
    };

    for (let i = 0; i < records.length; i++) {
        let record = {}
        const years = Object.keys(records[i]).splice(0, Object.values(records[i]).length - 5)
        let country = records[i]["Country Name"].toLowerCase()

        if (Object.keys(name_map).includes(country)) {
            country = name_map[country]
        } 
    
        years.forEach(v => {
            record[v] = Number(records[i][v])
        });
    
        res[country] = record
    }

    fs.writeFileSync(out_file, JSON.stringify(res, null, 2))
});
