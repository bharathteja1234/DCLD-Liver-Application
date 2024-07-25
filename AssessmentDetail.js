import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import axios from 'axios';

const AssessmentDetail = ({ route }) => {
  const { p_id, assessment_date } = route.params;
  const [assessment, setAssessment] = useState(null);

  useEffect(() => {
    console.log('Received ', p_id, assessment_date); 
  }, [p_id]);

  useEffect(() => {
    const fetchAssessmentDetail = async () => {
      try {
        const response = await axios.get(`http://192.168.180.15/php/response_detail.php?p_id=${p_id}&assessment_date=${assessment_date}`);
        if (response.data.error) {
          throw new Error(response.data.error);
        }
        setAssessment(response.data);
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Failed to fetch assessment details');
      }
    };

    fetchAssessmentDetail();
  }, [p_id, assessment_date]);

  if (!assessment) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Assessment Detail</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.detailBox}>
          <Text style={styles.label}>Salt Restriction Diet:</Text>
          <Text style={styles.value}>{assessment.saltRestrictionDiet}</Text>
        </View>
        <View style={styles.detailBox}>
          <Text style={styles.label}>Fluid Restriction Diet:</Text>
          <Text style={styles.value}>{assessment.fluidRestrictionDiet}</Text>
        </View>
        <View style={styles.detailBox}>
          <Text style={styles.label}>Weight Monitoring:</Text>
          <Text style={styles.value}>{assessment.weightMonitoring}</Text>
        </View>
        <View style={styles.detailBox}>
          <Text style={styles.label}>Alcohol Misuse:</Text>
          <Text style={styles.value}>{assessment.alcoholMisuse}</Text>
        </View>
        <View style={styles.detailBox}>
          <Text style={styles.label}>Behavioral Changes:</Text>
          <Text style={styles.value}>{assessment.behavioralChanges}</Text>
        </View>
        {assessment.behavioralChanges !== 'No' && (
          <View style={styles.detailBox}>
            <Text style={styles.label}>Behavioral Changes Notes:</Text>
            <Text style={styles.value}>{assessment.behavioralChangesNotes}</Text>
          </View>
        )}
        <View style={styles.detailBox}>
          <Text style={styles.label}>BP:</Text>
          <Text style={styles.value}>{assessment.bp}</Text>
        </View>
        <View style={styles.detailBox}>
          <Text style={styles.label}>CBG:</Text>
          <Text style={styles.value}>{assessment.cbg}</Text>
        </View>
        <View style={styles.detailBox}>
          <Text style={styles.label}>Slept Time:</Text>
          <Text style={styles.value}>{assessment.sleptTime}</Text>
        </View>
        <View style={styles.detailBox}>
          <Text style={styles.label}>Stools Passed:</Text>
          <Text style={styles.value}>{assessment.stoolsPassed}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F8F9FA',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    marginTop: 40,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  detailBox: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: '#555',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AssessmentDetail;
