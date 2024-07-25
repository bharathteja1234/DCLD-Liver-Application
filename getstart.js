import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Canvas } from '@react-three/fiber/native';
import { useGLTF } from '@react-three/drei';
import { Asset } from 'expo-asset';

function Model(props) {
  const { nodes, materials } = useGLTF(Asset.fromModule(require('./assets/liver_0328083339_refine.glb')).uri);
  return <primitive object={nodes} />;
}


const GetStarted = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Welcome to Liver Animation App</Text>
      </View>
      <View style={styles.canvasContainer}>
        <Canvas style={styles.canvas}>
          <ambientLight intensity={1} />
          <Model />
          <OrbitControls />
        </Canvas>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  canvasContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ccc', // Adjust background color as needed
  },
  canvas: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

export default GetStarted;
