import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking, ScrollView } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

const videos = [
  {
    title: 'Know About Liver',
    image: require('./assets/te4G7d6wFWE-HD.jpg'),
    link: 'https://youtube.com/playlist?list=PLyBdFdoZ2XWL0tvRxsCR89dJzyhR17T7Z&si=lpneCLnBXRWaBAmi', 
  },
  {
    title: 'Diets for Decompensated Patients',
    image: require('./assets/pxwZ2PsN8ko-HD.jpg'), 
    link: 'https://youtube.com/shorts/pxwZ2PsN8ko?si=a1RrcY1ikg9Ne2s1', 
  },
  {
    title: 'Can You Survive with Liver Cirrhosis',
    image: require('./assets/DrdH04QZijo-HD.jpg'), 
    link: 'https://youtube.com/shorts/DrdH04QZijo?si=jcGNTdrWi-cetmg9', 
  },
  {
    title: 'Foods For Liver Cirrhosis Patients',
    image: require('./assets/ukgrM3HRumg-HD.jpg'), 
    link: 'https://youtube.com/shorts/ukgrM3HRumg?si=u3UZiYqKNwJ2RVV3',
  },
  {
    title: 'What is Compensated VS Decompensated Liver ',
    image: require('./assets/f50vu0j7FKs-HD.jpg'), 
    link: 'https://youtube.com/watch?v=f50vu0j7FKs', 
  },
];

const openYouTubeLink = (link) => {
  Linking.openURL(link).catch(err => console.error("Couldn't load page", err));
};

const VideoScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="chevron-left" size={30} color="black" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Diet Information</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.elevatedContainer}>
          {videos.map((video, index) => (
            <View key={index} style={styles.videoContainer}>
              <Text style={styles.heading}>{video.title}</Text>
              <TouchableOpacity onPress={() => openYouTubeLink(video.link)}>
                <Image source={video.image} style={styles.image} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
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
    height: 110,
    backgroundColor: '#90c1F9',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginBottom: 10,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  backButton: {
    position: 'absolute',
    left: 15,
    top: 60,
  },
  topBarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    top: 20,
  },
  scrollViewContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
  elevatedContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    width: '95%',
    alignItems: 'center',
  },
  videoContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  image: {
    width: 400,
    height: 200,
    borderRadius: 10,
  },
});

export default VideoScreen;
