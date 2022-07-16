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

function App() {
  // STATE = How to write a variable in REACT  (Didn't understand and need to check it)
  const [countries, setCountries] = useState([])
  const [country, setCountry] = useState("worldwide");


  // USEEFFECT = Runs a peice of code based on a given condition
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

        setCountries(countries);
      });
    }

    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;

    setCountry(countryCode);
  }

  return (
    <div className="App">
      {/* All the components. React is component-based */}
      <div className="app__left">
        {/* Header */}
        {/* Title + Select input dropdown field */}
        <div className="app__header">
          <h1>COVID-19 Tracker</h1>
          <FormControl className="app__dropdpwn">
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
            <InfoBox title="Coronavirus Cases" cases={123} total={2000} />
            <InfoBox title="Recovered" cases={1234} total={3000} />
            <InfoBox title="Deaths" cases={12345} total={4000} />
        </div>
        
        {/* Map */}
        <Map />
      </div>

      <Card className="app__right">
        <CardContent>
          {/* Table */}
          <h3>Live Cases by Country</h3>
          {/* Graph */}
          <h3>Worldwide new cases</h3>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
