import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal } from 'react-native';
import { useRoute } from '@react-navigation/native';

const Pqns = () => {
  const route = useRoute();
  const { p_id } = route.params; // Assume p_id is passed through navigation params

  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch('http://192.168.180.15/php/d_questions.php');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (!data || !Array.isArray(data.questions)) {
        throw new Error('Invalid response format');
      }
      setQuestions(data.questions);
      const defaultResponses = data.questions.map((question) => ({
        questions: question.question, // Ensure the key matches PHP expectation
        type: question.type,
        response: '',
        response_time: new Date().toISOString(),
      }));
      setResponses(defaultResponses);
      setFetchError(null);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setFetchError('Failed to fetch questions. Please try again.');
    }
  };

  const handleResponseChange = useCallback((questionText, value) => {
    const updatedResponses = responses.map((response) =>
      response.questions === questionText ? { ...response, response: value } : response
    );
    setResponses(updatedResponses);
  }, [responses]);

  const handleSubmit = async () => {
    const allFilled = responses.every((response) => response.response !== '');
    if (!allFilled) {
      setModalMessage('Please fill out all required fields.');
      setModalVisible(true);
      return;
    }

    const notificationDate = new Date().toISOString();

    const dangerSymptoms = responses
      .filter((response) => response.type === 'Danger Symptoms' && response.response === 'Yes')
      .map((response) => {
        const match = response.questions.match(/(.+?)\?/);
        return match ? match[1] : response.questions;
      });

    const notification = dangerSymptoms.length > 0 ? dangerSymptoms.join(" and ") + "!!!" : '';

    try {
      const response = await fetch('http://192.168.180.15/php/p_qns.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ p_id, responses, notification, notificationDate }), // Including p_id in the request
      });
      const responseText = await response.text();
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      if (responseText.startsWith("Success")) {
        setModalMessage('Form submitted successfully!');
        setResponses(responses.map((response) => ({ ...response, response: '' })));
      } else {
        setModalMessage(responseText);
      }
      setModalVisible(true);
    } catch (error) {
      console.error('Error submitting responses:', error);
      setModalMessage('Error submitting responses. Please try again.');
      setModalVisible(true);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setModalMessage('');
  };

  const renderQuestions = (type) => {
    return questions.filter((question) => question.type === type).map((question) => (
      <View key={question.id} style={styles.questionItem}>
        <Text style={styles.questionText}>{question.question}</Text>
        <View style={styles.radioButtonsContainer}>
          <TouchableOpacity
            style={[styles.radioButton, responses.find((r) => r.questions === question.question)?.response === 'Yes' && styles.radioButtonSelected]}
            onPress={() => handleResponseChange(question.question, 'Yes')}
          >
            <Text style={styles.radioButtonText}>Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.radioButton, responses.find((r) => r.questions === question.question)?.response === 'No' && styles.radioButtonSelected]}
            onPress={() => handleResponseChange(question.question, 'No')}
          >
            <Text style={styles.radioButtonText}>No</Text>
          </TouchableOpacity>
        </View>
      </View>
    ));
  };

  return (
    <ScrollView style={styles.container}>
      {fetchError && <Text style={styles.errorText}>{fetchError}</Text>}

      <Text style={styles.sectionHeading1}>General Symptoms</Text>
      <View style={styles.questionBox}>{renderQuestions('General Symptoms')}</View>

      <Text style={styles.sectionHeadingDanger}>Danger Symptoms</Text>
      <View style={styles.questionBox1}>{renderQuestions('Danger Symptoms')}</View>

      <Text style={styles.sectionHeading}>Regular Monitoring</Text>
      <View style={styles.questionBox}>{renderQuestions('Regular Monitoring')}</View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <TouchableOpacity onPress={handleCloseModal} style={styles.modalCloseButton}>
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  sectionHeading1: {
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 60,
    marginBottom: 10,
  },
  sectionHeadingDanger: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'red',
    marginTop: 10,
    marginBottom: 10,
  },
  questionBox: {
    borderWidth: 3,
    borderColor: '#80BBFA',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  questionBox1: {
    borderWidth: 3,
    borderColor: '#DE5050',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  questionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  questionText: {
    flex: 1,
    fontSize: 16,
  },
  radioButtonsContainer: {
    flexDirection: 'row',
  },
  radioButton: {
    backgroundColor: '#D9D9D9',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  radioButtonSelected: {
    backgroundColor: '#007bff',
  },
  radioButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 20,
    alignSelf: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalCloseButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  modalCloseButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});


export default Pqns;
