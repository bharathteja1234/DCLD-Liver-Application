import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import LogoutNotification from './LogoutNotification';

const { width } = Dimensions.get('window');

const Dashboard = ({ route }) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [logoutVisible, setLogoutVisible] = useState(false);

  const { p_id } = route.params;

  useEffect(() => {
    console.log('Received in dash p_id:', p_id);
  }, [p_id]);

  const images = [
    { uri: 'https://i.pinimg.com/originals/e2/af/94/e2af94b7d5d4892c2343f34905019a8a.gif' },
    { uri: 'https://media.istockphoto.com/id/475964404/photo/realistic-human-liver-illustration.jpg?s=612x612&w=0&k=20&c=7wYX0KeuMEIM-mqd9N0x6vLmH0gnS_tcFbhqidnY0jg=' },
    { uri: 'https://media.istockphoto.com/id/621271062/photo/realistic-illustration-of-cirrhosis-of-human-liver.jpg?s=612x612&w=0&k=20&c=MxYWKDbV81yNR7jYPEzxtQBeXuIFknmKK7jelVsdOEw=' },
    { uri: 'https://relamshospital.com/wp-content/uploads/2022/06/img_v2_8057db7c-fbd9-42de-b069-85ca5f7185ah.webp' },
  ];

  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.floor(offsetX / width);
    setCurrentIndex(newIndex);
  };

  const handleLogout = () => {
    setLogoutVisible(true);
  };

  const confirmLogout = () => {
    setLogoutVisible(false);
    navigation.navigate('PatientLogin');
  };

  const cancelLogout = () => {
    setLogoutVisible(false);
  };

  const handleProfilePress = () => {
    navigation.navigate('ProfileScreen', { p_id });
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.profileIcon} onPress={handleProfilePress}>
          <Feather name="user" size={35} color="black" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Dashboard</Text>
      </View>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {images.map((image, index) => (
          <View key={index} style={styles.imageFrame}>
            <Image
              source={{ uri: image.uri }}
              style={styles.image}
            />
          </View>
        ))}
      </ScrollView>
      <View style={styles.dotsContainer}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentIndex === index ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('PatientDischargeSummary', { p_id })}
      >
        <Text style={styles.buttonText}>Discharge Summary</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('PatientMedication', { p_id })}
      >
        <Text style={styles.buttonText}>Medication</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('FollowUp', { p_id })}
      >
        <Text style={styles.buttonText}>Follow-Up</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.bottomIcon} onPress={() => navigation.navigate('Home')}>
          <Feather name="home" size={30} color="#007bff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomIcon} onPress={() => {/* Add calendar logic here */}}>
          <Feather name="calendar" size={30} color="#007bff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomIcon} onPress={handleLogout}>
          <MaterialCommunityIcons name="logout" size={30} color="#007bff" />
        </TouchableOpacity>
      </View>
      <LogoutNotification 
        visible={logoutVisible} 
        onConfirm={confirmLogout} 
        onCancel={cancelLogout} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
  },
  topBar: {
    width: '100%',
    height: 120,
    backgroundColor: '#90c1F9',
    flexDirection: 'row',
    borderRadius: 20,
    alignItems: 'center',
    paddingHorizontal: 20,
    elevation: 2,
  },
  profileIcon: {
    marginRight: 120,
    marginTop: 20,
  },
  topBarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 30,
    color: 'black',
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  imageFrame: {
    width: width,
    height: 500,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 400,
    height: 300,
    borderRadius: 10,
    resizeMode: 'contain',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -250,
    marginBottom: 90,
    backgroundColor: 'white',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#007bff',
  },
  inactiveDot: {
    backgroundColor: '#ccc',
  },
  button: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    height: 50,
    marginTop: 5,
    marginBottom: 20,
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: '#007bff',
    marginHorizontal: 20,
    marginTop: 20,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#007bff',
    borderRadius: 25,
  },
  bottomIcon: {
    flex: 1,
    alignItems: 'center',
  },
  homeButton: {
    borderColor: '#fff',
    borderWidth: 2,
    borderRadius: 25,
    backgroundColor: '#007bff',
  },
  logoutText: {
    color: 'red',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Dashboard;
