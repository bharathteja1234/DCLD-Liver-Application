import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';

const DoctorQuestionaireResponses = ({ route }) => {
  const { p_id } = route.params;
  const [responses, setResponses] = useState([]);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    fetchResponses();
  }, []);

  const fetchResponses = async () => {
    try {
      const response = await fetch('http://192.168.180.15/php/DoctorQuestionaireResponses.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ p_id }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const responseData = await response.json();
      if (!responseData.success) {
        throw new Error(responseData.message || 'Failed to fetch responses');
      }
      setResponses(responseData.responses);
      setFetchError(null);
    } catch (error) {
      console.error('Error fetching responses:', error);
      setFetchError('Failed to fetch responses. Please try again.');
    }
  };

  const renderResponseButtons = (type) => {
    const filteredResponses = responses.filter((response) => response.type === type);
    return filteredResponses.map((response, index) => (
      <Button
        key={index}
        title={`Response ${index + 1}`}
        onPress={() => alert(`Response: ${response.response}`)} // Replace with actual display logic
      />
    ));
  };

  if (fetchError) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{fetchError}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionHeading}>General Symptoms</Text>
      {renderResponseButtons('General Symptoms')}

      <Text style={styles.sectionHeading}>Danger Symptoms</Text>
      {renderResponseButtons('Danger Symptoms')}

      <Text style={styles.sectionHeading}>Regular Monitoring</Text>
      {renderResponseButtons('Regular Monitoring')}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  sectionHeading: {
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});

export default DoctorQuestionaireResponses ;
