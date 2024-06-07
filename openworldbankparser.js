const csv_parser = require("csv-parse");
const fs = require("fs");
const extract_zip = require("extract-zip");
const https = require("https");


const arguments= {
    "--out": undefined,
    "--url": undefined,
    "--unit": undefined,
    "-d": undefined,
};


// const csv_download_url = "https://api.worldbank.org/v2/en/indicator/NY.GDP.PCAP.CD?downloadformat=csv"
// const out_file = "public/GDP Per Capita.json";

const argsThroughCmd = process.argv.slice(2);

argsThroughCmd.forEach(arg => {
    const argSplit = arg.split("=");
    arguments[argSplit[0]] = argSplit[1];
});

console.log(arguments);

if (arguments["--url"] === undefined) {
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
        console.log("Successfully parsed " + __dirname + "/" + directory_name + "/" + data_file_name + " into " + out_file);

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
}





//let csv_path = "/Users/jbes/Downloads/API_SP.POP.TOTL_DS2_en_csv_v2_144171/API_SP.POP.TOTL_DS2_en_csv_v2_144171.csv";
//let csv_path = "/Users/jbes/Downloads/API_EG.ELC.ACCS.ZS_DS2_en_csv_v2_82/API_EG.ELC.ACCS.ZS_DS2_en_csv_v2_82.csv";

function _parse_csv(csv_path) {
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
}
