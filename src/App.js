import React, { useEffect, useState } from "react";
import './App.css';
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import { prettyPrintStat, sortData } from "./util";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";

function App() {
  // STATE = How to write a variable in REACT  (Didn't understand and need to check it)
  const [countries, setCountries] = useState([])
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases")

  // USEEFFECT = Runs a peice of code based on a given condition

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then(data => {
      setCountryInfo(data);
    });
  }, []);

  useEffect(() => {
    // The code inside here will run once when the component loads and not again
    // async -> send a request, wait for it, do something with the info
    const getCountriesData = async () => {
      // What's the difference between fetch and axios
      // Only need to fetch the data
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => ({
          name: country.country,  // United States, United Kingdom
          value: country.countryInfo.iso2,  // UK, USA, FR
        }));

        const sortedData = sortData(data);
        setTableData(sortedData);
        setMapCountries(data);
        setCountries(countries);
      });
    }

    getCountriesData();
  }, []);

  // const onCountryChange = async (event) => {
  //   const countryCode = event.target.value;

  //   // setCountry(countryCode);

  //   // worldwide: https://disease.sh/v3/covid-19/all
  //   // for individual country: https://disease.sh/v3/covid-19/countries/[COUNTRY_CODE]

  //   const url = 
  //   countryCode === "worldwide" ? 
  //   "https://disease.sh/v3/covid-19/all" : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

  //   await fetch(url)
  //   .then(response => response.json())
  //   .then(data => {
  //     setCountry(countryCode);

  //     // All the data from the country response
  //     setCountryInfo(data); 

  //     setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
  //     setMapZoom(4);
  //   });
  // };

  // console.log("COUNTRY INFO >>>", countryInfo);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);

        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
  };

  return (
    <div className="App">
      {/* All the components. React is component-based */}
      <div className="app__left">
        {/* Header */}
        {/* Title + Select input dropdown field */}
        <div className="app__header">
          <h1>COVID-19 Tracker</h1>
          <FormControl className="app__dropdown">
          <Select variant="outlined" value={country} onChange={onCountryChange} >
            <MenuItem value="worldwide">WorldWide</MenuItem>

            {/* Loop through all the countries and show a drop down lost of the options */}
            {
              countries.map(country => {
                return <MenuItem value={country.value}>{country.name}</MenuItem>
              })
            }

            {/* <MenuItem value="worldwide">Worldwide</MenuItem>
            <MenuItem value="worldwide">Option 2</MenuItem>
            <MenuItem value="worldwide">Option 3</MenuItem>
            <MenuItem value="worldwide">Y000000</MenuItem> */}
          </Select>
          </FormControl>
        </div>
        
        <div className="app__stats">
            <InfoBox 
              isRed
              active={casesType === "cases"}
              onClick={e => setCasesType('cases')}
              title="Coronavirus Cases" 
              cases={prettyPrintStat(countryInfo.todayCases)} 
              total={prettyPrintStat(countryInfo.cases)} 
            />
            <InfoBox 
              active={casesType === "recovered"}
              onClick={e => setCasesType('recovered')}
              title="Recovered" 
              cases={prettyPrintStat(countryInfo.todayRecovered)} 
              total={prettyPrintStat(countryInfo.recovered)} 
            />
            <InfoBox 
              isRed
              active={casesType === "deaths"}
              onClick={e => setCasesType('deaths')}
              title="Deaths" 
              cases={prettyPrintStat(countryInfo.todayDeaths)} 
              total={prettyPrintStat(countryInfo.deaths)} 
            />
        </div>
        
        {/* Map */}
        <Map casesType={casesType} countries={mapCountries} center={mapCenter} zoom={mapZoom} />
      </div>

      <Card className="app__right"> 
        <CardContent>
          {/* Table */}
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />
          
          {/* Graph */}
          <h3 className="app__graphTitle">Worldwide new {casesType}</h3>
          <LineGraph className="app__graph" casesType={casesType}/>
          
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
