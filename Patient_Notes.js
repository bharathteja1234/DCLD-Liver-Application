import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';

const PatientNotes = ({ route }) => {
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
            // Filter out notes where Notes_Index or notes_date is empty
            const filteredNotes = data.filter(note => note.Notes_Index && note.notes_date);
            setPatientNotes(filteredNotes);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to fetch patient notes');
        }
    };

    const handleAddPatientNote = async () => {
        try {
            const currentDate = new Date().toISOString().split('T')[0]; 
            const newNote = { Notes_Index: `Patient Note ${patientNotes.length + 1}`, notes_date: currentDate };

            const response = await fetch('http://192.168.180.15/php/Patient_Notes.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ p_id, ...newNote }),
            });

            if (!response.ok) {
                throw new Error('Failed to add new patient note');
            }

            const data = await response.json();
            if (data.notes_date) { // Ensure added note has a valid date
                setPatientNotes([...patientNotes, data]);
                Alert.alert('Success', 'New patient note added successfully');
            } else {
                Alert.alert('Error', 'Failed to add new patient note: Invalid date');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to add new patient note');
        }
    };

    const handleDeletePatientNote = async (note) => {
        try {
            const response = await fetch('http://192.168.180.15/php/Patient_Notes.php', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ p_id, Notes_Index: note.Notes_Index }), // Ensure 'Notes_Index' matches backend parameter name
            });

            if (!response.ok) {
                throw new Error('Failed to delete patient note');
            }

            setPatientNotes(patientNotes.filter(item => item.Notes_Index !== note.Notes_Index));
            Alert.alert('Success', 'Patient note deleted successfully');
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to delete patient note');
        }
    };

    const navigateToNoteDetails = (note) => {
        navigation.navigate('PatientNoteDetails', { p_id, note });
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
            <View style={styles.notesList}>
                {patientNotes.map((note, index) => (
                    <View key={index} style={styles.noteItem}>
                        <TouchableOpacity
                            onPress={() => navigateToNoteDetails(note)}
                        >
                            <Text>{note.Notes_Index}</Text>
                            <Text>{`Date: ${note.notes_date}`}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => handleDeletePatientNote(note)}
                        >
                            <Feather name="trash-2" size={18} color="#ffffff" />
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
            <TouchableOpacity style={styles.addButton} onPress={handleAddPatientNote}>
                <Text style={styles.buttonText}>Add New Patient Note</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    notesList: {
        width: '80%',
        borderRadius: 10,
        marginBottom: 40,
    },
    noteItem: {
        padding: 10,
        borderWidth: 2,
        borderColor: '#90c1F9',
        borderRadius: 10,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor:'#90c1F9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        alignItems: 'center',
    },
    addButton: {
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    deleteButton: {
        backgroundColor: '#ff0000',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    buttonText: {
        fontSize: 18,
        color: '#ffffff',
    },
});

export default PatientNotes;
