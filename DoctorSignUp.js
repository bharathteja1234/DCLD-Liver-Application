import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather, FontAwesome, MaterialIcons } from '@expo/vector-icons';

const DoctorSignUp = () => {
  const navigation = useNavigation();
  const [doctorName, setDoctorName] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [reenterPassword, setReenterPassword] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [patientDetails, setPatientDetails] = useState({
    gender: '',
    speciality: '',
    contactNo: ''
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [reenterPasswordVisible, setReenterPasswordVisible] = useState(false);

  const signUpApiUrl = 'http://192.168.180.15/php/DoctorSignup.php';

  const handleSignUp = () => {
    if (!doctorName || !doctorId || !username || !password || !passwordMatch) {
      showAlert('Please fill in all required fields and ensure passwords match.');
      return;
    }

    fetch(signUpApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        doctorName, 
        doctorId, 
        username, 
        password, 
        ...patientDetails 
      }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Sign Up Response:', data);
        if (data.status) {
          setModalVisible(true);
        } else {
          showAlert('Sign up failed. Please try again.');
        }
      })
      .catch(error => {
        console.error('Sign Up Error:', error);
        showAlert('Sign up failed. Please try again later.');
      });
  };

  const showAlert = (message) => {
    Alert.alert('Status', message);
  };

  const handleReenterPasswordChange = (text) => {
    setReenterPassword(text);
    setPasswordMatch(password === text);
  };

  const handleInputChange = (field, value) => {
    setPatientDetails({
      ...patientDetails,
      [field]: value,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.arrowContainer} onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={30} color="black" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Doctor Sign Up</Text>
      </View>
      <View style={styles.elevatedContainer}>
        <View style={styles.inputContainer}>
          <Feather name="user" size={20} color="gray" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Doctor ID"
            onChangeText={text => setDoctorId(text)}
            value={doctorId}
          />
        </View>
        <View style={styles.inputContainer}>
          <Feather name="user" size={20} color="gray" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Doctor Name"
            onChangeText={text => setDoctorName(text)}
            value={doctorName}
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
        </View>
        <View style={styles.inputContainer}>
          <MaterialIcons name="medical-services" size={20} color="gray" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Speciality"
            onChangeText={text => handleInputChange('speciality', text)}
            value={patientDetails.speciality}
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
        <View style={styles.inputContainer}>
          <Feather name="user" size={20} color="gray" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Username"
            onChangeText={text => setUsername(text)}
            value={username}
          />
        </View>
        <View style={styles.inputContainer}>
          <Feather name="lock" size={20} color="gray" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            onChangeText={text => setPassword(text)}
            value={password}
            secureTextEntry={!passwordVisible}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setPasswordVisible(!passwordVisible)}
          >
            <Feather name={passwordVisible ? "eye-off" : "eye"} size={20} color="gray" />
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <Feather name="lock" size={20} color="gray" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Re-enter Password"
            onChangeText={handleReenterPasswordChange}
            value={reenterPassword}
            secureTextEntry={!reenterPasswordVisible}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setReenterPasswordVisible(!reenterPasswordVisible)}
          >
            <Feather name={reenterPasswordVisible ? "eye-off" : "eye"} size={20} color="gray" />
          </TouchableOpacity>
        </View>
        {!passwordMatch && <Text style={styles.errorText}>Passwords do not match</Text>}
        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Sign up successful, please log in now</Text>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                setModalVisible(!modalVisible);
                navigation.navigate('DoctorLogin');
              }}
            >
              <Text style={styles.textStyle}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  topBar: {
    width: '100%',
    height: 130,
    backgroundColor: '#90c1F9',
    justifyContent: 'center',
    borderRadius: 30,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  arrowContainer: {
    position: 'absolute',
    left: 10,
    top: 70,
  },
  topBarTitle: {
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    top: 20,
    flex: 1,
  },
  elevatedContainer: {
    flex: 1,
    margin: 20,
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'gray',
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
    height:35,
  },
  icon: {
    marginRight: 5,
  },
  eyeIcon: {
    marginLeft: 5,
  },
  genderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  genderLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  genderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'gray',
    marginHorizontal: 5,
  },
  genderButtonSelected: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  genderButtonText: {
    marginLeft: 5,
    fontSize: 16,
  },
  genderButtonTextSelected: {
    color: '#fff',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default DoctorSignUp;
