import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faNoteSticky } from '@fortawesome/free-solid-svg-icons';

const DoctorPatientNotes = ({ route }) => {
  const { p_id } = route.params;
  const [patientNotes, setPatientNotes] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    fetchPatientNotes();
  }, []);

  const fetchPatientNotes = async () => {
    try {
      const response = await fetch(`http://192.168.180.15/php/Patient_Notes.php?p_id=${p_id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch patient notes');
      }
      const data = await response.json();
      const filteredNotes = data.filter(note => note.Notes_Index && note.notes_date);
      setPatientNotes(filteredNotes);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch patient notes');
    }
  };

  const navigateToNoteDetails = (note) => {
    navigation.navigate('DoctorPatientNotesDetails', { p_id, note });
  };

  if (!patientNotes || !Array.isArray(patientNotes)) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Patient Notes</Text>
      <ScrollView contentContainerStyle={styles.notesList}>
        {patientNotes.map((note, index) => (
          <View key={index} style={index % 2 === 0 ? styles.noteItemLeft : styles.noteItemRight}>
            <TouchableOpacity
              style={styles.noteDetailsButton}
              onPress={() => navigateToNoteDetails(note)}
            >
              <FontAwesomeIcon icon={faNoteSticky} size={26} style={styles.icon} />
              <Text style={styles.noteText}>{note.Notes_Index}</Text>
              <Text style={styles.dateText}>{`Date: ${note.notes_date}`}</Text>
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
    justifyContent: 'flex-start',
    backgroundColor: '#ffffff',
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 90,
    marginBottom: 20,
  },
  notesList: {
    width: '100%',
    paddingBottom: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  noteDetailsButton: {
    padding: 10,
    borderWidth: 2,
    borderColor: '#90c1F9',
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#90c1F9',
    shadowColor: 'black',
    shadowOffset: { width: 3, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 10,
    width: '100%',
    alignItems: 'center',
  },
  noteItemLeft: {
    width: '48%',
    marginBottom: 10,
  },
  noteItemRight: {
    width: '48%',
    marginBottom: 10,
    alignSelf: 'flex-end',
  },
  icon: {
    marginBottom: 5,
  },
  noteText: {
    fontSize: 16,
    textAlign: 'center',
  },
  dateText: {
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
});

export default DoctorPatientNotes;
