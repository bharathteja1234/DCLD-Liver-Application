import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather'; // Import Feather icon

const Summary = ({ route }) => {
    const { p_id, summary } = route.params;
    const [dischargeSummary, setDischargeSummary] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [isSummaryFound, setIsSummaryFound] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        fetchDischargeSummary();
    }, []);

    const fetchDischargeSummary = async () => {
        try {
            const response = await fetch(`http://192.168.180.15/php/summary.php?p_id=${p_id}&discharge_summary=${summary.discharge_summary}&date=${summary.date}`);
            if (!response.ok) {
                throw new Error('Failed to fetch discharge summary');
            }
            const data = await response.json();
            if (data && data.summary) {
                setDischargeSummary(data.summary);
                setIsSummaryFound(true);
            } else {
                setIsSummaryFound(false);
                Alert.alert('Notice', 'Discharge summary not found. Please add a summary.');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to fetch discharge summary');
        }
    };

    const handleSave = async () => {
        try {
            const response = await fetch('http://192.168.180.15/php/summary.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ p_id, discharge_summary: summary.discharge_summary, summary: dischargeSummary, date: summary.date }),
            });

            if (!response.ok) {
                throw new Error('Failed to save discharge summary');
            }

            const data = await response.json();
            if (data.success) {
                Alert.alert('Success', 'Discharge summary saved successfully');
                setIsEditing(false);
                setIsSummaryFound(true);
            } else {
                Alert.alert('Error', 'Failed to save discharge summary');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to save discharge summary');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Discharge Summary</Text>
            <ScrollView style={styles.scrollView}>
                {isEditing || !isSummaryFound ? (
                    <TextInput
                        style={styles.textArea}
                        value={dischargeSummary}
                        onChangeText={setDischargeSummary}
                        multiline
                        placeholder="Enter discharge summary"
                    />
                ) : (
                    <Text style={styles.summaryText}>{dischargeSummary}</Text>
                )}
                {isSummaryFound && !isEditing && (
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => setIsEditing(true)}
                    >
                        <Feather name="edit" size={24} color="white" />
                    </TouchableOpacity>
                )}
                {(isEditing || !isSummaryFound) && (
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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 70,
        marginBottom: 20,
        textAlign: 'center',
    },
    scrollView: {
        flex: 1,
    },
    summaryText: {
        fontSize: 18,
        lineHeight: 24,
        textAlign:'justify',

    },
    textArea: {
        height: 700,
        justifyContent: 'flex-start',
        textAlignVertical: 'top',
        borderColor: '#cccccc',
        borderWidth: 4,
        padding: 10,
        fontSize: 18,
        textAlign:'justify',
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
        width:90,
        left:150,
    },
    buttonText: {
        fontSize: 18,
        color: '#ffffff',
    },
});

export default Summary;
