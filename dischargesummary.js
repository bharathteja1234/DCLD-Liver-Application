import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';

const DischargeSummary = ({ route }) => {
    const { p_id } = route.params;
    const [dischargeSummaries, setDischargeSummaries] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        fetchDischargeSummaries();
    }, []);

    const fetchDischargeSummaries = async () => {
        try {
            const response = await fetch(`http://192.168.180.15/php/dischargesummary.php?p_id=${p_id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch discharge summaries');
            }
            const data = await response.json();
            const filteredSummaries = data.filter(summary => summary.date !== null);
            setDischargeSummaries(filteredSummaries);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to fetch discharge summaries');
        }
    };

    const handleAddDischargeSummary = async () => {
        try {
            const currentDate = new Date().toISOString().split('T')[0]; 
            const newSummary = { discharge_summary: `Discharge Summary ${dischargeSummaries.length + 1}`, date: currentDate };

            const response = await fetch('http://192.168.180.15/php/dischargesummary.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ p_id, ...newSummary }),
            });

            if (!response.ok) {
                throw new Error('Failed to add new discharge summary');
            }

            const data = await response.json();
            if (data.date !== null) {
                setDischargeSummaries([...dischargeSummaries, data]);
                Alert.alert('Success', 'New discharge summary added successfully');
            } else {
                Alert.alert('Error', 'Failed to add new discharge summary: Invalid date');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to add new discharge summary');
        }
    };

    const handleDeleteDischargeSummary = async (summary) => {
        try {
            const response = await fetch('http://192.168.180.15/php/dischargesummary.php', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ p_id, discharge_summary: summary }),
            });

            if (!response.ok) {
                throw new Error('Failed to delete discharge summary');
            }

            setDischargeSummaries(dischargeSummaries.filter(ds => ds.discharge_summary !== summary));
            Alert.alert('Success', 'Discharge summary deleted successfully');
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to delete discharge summary');
        }
    };

    const navigateToSummaryDetails = (summary) => {
        navigation.navigate('Summary', { p_id, summary });
    };

    if (!dischargeSummaries || !Array.isArray(dischargeSummaries)) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Discharge Summaries</Text>
            <ScrollView contentContainerStyle={styles.summaryList}>
                {dischargeSummaries.map((summary, index) => (
                    <View key={index} style={index % 2 === 0 ? styles.summaryItemLeft : styles.summaryItemRight}>
                        <TouchableOpacity
                            style={styles.summaryDetailsButton}
                            onPress={() => navigateToSummaryDetails(summary)}
                        >
                            <Text style={styles.summaryText}>{summary.discharge_summary}</Text>
                            <Text style={styles.dateText}>{`Date: ${summary.date}`}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => handleDeleteDischargeSummary(summary.discharge_summary)}
                        >
                            <Feather name="trash-2" size={20} color="black" />
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
            <TouchableOpacity style={styles.addButton} onPress={handleAddDischargeSummary}>
                <Text style={styles.buttonText}>Add New Discharge Summary</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        paddingTop: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 90,
        marginBottom: 20,
        left:100,
    },
    summaryList: {
        width: '100%',
        paddingBottom: 20,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    summaryDetailsButton: {
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
        height: 90,
    },
    summaryItemLeft: {
        width: '48%',
        marginBottom: 10,
    },
    summaryItemRight: {
        width: '48%',
        marginBottom: 10,
        alignSelf: 'flex-end',
    },
    deleteButton: {
        marginTop: 10,
        width: 55,
        alignItems: 'baseline',
        top: -100,
        left: 150,
        marginBottom:40,
    },
    addButton: {
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginBottom: 30,
        width:270,
        alignItems:'center',
        left:80,
    },
    buttonText: {
        fontSize: 18,
        color: '#ffffff',
    },
    summaryText: {
        fontSize: 16,
        textAlign: 'center',
    },
    dateText: {
        fontSize: 14,
        marginTop: 5,
        textAlign: 'center',
        color:"white",
    },
});

export default DischargeSummary;
