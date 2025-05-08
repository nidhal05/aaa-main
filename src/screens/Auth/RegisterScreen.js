import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, StyleSheet, Image, ImageBackground, ActivityIndicator } from 'react-native';
import { useAuth } from '../../services/auth';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/FontAwesome';
import { COLORS } from '../../utils/colors';

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, user } = useAuth();

  useEffect(() => {
    if (user) {
      navigation.navigate('PredictionScreen');
    }
  }, [user, navigation]);

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword || !displayName) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);

    try {
      await register(email, password, displayName);
      Alert.alert('Succès', 'Compte créé avec succès', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (error) {
      Alert.alert('Erreur', error.message);
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../../../assets/image/background_medical.png')}
      style={styles.container}
    >
      <Animatable.View animation="bounceIn" style={styles.logoContainer}>
        <Image
          source={require('../../../assets/image/logo1.jpg')}
          style={styles.logo}
        />
        <Animatable.Text animation="fadeInDown" style={styles.title}>
          Créer un compte
        </Animatable.Text>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Icon name="user" size={20} color={COLORS.textLight} style={styles.icon} />
          <TextInput
            placeholder="Nom complet"
            value={displayName}
            onChangeText={setDisplayName}
            style={styles.input}
            placeholderTextColor={COLORS.textLight}
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="envelope" size={20} color={COLORS.textLight} style={styles.icon} />
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor={COLORS.textLight}
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="lock" size={20} color={COLORS.textLight} style={styles.icon} />
          <TextInput
            placeholder="Mot de passe"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            placeholderTextColor={COLORS.textLight}
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="lock" size={20} color={COLORS.textLight} style={styles.icon} />
          <TextInput
            placeholder="Confirmer le mot de passe"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            style={styles.input}
            placeholderTextColor={COLORS.textLight}
          />
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginVertical: 20 }} />
        ) : (
          <Animatable.View animation="pulse">
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              <Text style={styles.buttonText}>S'inscrire</Text>
            </TouchableOpacity>
          </Animatable.View>
        )}

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Déjà un compte ? Se connecter</Text>
        </TouchableOpacity>
      </Animatable.View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 30,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.white,
    marginTop: 20,
    textShadowColor: COLORS.shadow,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  formContainer: {
    backgroundColor: COLORS.lightWhite,
    borderRadius: 15,
    padding: 20,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: COLORS.white,
  },
  icon: {
    padding: 15,
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 15,
    fontSize: 16,
    color: COLORS.text,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    color: COLORS.primary,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RegisterScreen;