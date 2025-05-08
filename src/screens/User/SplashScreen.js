import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Text, ImageBackground } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { COLORS } from '../utils/colors';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace('Auth');
    }, 3000);
  }, [navigation]);

  return (
    <ImageBackground
      source={require('../../../assets/image/background_medical.png')}
      style={styles.container}
    >
      <Animatable.View animation="zoomIn" style={styles.logoContainer}>
        <Image
          source={require('../../../assets/image/logo1.jpg')}
          style={styles.logo}
        />
      </Animatable.View>
      <Animatable.Text animation="fadeInUp" style={styles.title}>
        Bienvenue sur ECGApp
      </Animatable.Text>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 30,
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    textShadowColor: COLORS.shadow,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
});

export default SplashScreen;