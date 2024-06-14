# GeoHeat
This is a university project to illustrate various geographical information of the world.

![image](https://github.com/simonkrempin/geo_heat/assets/64578396/d81595bd-a9b3-4439-8357-f169bd447854)

## How to use GeoHeat
Visit the website [GeoHeat](https://geo-heat.vercel.app/)

Search for the information you need. Then GeoHeat will show you the information in a map.

## Datasources
- Average Height: Wikipedia
- Beer Consumption per Capita: [Statista](https://www.statista.com/statistics/444589/european-beer-consumption-per-capita-by-country/)
- ?: https://data.worldbank.org/indicator
- Weather: https://en.wikipedia.org/wiki/List_of_countries_by_average_yearly_temperature

## How to use the World Bank parser
```
Usage: node openworldbankparser.js [OPTIONS]

A small downloader and parser for worldbank.org. Downloaded files will be placed in ./public/

Options:
  --out         The name of the output json file without file ending (required)
  --url         The csv download url from https://data.worldbank.org/indicator (required)
  --unit        The unit of the dataset (required)
  -d            A short description of the dataset (required)
  --update      The name of the json file that should be updated without file ending (must not be combined with other options)
```

Examples:
```
node openworldbankparser.js --out="GDP Growth" --url="https://api.worldbank.org/v2/en/indicator/NY.GDP.MKTP.KD.ZG?downloadformat=csv" --unit="%/year" -d="GDP growth per year in percent"
```
```
node openworldbankparser.js --update="GDP Growth"
```
