import React from "react";
import { Circle, Popup } from "react-leaflet";
import numeral from "numeral";

const casesTypeColors = {
    cases: {
      hex: "#CC1034",
    //   rgb: "rgb(204, 16, 52)",
    //   half_op: "rgba(204, 16, 52, 0.5)",
      multiplier: 200,
    },
    recovered: {
      hex: "#7dd71d",
    //   rgb: "rgb(125, 215, 29)",
    //   half_op: "rgba(125, 215, 29, 0.5)",
      multiplier: 300,
    },
    deaths: {
      hex: "#fb4443",
    //   rgb: "rgb(251, 68, 67)",
    //   half_op: "rgba(251, 68, 67, 0.5)",
      multiplier: 500,
    },
  };

export const sortData = (data) => {
    const sortedData = [...data];

    //  Two ways to sort it
    sortedData.sort((a, b) => {
        // Descending
        if (a.cases > b.cases) {
            return -1;  // false
        }
        else {
            return 1;  // true
        }
    })
    return sortedData;
    // return sortedData.sort((a, b) => (a.cases > b.cases ? -1 : 1))


    // return sortedData.sort((a, b) => (b.cases - a.cases))  // Descending, Ascending is a - b
}

export const prettyPrintStat = (stat) => 
    stat ? `+${numeral(stat).format("0.0a")}` : "+0";


// Draw circles on the map with interactive tooltop
export const showDataOnMap = (data, casesType='cases') =>
    data.map(country => (
    <Circle
            center={[country.countryInfo.lat, country.countryInfo.long]}
            fillOpacity={0.4}
            color={casesTypeColors[casesType].hex}
            fillColor={casesTypeColors[casesType].hex}
            radius={
                Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
            }
        >
            <Popup>
                <div className="info-container">
                    <div
                        className="info-flag"
                        style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
                    ></div>
                    <div>{country.country}</div>
                    <div className="info-confirmed">
                        Cases: {numeral(country.cases).format("0,0")}
                    </div>
                    <div className="info-recovered">
                        Recovered: {numeral(country.recovered).format("0,0")}
                    </div>
                    <div className="info-deaths">
                        Deaths: {numeral(country.deaths).format("0,0")}
                    </div>
                </div>
            </Popup>

        </Circle>
    ))
