import './App.css';
import React, { useState, useEffect } from 'react';


function App() {
  const [aus, setAus] = React.useState([]);
  const [sea, setSea] = React.useState([]);
  const [hnl, setHnl] = React.useState([]);
  const [other, setOther] = React.useState([]);
  const [lat, setLat] = React.useState([]);
  const [long, setLong] = React.useState([]);
  const [time, setTime] = React.useState([]);
  const [selectedList, setSelectedList] = useState(1); 
  const [loading, setLoading] = useState(true);  // State to track loading status
  const [error, setError] = useState(null);      // State to track any errors
  const [currList, setCurrList] = useState([]); 
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Replace the URL below with the actual API endpoint you want to fetch data from.
    fetch('https://api.open-meteo.com/v1/forecast?latitude=30.2672&longitude=-97.7431&current=temperature_2m&hourly=temperature_2m&temperature_unit=fahrenheit&forecast_days=2&timezone=America%2FChicago')
      .then(response => {
        if (!response.ok) { // Check if response status is OK (status in the range 200-299)
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setAus(data["hourly"]["temperature_2m"]);
        setTime(data["current"]["time"].substring(11, 13));
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });

      fetch('https://api.open-meteo.com/v1/forecast?latitude=47.6062&longitude=-122.3321&current=temperature_2m&hourly=temperature_2m&temperature_unit=fahrenheit&forecast_days=2&timezone=America%2FChicago')
      .then(response => {
        if (!response.ok) { // Check if response status is OK (status in the range 200-299)
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setSea(data["hourly"]["temperature_2m"]);
        setTime(data["current"]["time"].substring(11, 13));
        setLoading(false);
        // alert(sea["hourly"]["temperature_2m"][0]);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });

      fetch('https://api.open-meteo.com/v1/forecast?latitude=21.3069&longitude=-157.8583&current=temperature_2m&hourly=temperature_2m&temperature_unit=fahrenheit&forecast_days=2&timezone=America%2FChicago')
      .then(response => {
        if (!response.ok) { // Check if response status is OK (status in the range 200-299)
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setHnl(data["hourly"]["temperature_2m"]);
        setTime(data["current"]["time"].substring(11, 13));
        setLoading(false);
        // alert(sea["hourly"]["temperature_2m"][0]);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, []); 

  useEffect(() => {
    switch (selectedList) {
        case 1:
          setCurrList(aus);
          break;
        case 2:
          setCurrList(sea);
          break;
        case 3:
          setCurrList(hnl);
          break;
        default:
          setCurrList(other);
          break;
    }
  }, [selectedList, aus, sea, hnl, other, searchTerm]);

  const handleSearch = () => {
    fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${searchTerm}&count=1`)
      .then(response => {
        if (!response.ok) { // Check if response status is OK (status in the range 200-299)
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setLat(data["results"][0]["latitude"]);
        setLong(data["results"][0]["longitude"]);
        setLoading(false);
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${data["results"][0]["latitude"]}&longitude=${data["results"][0]["longitude"]}&current=temperature_2m&hourly=temperature_2m&temperature_unit=fahrenheit&forecast_days=2&timezone=America%2FChicago`)
        .then(response2 => {
          if (!response2.ok) { // Check if response status is OK (status in the range 200-299)
            throw new Error('Network response was not ok');
          }
          return response2.json();
        })
        .then(data => {
          setOther(data["hourly"]["temperature_2m"]);
          setTime(data["current"]["time"].substring(11, 13));
          setLoading(false);
          setSelectedList(4);
          // alert(sea["hourly"]["temperature_2m"][0]);
        })
        .catch(err => {
          setError(err);
          setLoading(false);
        });
      })
      .catch(err => {
        setError(err);
        document.getElementById('error').innerText = "City not found";
        setLoading(false);
      });
  };

  if (loading) return <div>Loading...</div>;
  return (
    <div>
      <div class="buttons">
        <button class="citybutton" onClick={() => setSelectedList(1)}>Austin</button>
        <button class="citybutton" onClick={() => setSelectedList(2)}>Seattle</button>
        <button class="citybutton" onClick={() => setSelectedList(3)}>Honolulu</button>
      </div>
      <div class="search">
        <input 
          type="text" 
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search..."
        />
        <button class="searchbutton" onClick={handleSearch}>+</button>
      </div>
      <span id="error" class="errorMsg"> {Error} </span>
      <div>
        <table class="weatherTable">
                <thead>
                    <tr>
                        <th>Time</th>
                        <th>Temperature</th>
                    </tr>
                </thead>
                <tbody>
                    {currList.slice(parseInt(time), parseInt(time) + 12).map((value, index) => (
                        <tr key={parseInt(time) + index}>
                            <td class="weathercolumn">
                              {displayTime(parseInt(time) + index)}
                              </td>
                            <td class="weathercolumn">{parseInt(value)} F</td>
                        </tr>
                    ))}
                </tbody>
            </table>
      </div>
    </div>
  );
}

function displayTime(index) {
  let time = index;
  if (time === 0) {
    time = time + 12;
  }
  if (time > 24) {
    time = time - 24;
  }
  if (time > 12 && time < 25) {
    time = time - 12;
    return time + ":00 PM";
  }
  return time + ":00 AM";
}

export default App;
