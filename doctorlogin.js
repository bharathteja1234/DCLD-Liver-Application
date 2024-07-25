import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const DoctorLogin = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [dId, setDId] = useState(null);

  const loginApiUrl = 'http://192.168.180.15/php/doctorlogin.php';

  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: -10,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 10,
          duration: 3000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [translateY]);

  const handleLogin = () => {
    fetch(loginApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Login Response:', data);
        if (data.status) {
          setDId(data.d_id);
          console.log('Logged in with d_id:', data.d_id);
          navigation.navigate('DoctorDashboard', { dId: data.d_id });
        } else {
          showAlert('Invalid username or password. Please try again.');
        }
      })
      .catch(error => {
        console.error('Login Error:', error);
        showAlert('Login failed. Please try again later.');
      });
  };

  const showAlert = (message) => {
    Alert.alert('Status', message);
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.colorBox, { transform: [{ translateY }] }]} />
      <Image
        source={{ uri: 'https://img.freepik.com/premium-vector/flat-illustration-with-liver-white-background-medical-design-characters-cartoon-style_194782-1327.jpg?w=2000' }}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.heading}>Doctor Login</Text>
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <Feather name="user" size={20} color="gray" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Username"
            onChangeText={text => setUsername(text)}
            value={username}
          />
        </View>
        <View style={styles.inputWrapper}>
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
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('DoctorSignUp')}>
          <Text style={styles.signupTextLink}>Sign up.</Text>
        </TouchableOpacity>
      </View>
      <Animated.View style={[styles.colorBox1, { transform: [{ translateY }] }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  colorBox: {
    width: 200,
    height: 200,
    borderRadius: 200,
    backgroundColor: '#007bff',
    marginBottom: 20,
    marginTop: -250,
    marginLeft: 300,
  },
  colorBox1: {
    width: 200,
    height: 200,
    borderRadius: 200,
    backgroundColor: '#007bff',
    marginBottom: 20,
    marginTop: -250,
    right: 150,
    bottom: -300,
  },
  logo: {
    width: 300,
    height: 270,
    marginBottom: 10,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    width: '70%',
    marginVertical: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'gray',
    borderWidth: 2,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  input: {
    flex: 1,
    height: 35,
    fontSize: 16,
  },
  icon: {
    marginRight: 10,
  },
  eyeIcon: {
    marginLeft: 10,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: -5,
    alignItems: 'center',
    width: '20%',
    marginVertical: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 19,
    fontWeight: 'bold',
  },
  signupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginTop: -5,
  },
  signupText: {
    fontSize: 14,
    color: '#777777',
  },
  signupTextLink: {
    fontSize: 18,
    color: '#007bff',
    marginLeft: 5,
  },
});

export default DoctorLogin;
