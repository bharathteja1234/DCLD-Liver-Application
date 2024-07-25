import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, Image, TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

const EditPatientDetailsScreen = ({ route, navigation }) => {
  const { p_id } = route.params; // Assuming the p_id is passed via route params
  const [currentPage, setCurrentPage] = useState(1); // State variable to manage current page
  const [patientDetails, setPatientDetails] = useState({
    p_id: p_id,
    username: '',
    name: '',
    age: '',
    contactNo: '',
    disease: '',
    gender: '',
    admittedOn: '',
    dischargeOn: '',
    Treatment_Given: '', // New state variable for Treatment Given
    Course_in_Hospital: '', // New state variable for Course in Hospital
  });

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const response = await fetch(`http://192.168.180.15/php/search.php?p_id=${p_id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch patient details');
        }
        const data = await response.json();
        setPatientDetails(data);
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Failed to fetch patient details');
      }
    };

    fetchPatientDetails();
  }, [p_id]);

  const fetchAndUpdatePatientDetails = async () => {
    try {
      const response = await fetch('http://192.168.180.15/php/update.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patientDetails),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update patient details');
      }

      const data = await response.json();
      setPatientDetails(data);
      Alert.alert('Success', 'Patient details updated successfully');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to update patient details');
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 1:
        return (
          <View style={styles.pageContainer}>
            <Image 
              source={{ uri: 'https://cdn.dribbble.com/users/6498639/screenshots/15142979/media/4018bc54be33f8aae19fef3d64efdf6e.gif' }}
              resizeMode="cover"
              style={styles.image}
            />
            <View style={styles.elevatedContainer}>
              
              <View style={styles.inputContainer}>
                <Feather name="user" size={20} color="gray" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Name"
                  value={patientDetails.name}
                  onChangeText={(value) => setPatientDetails({ ...patientDetails, name: value })}
                />
              </View>
              <View style={styles.inputContainer}>
                <Feather name="calendar" size={20} color="gray" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Age"
                  value={patientDetails.age}
                  onChangeText={(value) => setPatientDetails({ ...patientDetails, age: value })}
                />
              </View>
              <View style={styles.inputContainer}>
                <Feather name="phone" size={20} color="gray" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Contact Number"
                  value={patientDetails.contactNo}
                  onChangeText={(value) => setPatientDetails({ ...patientDetails, contactNo: value })}
                />
              </View>
              <View style={styles.inputContainer}>
                <Feather name="activity" size={20} color="gray" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Disease"
                  value={patientDetails.disease}
                  onChangeText={(value) => setPatientDetails({ ...patientDetails, disease: value })}
                />
              </View>
              <View style={styles.inputContainer}>
                <Feather name="user-check" size={20} color="gray" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Gender"
                  value={patientDetails.gender}
                  onChangeText={(value) => setPatientDetails({ ...patientDetails, gender: value })}
                />
              </View>

              <View style={styles.navigationButtonsContainer}>
                <TouchableOpacity style={styles.navigationButton1} onPress={() => setCurrentPage(2)}>
                  <Feather name="chevrons-right" size={24} color="#ffffff" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.pageContainer}>
            <View style={styles.elevatedContainer}>
              <View style={styles.inputContainer}>
                <Feather name="calendar" size={20} color="gray" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Admitted On"
                  value={patientDetails.admittedOn}
                  onChangeText={(value) => setPatientDetails({ ...patientDetails, admittedOn: value })}
                />
              </View>
              <View style={styles.inputContainer}>
                <Feather name="calendar" size={20} color="gray" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Discharged On"
                  value={patientDetails.dischargeOn}
                  onChangeText={(value) => setPatientDetails({ ...patientDetails, dischargeOn: value })}
                />
              </View>
              <View style={styles.inputContainer}>
                <Feather name="briefcase" size={20} color="gray" style={styles.icon} />
                <TextInput
                  style={styles.input1}
                  placeholder="Treatment Given in Hospital"
                  value={patientDetails.Treatment_Given}
                  onChangeText={(value) => setPatientDetails({ ...patientDetails, Treatment_Given: value })}
                />
              </View>
              <View style={styles.inputContainer}>
                <Feather name="file-text" size={20} color="gray" style={styles.icon} />
                <TextInput
                  style={styles.input1}
                  placeholder="Previous Medical History"
                  value={patientDetails.Course_in_Hospital}
                  onChangeText={(value) => setPatientDetails({ ...patientDetails, Course_in_Hospital: value })}
                />
              </View>
              <View style={styles.navigationButtonsContainer}>
                <TouchableOpacity style={styles.navigationButton3} onPress={() => setCurrentPage(1)}>
                  <Feather name="chevrons-left" size={20} color="#ffffff" />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.navigationButton2} onPress={fetchAndUpdatePatientDetails}>
              <Text style={styles.buttonText}>Update</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navigationButton} onPress={() => {
              navigation.navigate('DischargeSummary', { p_id });
            }}>
              <Feather name="file-text" size={20} color="#ffffff" />
              <Text style={styles.buttonText}>Discharge Summary</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navigationButton} onPress={() => {
              navigation.navigate('DoctorPatientNotes', { p_id });
            }}>
              <Feather name="clipboard" size={20} color="#ffffff" />
              <Text style={styles.buttonText}>Patient Notes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navigationButton} onPress={() => {
              navigation.navigate('Medication', { p_id });
            }}>
              <Feather name="plus-circle" size={20} color="#ffffff" />
              <Text style={styles.buttonText}>Add Medication</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navigationButton} onPress={() => {
              navigation.navigate('QuestionnaireResponses', { p_id });
            }}>
              <Feather name="message-square" size={20} color="#ffffff" />
              <Text style={styles.buttonText}>Questionnaire Responses</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navigationButton4} onPress={() => {
              navigation.navigate('DailyAssessResponses', { p_id });
            }}>
              <Feather name="activity" size={20} color="#ffffff" />
              <Text style={styles.buttonText}>Daily Assessment Responses</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navigationButton4} onPress={() => {
              navigation.navigate('ReportGraph', { p_id });
            }}>
              <Feather name="bar-chart-2" size={20} color="#ffffff" />
              <Text style={styles.buttonText}>Patient Report Graphs</Text>
            </TouchableOpacity>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="chevron-left" size={30} color="black" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Edit Patient Details</Text>
      </View>
      {renderPage()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  topBar: {
    width: '110%',
    height: 120,
    marginTop: -20,
    left: -20,
    backgroundColor: '#90c1F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    borderRadius: 60,
  },
  backButton: {
    position: 'absolute',
    left: 35,
    top: 70,
  },
  topBarTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    top: 30,
    color: 'black',
  },
  pageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 15,
  },
  image: {
    width: 300,
    height: 200,
    marginBottom: 20,
    marginTop: 70,
  },
  elevatedContainer: {
    width: '100%',
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'gray',
    borderWidth: 2,
    height:50,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
  },
  input1: {
    flex: 1,
    height: 120,
  },
  navigationButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  navigationButton: {
    backgroundColor: '#007bff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: 270,
    marginBottom: 10,
  },
  navigationButton4: {
    backgroundColor: '#007bff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: 270,
    marginBottom: 10,
  },
  navigationButton3: {
    backgroundColor: '#007bff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: 70,
    left: -140,
    marginBottom: 5,
  },
  navigationButton1: {
    backgroundColor: '#007bff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    left: 140,
    borderRadius: 10,
    marginBottom: 5,
    marginTop: 40,
    top: -40,
  },
  navigationButton2: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 40,
    top: 10,
  },
  buttonText: {
    fontSize: 18,
    color: '#ffffff',
    marginLeft: 5,
  },
});

export default EditPatientDetailsScreen;
