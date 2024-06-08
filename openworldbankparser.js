const csv_parser = require("csv-parse");
const fs = require("fs");
const extract_zip = require("extract-zip");
const https = require("https");
const { exit } = require("process");


const arguments= {
    "--out": undefined,
    "--url": undefined,
    "--unit": undefined,
    "--update": undefined,
    "-d": undefined,
    "--help": undefined,
};

const argsThroughCmd = process.argv.slice(2);

argsThroughCmd.forEach(arg => {
    if (arg === "--help") {
        arguments["--help"] = true;
        return;
    }

    const argSplit = [
        arg.substring(0, arg.indexOf('=')),
        arg.substring(arg.indexOf('=') + 1),
    ]
    arguments[argSplit[0]] = argSplit[1];
});

if (argsThroughCmd.length === 0 || arguments["--help"]) {
    console.log("A small downloader and parser for worldbank.org. Downloaded files will be placed in ./public/");
    console.log("");
    console.log("Usage: node openworldbankparser.js [OPTIONS]");
    console.log("");
    console.log("Options:");
    console.log("--out         The name of the output json file without file ending (required)");
    console.log("--url         The csv download url from https://data.worldbank.org/indicator (required)");
    console.log("--unit        The unit of the dataset (required)");
    console.log("-d            A short description of the dataset (required)");
    process.exit(1);
}

if (arguments["--update"] === undefined) {
    if (arguments["--url"] === undefined) {
        console.log("Please specify a url using --url=<path>");
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
} else {
    const raw_dataset = fs.readFileSync(`public/${arguments["--update"]}.json`);
    const dataset = JSON.parse(raw_dataset);

    arguments["--out"] = arguments["--update"];
    arguments["--url"] = dataset["__meta"]["downloadUrl"];
    arguments["--unit"] = dataset["__meta"]["unit"];
    arguments["-d"] = dataset["__meta"]["details"];
}


const outFile = `public/${arguments["--out"]}.json`;
const metadata = {
    "details": arguments["-d"],
    "unit": arguments["--unit"],
    "timeData": true,
    "downloadUrl": arguments["--url"]
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

const removalList = [
    "world",
    "ida & ibrd total",
    "low & middle income",
    "middle income",
    "ibrd only",
    "early-demographic dividend",
    "lower middle income",
    "upper middle income",
    "east asia & pacific",
    "late-demographic dividend",
    "east asia & pacific (excluding high income)",
    "east asia & pacific (ida & ibrd countries)",
    "south asia",
    "south asia (ida & ibrd)",
    "ida total",
    "oecd members",
    "high income",
    "ida only",
    "sub-saharan africa",
    "sub-saharan africa (ida & ibrd countries)",
    "sub-saharan africa (excluding high income)",
    "least developed countries: un classification",
    "post-demographic dividend",
    "pre-demographic dividend",
    "fragile and conflict affected situations",
    "europe & central asia",
    "heavily indebted poor countries (hipc)",
    "africa eastern and southern",
    "low income",
    "latin america & caribbean",
    "latin america & the caribbean (ida & ibrd countries)",
    "ida blend",
    "latin america & caribbean (excluding high income)",
    "middle east & north africa",
    "africa western and central",
    "arab world",
    "europe & central asia (ida & ibrd countries)",
    "european union",
    "middle east & north africa (excluding high income)",
    "middle east & north africa (ida & ibrd countries)",
    "europe & central asia (excluding high income)",
    "euro area",
    "central europe and the baltics",
    "small states",
    "other small states",
    "caribbean small states",
    "west bank and gaza",
    "pacific island small states"
];

const downloaded_zip = fs.createWriteStream(__dirname + "/tmp_" + Date.now().toString() + ".zip");
https.get(arguments["--url"], (response) => {
    response.pipe(downloaded_zip);

    downloaded_zip.on("finish", async () => {
        downloaded_zip.close();
        console.log("Successfully downloaded " + arguments["--url"] + " to " + downloaded_zip.path);

        const directory_name = Date.now().toString()
        await extract_zip(downloaded_zip.path, {dir: __dirname + "/" + directory_name});
        console.log("Successfully extracted " + downloaded_zip.path + " to " + directory_name);

        const extracted_files = fs.readdirSync(__dirname + "/" + directory_name);
        const data_file_name = extracted_files.filter(file => file.startsWith('API_'))[0];

        console.log("Removing " + downloaded_zip.path + "...");
        fs.unlinkSync(downloaded_zip.path);

        parse_csv(__dirname + "/" + directory_name + "/" + data_file_name);
        console.log("Successfully parsed " + __dirname + "/" + directory_name + "/" + data_file_name + " into " + outFile);

        console.log("Removing directory " + __dirname + "/" + directory_name + "...");
        fs.rmSync(__dirname + "/" + directory_name, { recursive: true, force: true });
    })
}).on("error", (e) => {
    console.log(e)
});



function parse_csv(csv_path) {
    const res = fs.readFileSync(csv_path, {encoding: 'utf-8'});
    csv_parser.parse(res, {
        relaxQuotes: true,
        from_line: 5,
        columns: true
    }, (err, records) => {
        if (err !== undefined) {
            return;
        }

        let firstYear = 2024;
        let lastYear = 0;

        const res = {
            "__meta": metadata,
        };

        for (let i = 0; i < records.length; i++) {
            const record = {};
            const years = Object.keys(records[i]).splice(0, Object.values(records[i]).length - 5);
            let country = records[i]["Country Name"].toLowerCase();

            if (removalList.includes(country)) continue;

            if (!!renamingMap[country]) {
                country = renamingMap[country];
            }

            years.forEach(year => {
                const valueForYear = Number(records[i][year]);

                if (valueForYear !== 0) {
                    if (Number(year) < firstYear) {
                        firstYear = Number(year);
                    } else if (Number(year) > lastYear) {
                        lastYear = Number(year);
                    }
                }

                record[year] = Number(records[i][year]);
            });

            res[country] = record;
        }

        res["__meta"]["timeMin"] = firstYear;
        res["__meta"]["timeMax"] = lastYear;

        fs.writeFileSync(outFile, JSON.stringify(res, null, 2))
    });
}
