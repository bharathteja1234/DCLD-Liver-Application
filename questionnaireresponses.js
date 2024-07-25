import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView, Text, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import Feather from 'react-native-vector-icons/Feather';

const QuestionnaireResponses = ({ route, navigation }) => {
  const { p_id } = route.params; // Assuming p_id is passed via route params
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const response = await axios.get(`http://192.168.180.15/php/questionnaire_responses.php?p_id=${p_id}`);
        if (response.data.error) {
          throw new Error(response.data.error);
        }
        console.log('Fetched responses:', response.data); // Debug log
        setResponses(response.data);
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Failed to fetch questionnaire assessment responses');
      }
    };

    fetchResponses();
  }, [p_id]);

  const extractDateFromResponse = (response) => {
    if (!response) return 'No Date';
    const dateMatch = response.match(/Date: (\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{6})/);
    console.log('Extracted date:', dateMatch ? dateMatch[1] : 'No Date'); // Debug log
    return dateMatch ? dateMatch[1] : 'No Date';
  };

  const formatDate = (dateString) => {
    console.log('Formatting date:', dateString); // Debug log
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    // Format date to 'YYYY-MM-DD'
    return date.toISOString().split('T')[0]; // Example: '2024-01-01'
  };

  const removeDateFromResponse = (response) => {
    if (!response) return '';
    const cleanedResponse = response.replace(/Date: \d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{6}/, '').trim();
    console.log('Cleaned response:', cleanedResponse); // Debug log
    return cleanedResponse;
  };

  const handleButtonClick = (response_time) => {
    navigation.navigate('QuestionnaireDetail', { p_id, response_time });
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="chevron-left" size={30} color="black" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Questionnaire Responses</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {responses.map((responseObj, index) => {
          const response = responseObj.response;
          const response_time = extractDateFromResponse(response);
          const formattedDate = response_time !== 'No Date' ? formatDate(response_time) : 'No Date';
          const responseWithoutDate = removeDateFromResponse(response);
          console.log('Response without date:', responseWithoutDate); // Debug log
          console.log('Formatted date:', formattedDate); // Debug log
          return (
            <View key={index} style={index % 2 === 0 ? styles.buttonItemLeft : styles.buttonItemRight}>
              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={() => handleButtonClick(response_time)}
              >
                <FontAwesomeIcon icon={faComment} size={26} style={styles.icon} />
                <Text style={styles.buttonText}>{responseWithoutDate}</Text>
                <Text style={styles.dateText}>Date: {formattedDate}</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  topBar: {
    width: '100%',
    height: 120,
    backgroundColor: '#90C1F9',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginBottom: 20,
    borderRadius: 30,
    marginBottom:30,
  },
  backButton: {
    position: 'absolute',
    left: 15,
    top:60,
  },
  topBarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    top:20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  scrollContainer: {
    width: '100%',
    paddingBottom: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  buttonContainer: {
    padding: 10,
    borderWidth: 2,
    borderColor: '#90C1F9',
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#90C1F9',
    shadowColor: 'black',
    shadowOffset: { width: 3, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 10,
    alignItems: 'center',
    width: 180,
  },
  buttonItemLeft: {
    width: '48%',
    marginBottom: 10,
  },
  buttonItemRight: {
    width: '48%',
    marginBottom: 10,
    alignSelf: 'flex-end',
  },
  icon: {
    marginBottom: 5,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    textAlign: 'center',
  },
  dateText: {
    color: 'white',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
});

export default QuestionnaireResponses;
