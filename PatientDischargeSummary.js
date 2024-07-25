import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faNotesMedical } from '@fortawesome/free-solid-svg-icons';

const PatientDischargeSummary = ({ route }) => {
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
            // Filter out summaries where date is not null
            const filteredSummaries = data.filter(summary => summary.date !== null);
            setDischargeSummaries(filteredSummaries);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to fetch discharge summaries');
        }
    };

    const navigateToSummaryDetails = (summary) => {
        navigation.navigate('SummaryDetails', { p_id, summary });
    };

    const renderSummaryItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => navigateToSummaryDetails(item)}
            style={styles.summaryItem}
        >
            <FontAwesomeIcon icon={faNotesMedical} size={50} style={styles.icon} />
            <View style={styles.textContainer}>
                <Text style={styles.summaryText}>{item.discharge_summary}</Text>
                <Text style={styles.summaryText1}>{`Date: ${item.date}`}</Text>
            </View>
        </TouchableOpacity>
    );

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
            <FlatList
                data={dischargeSummaries}
                renderItem={renderSummaryItem}
                keyExtractor={(item, index) => index.toString()}
                numColumns={2}
                contentContainerStyle={styles.summaryList}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        paddingTop: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        marginTop:60,
    },
    summaryList: {
        width: '90%',
        justifyContent: 'space-between',
    },
    summaryItem: {
        padding: 10,
        borderWidth: 2,
        borderColor: '#90c1F9',
        borderRadius: 10,
        marginBottom: 20,
        backgroundColor: '#90c1F9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        flexDirection: 'row',
        alignItems: 'center',
        width: '45%',
        marginHorizontal: '2.5%',
        height:150,
    },
    icon: {
        marginTop:60,
        marginRight: 10,
        right:-50,
        top:-60,
    },
    textContainer: {
        flex: 1,
    },
    summaryText: {
        fontSize: 16,
        left:-50,
        marginTop:70,
    },
    summaryText1: {
        fontSize: 16,
        color: '#555',
        left:-50,
    },
});

export default PatientDischargeSummary;
