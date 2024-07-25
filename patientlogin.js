import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ActivityIndicator, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const PatientLogin = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

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

  const loginApiUrl = 'http://192.168.180.15/php/patientlogin.php';

  const handleLogin = async () => {
    if (!username || !password) {
      showAlert('Please enter both username and password.');
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await fetch(loginApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      console.log('Login Response:', data);
  
      if (data.status) {
        const { p_id } = data;
        navigation.navigate('PatientDashboard', { p_id, profile: data.profile });
      } else {
        showAlert('Invalid username or password. Please try again.');
      }
    } catch (error) {
      console.error('Login Error:', error);
      showAlert('Login failed. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message) => {
    Alert.alert('Status', message);
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.colorBox, { transform: [{ translateY }] }]} />
      <Image
        source={{ uri: 'https://img.freepik.com/free-vector/doctor-examining-patient-clinic_23-2148853674.jpg' }}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.heading}>Patient Login</Text>
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <Feather name="user" size={20} color="gray" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Username"
            onChangeText={text => setUsername(text)}
            value={username}
            autoCapitalize="none"
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
      <TouchableOpacity
        style={[styles.button, { opacity: loading ? 0.5 : 1 }]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>
      <Text style={styles.signupText}>Don't have an account? Contact Doctor.</Text>
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
    position: 'relative',
  },
  colorBox: {
    width: 200,
    height: 200,
    borderRadius: 200,
    backgroundColor: '#007bff',
    position: 'absolute',
    top: -50,
    right: -50,
    zIndex: -1,
  },
  colorBox1: {
    width: 200,
    height: 200,
    borderRadius: 200,
    backgroundColor: '#007bff',
    position: 'absolute',
    bottom: -50,
    left: -50,
    zIndex: -1,
  },
  logo: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  heading: {
    fontSize: 26,
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
    alignItems: 'center',
    width: '20%',
    marginVertical: 20,
    marginTop:-5
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 19,
    fontWeight: 'bold',
  },
  signupText: {
    marginTop: 10,
    fontSize: 16,
    marginTop:-5,
    color: '#777777',
  },
});

export default PatientLogin;
