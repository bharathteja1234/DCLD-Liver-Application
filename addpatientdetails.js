import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, Modal, Button, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Feather, Entypo, FontAwesome, MaterialIcons } from '@expo/vector-icons';

const AddPatientDetails = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [patientDetails, setPatientDetails] = useState({
    p_id: '',
    username: '',
    password: '',
    name: '',
    contactNo: '',
    age: '',
    gender: '',
    disease: '',
    admittedOn: null,
    dischargeOn: null,
    Treatment_Given: '',
    Course_in_Hospital: '',
    imageUri: null,
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [showAdmittedOnPicker, setShowAdmittedOnPicker] = useState(false);
  const [showDischargeOnPicker, setShowDischargeOnPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const navigation = useNavigation();

  const handleInputChange = (name, value) => {
    setPatientDetails({ ...patientDetails, [name]: value });
  };

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (!result.canceled) {
        handleInputChange('imageUri', result.assets[0].uri); // Use result.assets[0].uri
      } else {
        console.log('Image selection canceled or failed.');
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again later.');
    }
  };
  

  const handleSubmit = async () => {
    const { p_id, username, password, name, contactNo, age, gender, disease, admittedOn, dischargeOn, Treatment_Given, Course_in_Hospital, imageUri } = patientDetails;

    if (!p_id || !username || !password || !name || !contactNo || !age || !gender || !disease || !admittedOn || !dischargeOn || !Treatment_Given || !Course_in_Hospital) {
      Alert.alert('All fields are required');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('p_id', p_id);
    formData.append('username', username);
    formData.append('password', password);
    formData.append('name', name);
    formData.append('contactNo', contactNo);
    formData.append('age', age);
    formData.append('gender', gender);
    formData.append('disease', disease);
    formData.append('admittedOn', admittedOn.toISOString().split('T')[0]);
    formData.append('dischargeOn', dischargeOn.toISOString().split('T')[0]);
    formData.append('Treatment_Given', Treatment_Given);
    formData.append('Course_in_Hospital', Course_in_Hospital);

    if (imageUri) {
      const fileName = imageUri.split('/').pop();
      formData.append('image', { uri: imageUri, name: fileName, type: 'image/jpeg' });
    }

    try {
      const response = await fetch('http://192.168.180.15/php/addpatientdetails.php', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setModalVisible(true); // Show success modal
        setPatientDetails({
          p_id: '',
          username: '',
          password: '',
          name: '',
          contactNo: '',
          age: '',
          gender: '',
          disease: '',
          admittedOn: null,
          dischargeOn: null,
          Treatment_Given: '',
          Course_in_Hospital: '',
          imageUri: null,
        });
      } else {
        Alert.alert('Error', 'Failed to add patient details. Please try again.');
      }

    } catch (error) {
      console.error('Error submitting form:', error);
      Alert.alert('Error', 'Failed to submit form. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const hideModal = () => {
    setModalVisible(false);
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="chevron-left" size={35} color="black" />
        </TouchableOpacity>
        <Text style={styles.topBarText}>Add Patient Details</Text>
      </View>
      <View style={styles.container}>
        {currentPage === 1 && (
          <View style={styles.frame}>
            <TouchableOpacity onPress={pickImage}>
              <View style={styles.input1}>
                {patientDetails.imageUri ? (
                  <Image source={{ uri: patientDetails.imageUri }} style={{ width: 200, height: 200, borderRadius: 100 }} />
                ) : (
                  <Text> + Upload image </Text>
                )}
              </View>
            </TouchableOpacity>
            <View style={styles.inputContainer}>
              <Feather name="user" size={20} color="gray" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Patient ID"
                onChangeText={text => handleInputChange('p_id', text)}
                value={patientDetails.p_id}
              />
            </View>
            <View style={styles.inputContainer}>
              <Feather name="user" size={20} color="gray" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Name"
                onChangeText={text => handleInputChange('name', text)}
                value={patientDetails.name}
              />
            </View>
            <View style={styles.inputContainer}>
              <Feather name="hash" size={20} color="gray" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Age"
                onChangeText={text => handleInputChange('age', text)}
                value={patientDetails.age}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.genderContainer}>
              <Text style={styles.genderLabel}>Gender:</Text>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  patientDetails.gender === 'Male' && styles.genderButtonSelected
                ]}
                onPress={() => handleInputChange('gender', 'Male')}
              >
                <FontAwesome
                  name="male"
                  size={20}
                  color={patientDetails.gender === 'Male' ? '#fff' : '#000'}
                />
                <Text style={[
                  styles.genderButtonText,
                  patientDetails.gender === 'Male' && styles.genderButtonTextSelected
                ]}> Male</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  patientDetails.gender === 'Female' && styles.genderButtonSelected
                ]}
                onPress={() => handleInputChange('gender', 'Female')}
              >
                <FontAwesome
                  name="female"
                  size={20}
                  color={patientDetails.gender === 'Female' ? '#fff' : '#000'}
                />
                <Text style={[
                  styles.genderButtonText,
                  patientDetails.gender === 'Female' && styles.genderButtonTextSelected
                ]}> Female</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  patientDetails.gender === 'Other' && styles.genderButtonSelected
                ]}
                onPress={() => handleInputChange('gender', 'Other')}
              >
                <MaterialIcons
                  name="transgender"
                  size={20}
                  color={patientDetails.gender === 'Other' ? '#fff' : '#000'}
                />
                <Text style={[
                  styles.genderButtonText,
                  patientDetails.gender === 'Other' && styles.genderButtonTextSelected
                ]}> Other</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.inputContainer}>
              <Feather name="activity" size={20} color="gray" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Disease Diagonized On"
                onChangeText={text => handleInputChange('disease', text)}
                value={patientDetails.disease}
              />
            </View>
            <View style={styles.inputContainer}>
              <Feather name="phone" size={20} color="gray" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Contact No"
                onChangeText={text => handleInputChange('contactNo', text)}
                value={patientDetails.contactNo}
                keyboardType="phone-pad"
              />
            </View>
            <View style={styles.datePickerContainer}>
              <TouchableOpacity
                style={styles.datePicker}
                onPress={() => setShowAdmittedOnPicker(true)}
              >
                <Feather name="calendar" size={20} color="gray" style={styles.icon} />
                <Text style={styles.datePickerText}>
                  {patientDetails.admittedOn
                    ? patientDetails.admittedOn.toDateString()
                    : 'Admitted On'}
                </Text>
              </TouchableOpacity>
              {showAdmittedOnPicker && (
                <DateTimePicker
                  value={patientDetails.admittedOn || new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowAdmittedOnPicker(false);
                    handleInputChange('admittedOn', selectedDate || patientDetails.admittedOn);
                  }}
                />
              )}
              <TouchableOpacity
                style={styles.datePicker}
                onPress={() => setShowDischargeOnPicker(true)}
              >
                <Feather name="calendar" size={20} color="gray" style={styles.icon} />
                <Text style={styles.datePickerText}>
                  {patientDetails.dischargeOn
                    ? patientDetails.dischargeOn.toDateString()
                    : 'Discharge On'}
                </Text>
              </TouchableOpacity>
              {showDischargeOnPicker && (
                <DateTimePicker
                  value={patientDetails.dischargeOn || new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowDischargeOnPicker(false);
                    handleInputChange('dischargeOn', selectedDate || patientDetails.dischargeOn);
                  }}
                />
              )}
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setCurrentPage(2)}
            >
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </View>
        )}
        {currentPage === 2 && (
          <View style={styles.frame}>
            
            <View style={styles.inputContainer1}>
              <FontAwesome name="medkit" size={20} color="gray" style={styles.icon} />
              <TextInput
                style={styles.input4}
                placeholder="Treatment Given"
                onChangeText={text => handleInputChange('Treatment_Given', text)}
                value={patientDetails.Treatment_Given}
              />
            </View>
            <View style={styles.inputContainer1}>
              <FontAwesome name="file-text" size={20} color="gray" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Course in Hospital"
                onChangeText={text => handleInputChange('Course_in_Hospital', text)}
                value={patientDetails.Course_in_Hospital}
              />
            </View>
            <View style={styles.headerContainer}>
          <Text style={styles.portalText}>Create Patient Portal Credentials</Text>
           </View>
            <View style={styles.inputContainer}>
              <FontAwesome name="user" size={20} color="gray" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Username"
                onChangeText={text => handleInputChange('username', text)}
                value={patientDetails.username}
              />
            </View>
            <View style={styles.inputContainer}>
              <Feather name="lock" size={20} color="gray" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry={!passwordVisible}
                onChangeText={text => handleInputChange('password', text)}
                value={patientDetails.password}
              />
              <TouchableOpacity
                onPress={() => setPasswordVisible(!passwordVisible)}
              >
                <Feather
                  name={passwordVisible ? 'eye' : 'eye-off'}
                  size={20}
                  color="gray"
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.backButton]}
              onPress={() => setCurrentPage(1)}
            >
              <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
            </View>
        )}
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Patient Details Added Successfully!</Text>
              <Button title="OK" onPress={hideModal} />
            </View>
          </View>
        </Modal>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    flex: 1,
    marginRight: 5,
  },
  datePickerText: {
    marginLeft: 10,
  },
  headerContainer: {
    backgroundColor: '#007bff',
    padding: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginTop: 25,
  },
  topBar: {
    width: '100%',
    height: 100,
    borderRadius:35,
    backgroundColor: '#9FCBFB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  backButton: {
    marginRight: 20,
  },
  topBarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginTop:20,
    left:10,
  },
  portalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginTop:20,
    marginBottom:20,
    left:10,
  },
  container: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor: '#f8f8f8',
  },
  frame: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
  },
  passwordInputContainer:{
    alignItems:'flex-start',
    width:'100%',
  },
  inputContainer1: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    height:80,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  input: {
    flex: 1,
    fontSize: 14,
  },
  icon: {
    marginRight: 10,
  },
  genderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  genderLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  genderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    marginHorizontal: 5,
  },
  genderButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  genderButtonText: {
    color: '#000',
    marginLeft: 5,
  },
  genderButtonTextSelected: {
    color: '#fff',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#9FCBFB',
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  input1: {
    backgroundColor: '#D9D9D9',
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    width: 200,
    height: 200,
    overflow: 'hidden',
    left:80,
  },
  passwordToggle: {
    marginLeft: 10,
  },
  textAreaContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
  },
  textArea: {
    flex: 1,
    fontSize: 16,
    height: 100,
    textAlignVertical: 'top',
  },
});

export default AddPatientDetails;
