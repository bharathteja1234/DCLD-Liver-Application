import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Feather from 'react-native-vector-icons/Feather';
import Notification from './options';

const QuestionScreen = () => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [selectedType, setSelectedType] = useState('General Symptoms');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedQuestion, setEditedQuestion] = useState('');
  const [isPickerModalVisible, setIsPickerModalVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch('http://192.168.180.15/php/d_questions.php');
      const text = await response.text();
      console.log('Raw response:', text);
      const data = JSON.parse(text);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      if (!data || !Array.isArray(data.questions)) {
        throw new Error('Invalid response format');
      }
      setQuestions(data.questions);
      setFetchError(null);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setFetchError('Failed to fetch questions. Please try again.');
    }
  };

  const handleAddQuestion = async () => {
    try {
      const response = await fetch('http://192.168.180.15/php/d_questions.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: newQuestion, type: selectedType }),
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      if (responseData.success) {
        setNewQuestion('');
        fetchQuestions();
        setNotification('Question added successfully!');
      } else {
        throw new Error(responseData.message || 'Unknown error occurred');
      }
    } catch (error) {
      console.error('Error adding question:', error);
      setNotification('Error adding question.');
    }
  };

  const handleEditQuestion = (id) => {
    const index = questions.findIndex((question) => question.id === id);
    if (index !== -1) {
      setEditingIndex(index);
      setEditedQuestion(questions[index].question);
      setSelectedType(questions[index].type);
      setIsModalVisible(true);
    }
  };

  const saveEditedQuestion = async () => {
    try {
      const response = await fetch('http://192.168.180.15/php/d_questions.php', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: questions[editingIndex].id, question: editedQuestion, type: selectedType }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data.success) {
        fetchQuestions();
        setIsModalVisible(false);
        setNotification('Question edited successfully!');
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error editing question:', error);
      setNotification('Error editing question.');
    }
  };

  const handleDeleteQuestion = async (id) => {
    try {
      const response = await fetch('http://192.168.180.15/php/d_questions.php', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data.success) {
        fetchQuestions();
        setNotification('Question deleted successfully!');
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error deleting question:', error);
      setNotification('Error deleting question.');
    }
  };

  const handlePickerDone = () => {
    setIsPickerModalVisible(false);
  };

  return (
    <ScrollView style={styles.container}>
      {notification ? <Notification message={notification} onClose={() => setNotification('')} /> : null}
      <View style={styles.box}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Enter New Question</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter here....."
            value={newQuestion}
            onChangeText={(text) => setNewQuestion(text)}
          />
          <TouchableOpacity style={styles.pickerButton} onPress={() => setIsPickerModalVisible(true)}>
            <Text style={styles.pickerButtonText}>{selectedType}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton} onPress={handleAddQuestion}>
            <Text style={styles.addButtonText}>Add Question</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.SCell}>S.No</Text>
          <Text style={styles.headerCell1}>Type</Text>
          <Text style={styles.headerCell}>Question</Text>
          <Text style={styles.headerCell2}>Actions</Text>
        </View>
        {questions.map((question, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={[styles.cell1, { borderBottomWidth: questions.length === index + 1 ? 0 : 1 }]}>{index + 1}</Text>
            <Text style={[styles.cell2, { borderBottomWidth: questions.length === index + 1 ? 0 : 1 }]}>{question.type}</Text>
            <Text style={[styles.cell, { borderBottomWidth: questions.length === index + 1 ? 0 : 1 }]}>{question.question}</Text>
            <View style={styles.actionCell}>
              <TouchableOpacity onPress={() => handleEditQuestion(question.id)}>
                <Feather name="edit-2" size={23} color="#007bff" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteQuestion(question.id)}>
                <Feather name="x-square" size={23} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
      <Modal visible={isModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <TextInput
            style={styles.modalInput}
            value={editedQuestion}
            onChangeText={(text) => setEditedQuestion(text)}
          />
          <Picker
            selectedValue={selectedType}
            onValueChange={(itemValue) => setSelectedType(itemValue)}
          >
            <Picker.Item label="General Symptoms" value="General Symptoms" />
            <Picker.Item label="Danger Symptoms" value="Danger Symptoms" />
            <Picker.Item label="Regular Monitoring" value="Regular Monitoring" />
          </Picker>
          <TouchableOpacity style={styles.saveButton} onPress={saveEditedQuestion}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.back} onPress={() => setIsModalVisible(false)}>
            <Text style={styles.backButtonText}>{"<< Back"}</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <Modal visible={isPickerModalVisible} transparent={true} animationType="fade">
        <View style={styles.pickerModalContainer}>
          <View style={styles.pickerModal}>
            <Picker
              selectedValue={selectedType}
              onValueChange={(itemValue) => setSelectedType(itemValue)}
            >
              <Picker.Item label="General Symptoms" value="General Symptoms" />
              <Picker.Item label="Danger Symptoms" value="Danger Symptoms" />
              <Picker.Item label="Regular Monitoring" value="Regular Monitoring" />
            </Picker>
            <TouchableOpacity style={styles.pickerModalButton} onPress={handlePickerDone}>
              <Text style={styles.pickerModalButtonText}>Done</Text>
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
    backgroundColor: '#f8f8f8',
    
  },
  box: {
    marginBottom: 20,
  },
  headerContainer: {
    backgroundColor: '#007bff',
    padding: 10,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    marginTop: 25,
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    borderWidth: 2,
    borderColor: '#ccc',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  pickerButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  pickerButtonText: {
    color: 'white',
  },
  addButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  table: {
    width: '100%',
    borderWidth: 3,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    borderBottomWidth: 2,
    borderColor: '#ccc',
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 10,
  },
  headerCell: {
    flex: 1,
    paddingVertical: 10,
    fontWeight: 'bold',
    borderRightWidth: 2,
    justifyContent:'center',
    borderColor: '#ccc',
  },
  headerCell2: {
    paddingVertical: 10,
    fontWeight: 'bold',
    borderRightWidth: 2,
    width:70,
    justifyContent:'center',
    alignItems:'center',
    borderColor: '#ccc',
  },
  headerCell1: {
    paddingVertical: 10,
    justifyContent:'center',
    width: 90,
    fontWeight: 'bold',
    borderRightWidth: 2,
    borderColor: '#ccc',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    paddingVertical: 0,
  },
  cell: {
    flex: 1,
    paddingVertical: 10,
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
  cell1: {
    paddingVertical: 10,
    borderRightWidth: 1,
    borderColor: '#ccc',
    width: 40,
    alignItems: 'center',
  },
  cell2: {
    paddingVertical: 10,
    borderRightWidth: 1,
    borderColor: '#ccc',
    width: 90,
    alignContent: 'center',
    alignItems: 'center',
  },
  actionCell: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 5,
    width:70,
  },
  editButton: {
    marginRight: 5,
    marginLeft:20,
    marginTop:30,
  },
  deleteButton: {
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalInput: {
    borderWidth: 3,
    borderColor: '#ccc',
    borderRadius: 5,
    height: 50,
    paddingHorizontal: 10,
    marginBottom: 10,
    width: '100%',
  },
  saveButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginTop: 10,
    height: 30,
    width: 60,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  back: {
    marginTop: 20,
  },
  backButtonText: {
    color: '#007bff',
    fontSize: 17,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
  SCell: {
    paddingVertical: 10,
    fontWeight: 'bold',
    borderRightWidth: 2,
    borderColor: '#ccc',
    width: 40,
  },
  pickerModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  pickerModal: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  pickerModalButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  pickerModalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default QuestionScreen;
