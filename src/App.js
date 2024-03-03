import React, { useState } from "react";
import Chip from "@material-ui/core/Chip";
import "./App.css";

function App() {
  const [names, setNames] = useState("");
  const [chips, setChips] = useState([]);
  const [results, setResults] = useState([]);

  const handleChange = (event) => {
    setNames(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const name = event.target.value.trim();
      if (name !== "") {
        setChips([...chips, name]);
        setNames("");
      }
    }
  };

  const handleDeleteChip = (index) => {
    const newChips = [...chips];
    newChips.splice(index, 1);
    setChips(newChips);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const nameDataArray = await Promise.all(
        chips.map(async (name) => {
          const response = await fetch(
            `https://api.nationalize.io?name=${name}`
          );
          const data = await response.json();
          console.log("data", data);
          return data;
        })
      );

      setResults(nameDataArray);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div>
      <h1>Nationality Search</h1>
      <form onSubmit={handleSubmit}>
        <div className="chips-container">
          {chips.map((chip, index) => (
            <Chip
              key={index}
              label={chip}
              onDelete={() => handleDeleteChip(index)}
              variant="outlined"
              color="primary"
              className="chip"
            />
          ))}
        </div>
        <input
          type="text"
          value={names}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          placeholder="Enter names separated by commas or spaces"
          className="input"
        />
        <button type="submit" className="submit-button">
          Search
        </button>
      </form>
      {results.length > 0 && (
        <div>
          <h2>Search Results</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Country</th>
                <th>Probability</th>
              </tr>
            </thead>
            <tbody>
              {results.map((data, index) => (
                <tr key={index}>
                  <td>{data.name}</td>
                  {data.country &&
                    data.country.map((country, countryIndex) => (
                      <React.Fragment key={countryIndex}>
                        <td>{country.country_id}</td>
                        <td>{country.probability}</td>
                      </React.Fragment>
                    ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
