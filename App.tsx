import React, { useState } from 'react';
import { StatusBar, View, Text, StyleSheet, Button } from 'react-native';
import { Searchbar } from 'react-native-paper';

function App(): JSX.Element {
  // State variables to manage user input, vehicle details, and search status
  const [input, setInput] = useState('');
  const [vehicleDetails, setVehicleDetails] = useState({});
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [error, setError] = useState(false);

  // Function to handle changes in the search input field
  const handleInputChange = (text) => setInput(text);

  // Function to perform the search and retrieve vehicle data
  const handleSearch = async () => {
    try {
      // Fetch data from the external API
      const res = await fetch(`https://uk1.ukvehicledata.co.uk/api/datapackage/VehicleData?v=2&api_nullitems=1&auth_apikey=a75469a6-e3ef-4125-bb18-fc8a84bd60be&key_VRM=${input}`);
      const data = await res.json();

      if (res.ok) {
        // Update the vehicle details if the search is successful
        setVehicleDetails(data?.Response?.DataItems?.VehicleRegistration || {});
        setSearchPerformed(true);
        setError(false);
        console.log(data);
      } else {
        // Handle errors during the search
        throw new Error('Failed to fetch data');
      }
    } catch (error) {
      // Log and handle errors in fetching data
      console.error('Error fetching data:', error);
      setVehicleDetails({});
      setSearchPerformed(true);
      setError(true);
    }
  }

  // Check if a result is found based on search status and data availability
  const resultFound = searchPerformed && !error && Object.keys(vehicleDetails).length > 0;

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.searchBarContainer}>
        {/* Search bar for the user input */}
        <Searchbar
          placeholder="Search"
          onChangeText={handleInputChange}
          value={input}
          style={styles.searchBar}
        />
        <View style={styles.buttonContainer}>
          {/* Button to trigger the search action */}
          <Button title="Search" onPress={handleSearch} />
        </View>
      </View>
      {/* Display the vehicle details if found */}
      {resultFound && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>Make: {vehicleDetails.Make}</Text>
          <Text style={styles.resultText}>Model: {vehicleDetails.Model}</Text>
          <Text style={styles.resultText}>Fuel Type: {vehicleDetails.FuelType}</Text>
          <Text style={styles.resultText}>Year of Manufacture: {vehicleDetails.YearOfManufacture}</Text>
          <Text style={styles.resultText}>Number of Seats: {vehicleDetails.SeatingCapacity}</Text>
        </View>
      )}
      {/* Display a message when no result is found or when there's an error */}
      {searchPerformed && (!resultFound && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>No vehicle found</Text>
        </View>
      ))}
    </View>
  );
}

// Styles for components
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchBarContainer: {
    marginTop: 20,
    marginHorizontal: 11,
  },
  searchBar: {
    borderRadius: 20,
  },
  buttonContainer: {
    marginTop: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  resultContainer: {
    marginTop: 20,
    padding: 10,
    borderColor: 'lightgrey',
    borderWidth: 1,
    borderRadius: 10,
  },
  resultText: {
    fontSize: 16,
    marginBottom: 8,
  },
});

export default App;
