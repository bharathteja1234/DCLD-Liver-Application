import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import Feather from 'react-native-vector-icons/Feather'; // Import Feather icon

const PrescriptionScreen = ({ route }) => {
  const { p_id, course } = route.params;
  const [prescriptions, setPrescriptions] = useState([]);
  const [medicine, setMedicine] = useState('');
  const [medicineDuration, setMedicineDuration] = useState('');
  const [frequency, setFrequency] = useState('');
  const [guidelines, setGuidelines] = useState('');

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const response = await fetch(`http://192.168.180.15/php/Prescription.php?p_id=${p_id}&course=${course}`);
      if (!response.ok) {
        throw new Error('Failed to fetch prescriptions');
      }
      const data = await response.json();
      setPrescriptions(data);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch prescriptions');
    }
  };

  const handleSavePrescription = async () => {
    try {
      const newPrescription = { medicine, medicine_duration: medicineDuration, frequency, guidelines };

      const response = await fetch(`http://192.168.180.15/php/Prescription.php?p_id=${p_id}&course=${course}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPrescription),
      });

      if (!response.ok) {
        throw new Error('Failed to save prescription');
      }

      const data = await response.json();
      setPrescriptions([...prescriptions, data]);
      setMedicine('');
      setMedicineDuration('');
      setFrequency('');
      setGuidelines('');
      Alert.alert('Success', 'Prescription saved successfully');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to save prescription');
    }
  };

  const handleDeletePrescription = async (id) => {
    try {
      const response = await fetch(`http://192.168.180.15/php/Prescription.php?p_id=${p_id}&course=${course}&id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete prescription');
      }

      setPrescriptions(prescriptions.filter(prescription => prescription.id !== id));
      Alert.alert('Success', 'Prescription deleted successfully');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to delete prescription');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Prescription for Course {course}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Medicine"
          value={medicine}
          onChangeText={setMedicine}
        />
        <TextInput
          style={styles.input}
          placeholder="Duration"
          value={medicineDuration}
          onChangeText={setMedicineDuration}
        />
        <TextInput
          style={styles.input}
          placeholder="Frequency"
          value={frequency}
          onChangeText={setFrequency}
        />
        <TextInput
          style={styles.input}
          placeholder="Guidelines"
          value={guidelines}
          onChangeText={setGuidelines}
        />
      </View>
      <TouchableOpacity style={styles.saveButton} onPress={handleSavePrescription}>
        <Text style={styles.buttonText}>Save Prescription</Text>
      </TouchableOpacity>
      <ScrollView style={styles.prescriptionList}>
        {prescriptions
          .filter(prescription => prescription.medicine || prescription.medicine_duration || prescription.frequency || prescription.guidelines)
          .map((prescription, index) => (
            <View key={index} style={styles.prescriptionItem}>
              <Text style={styles.prescriptionText}>{`Medicine   : ${prescription.medicine}`}</Text>
              <Text style={styles.prescriptionText}>{`Duration    : ${prescription.medicine_duration}`}</Text>
              <Text style={styles.prescriptionText}>{`Frequency : ${prescription.frequency}`}</Text>
              <Text style={styles.prescriptionText}>{`Guidelines : ${prescription.guidelines}`}</Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeletePrescription(prescription.id)}
              >
                <Feather name="trash-2" size={24} color="black" />
              </TouchableOpacity>
            </View>
          ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    marginTop:100,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    width: '80%',
    marginBottom: 20,
  },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 3,
    borderRadius: 7,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  saveButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 18,
    color: '#ffffff',
  },
  prescriptionList: {
    width: '80%',
    flex: 1,
  },
  prescriptionItem: {
    padding: 10,
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#90c1F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  prescriptionText: {
    fontSize: 17,
    marginBottom: 5,
  },
  deleteButton: {
    backgroundColor: '#90c1F9',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    position: 'absolute',
    right: 20,
    top: 40,
  },
});

export default PrescriptionScreen;
