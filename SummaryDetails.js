import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';

const SummaryDetails = ({ route }) => {
    const { p_id, summary } = route.params;
    const [dischargeSummary, setDischargeSummary] = useState('');
    const [isSummaryFound, setIsSummaryFound] = useState(false);

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
                
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to fetch discharge summary');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Discharge Summary</Text>
            <ScrollView style={styles.scrollView}>
                {isSummaryFound ? (
                    <Text style={styles.summaryText}>{dischargeSummary}</Text>
                ) : (
                    <Text style={styles.noticeText}>No discharge summary found.</Text>
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
        textAlign: 'justify',
        padding: 10,
        borderColor: '#007bff',
        borderWidth: 3,
        borderRadius: 10,
    },
    noticeText: {
        fontSize: 18,
        color: '#ff0000',
        textAlign: 'center',
    },
});

export default SummaryDetails;
