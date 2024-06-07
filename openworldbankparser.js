const csv_parser = require("csv-parse");
const fs = require("fs");

const arguments= {
    "--out": undefined,
    "--csv": undefined,
    "--unit": undefined,
    "-d": undefined,
};

const argsThroughCmd = process.argv.slice(2);

argsThroughCmd.forEach(arg => {
    const argSplit = arg.split("=");
    arguments[argSplit[0]] = argSplit[1];
});

console.log(arguments);

if (arguments["--csv"] === undefined) {
    console.log("Please specify a csv file to parse using --csv=<path>");
    process.exit(1);
}

if (arguments["--out"] === undefined) {
    console.log("Please specify the name of the output file using --out=<filename>");
    process.exit(1);
}

if (arguments["--unit"] === undefined) {
    console.log("Please specify an unit using --unit=<unit>");
    process.exit(1);
}

if (arguments["-d"] === undefined) {
    console.log("Please specify description using -d=<description>");
    process.exit(1);
}

const outFile = `public/${arguments["--out"]}.json`;
const metadata = {
    "details": arguments["-d"],
    "unit": arguments["--unit"],
};

// cook islands gibt's nicht
// niue auch nicht
// tokelau auch nicht
// palestine auch nicht
// taiwan auch nicht
const renamingMap = {
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

const res = fs.readFileSync(arguments["--csv"], {encoding: 'utf-8'});
csv_parser.parse(res, {
    relaxQuotes: true,
    from_line: 5,
    columns: true
}, (err, records) => {
    if (err !== undefined) {
        return;
    }

    const res = {
        "__meta": metadata,
    };

    for (let i = 0; i < records.length; i++) {
        const record = {};
        const years = Object.keys(records[i]).splice(0, Object.values(records[i]).length - 5);
        let country = records[i]["Country Name"].toLowerCase();

        if (!!renamingMap[country]) {
            country = renamingMap[country];
        }

        years.forEach(v => {
            record[v] = Number(records[i][v]);
        });

        res[country] = record;
    }

    fs.writeFileSync(outFile, JSON.stringify(res, null, 2))
});
