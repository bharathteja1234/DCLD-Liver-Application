import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const PatientNoteDetails = ({ route }) => {
    const { p_id, note } = route.params;
    const [noteContent, setNoteContent] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [isNoteFound, setIsNoteFound] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        console.log('Received ', p_id, note);
        fetchPatientNote();
    }, [p_id, note]);

    const fetchPatientNote = async () => {
        try {
            console.log('Fetching note for:', p_id, note);
            const response = await fetch(`http://192.168.180.15/php/PatientNotesDetail.php?p_id=${p_id}&Notes_Index=${note.Notes_Index}&notes_date=${note.notes_date}`);
            console.log('Fetch response status:', response.status);
            const data = await response.json();
            console.log('Fetch response data:', data);

            if (data && data.Notes) {
                setNoteContent(data.Notes);
                setIsNoteFound(true);
            } else {
                setIsNoteFound(false);
                Alert.alert('Notice', 'Patient note not found. Please add a note.');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            Alert.alert('Error', 'Failed to fetch patient note');
        }
    };

    const handleSave = async () => {
        try {
            console.log('Saving note for:', p_id, note, noteContent);
            const response = await fetch('http://192.168.180.15/php/PatientNotesDetail.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ p_id, Notes_Index: note.Notes_Index, Notes: noteContent, notes_date: note.notes_date }),
            });

            console.log('Save response status:', response.status);
            const data = await response.json();
            console.log('Save response data:', data);

            if (data.success) {
                Alert.alert('Success', 'Patient note saved successfully');
                setIsEditing(false);
                setIsNoteFound(true);
            } else {
                Alert.alert('Error', 'Failed to save patient note');
            }
        } catch (error) {
            console.error('Save error:', error);
            Alert.alert('Error', 'Failed to save patient note');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Feather name="edit-3" size={24} color="black" style={styles.titleIcon} />
                <Text style={styles.title}>Patient Note Details</Text>
            </View>
            <ScrollView style={styles.scrollView}>
                {isEditing || !isNoteFound ? (
                    <TextInput
                        style={styles.textArea}
                        value={noteContent}
                        onChangeText={setNoteContent}
                        multiline
                        placeholder="Enter patient note"
                    />
                ) : (
                    <Text style={styles.noteText}>{noteContent}</Text>
                )}
                {isNoteFound && !isEditing && (
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => setIsEditing(true)}
                    >
                        <FontAwesome name="pencil-square-o" size={30} color="white" beat />
                    </TouchableOpacity>
                )}
                {(isEditing || !isNoteFound) && (
                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={handleSave}
                    >
                        <Text style={styles.buttonText}>Save</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#ffffff',
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 70,
        marginBottom: 20,
    },
    titleIcon: {
        marginRight: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    scrollView: {
        flex: 1,
    },
    noteText: {
        fontSize: 18,
        lineHeight: 24,
        textAlign: 'justify',
    },
    textArea: {
        height: 700,
        justifyContent: 'flex-start',
        textAlignVertical: 'top',
        borderColor: '#cccccc',
        borderWidth: 4,
        padding: 10,
        fontSize: 18,
        textAlign: 'justify',
        marginBottom: 20,
    },
    editButton: {
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 50,
        alignItems: 'center',
        marginTop: 20,
        justifyContent: 'center',
        marginVertical: 10,
        width: 70,
        height: 70,
        left: 160,
    },
    saveButton: {
        backgroundColor: '#28a745',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: 'center',
        width: 90,
        left: 150,
    },
    buttonText: {
        fontSize: 18,
        color: '#ffffff',
    },
});

export default PatientNoteDetails;
