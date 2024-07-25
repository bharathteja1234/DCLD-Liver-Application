import React, { useState, useEffect } from 'react';
import { View, Text, Alert, ActivityIndicator, StyleSheet } from 'react-native';

const PDischargeSummary = () => {
    const [dischargeSummary, setDischargeSummary] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchDischargeSummary();
    }, []);

    const fetchDischargeSummary = async () => {
        try {
            const response = await fetch('http://192.168.176.15.15/php/p_discharge.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: 'patient_username',
                    password: 'patient_password'
                })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }

            setDischargeSummary(data.discharge_summary);
            setIsLoading(false);
        } catch (error) {
            console.error('There was a problem fetching the discharge summary:', error);
            Alert.alert('Error', 'Failed to fetch discharge summary. Please try again later.');
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Discharge Summary</Text>
            {isLoading ? (
                <ActivityIndicator size="large" color="#007bff" />
            ) : (
                <View style={styles.box}>
                    <Text>{dischargeSummary}</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20
    },
    box: {
        borderWidth: 5,
        borderColor: '#ccc',
        padding: 20,
        borderRadius: 10,
        width: 350,
        height: 500,
        marginBottom: 20
    }
});

export default PDischargeSummary;
