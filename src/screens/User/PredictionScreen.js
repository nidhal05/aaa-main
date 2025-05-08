import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import { db } from '../../services/firestore';
import { ref, onValue } from 'firebase/database';
import PredictionCard from '../../components/PredictionCard';
import { useAuth } from '../../services/auth';
import ECGChart from '../../components/ECGChart';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/FontAwesome';
import { COLORS } from '../../utils/colors';

export default function PredictionScreen({ navigation }) {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrediction, setSelectedPrediction] = useState(null);
  const [error, setError] = useState(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    console.log('Utilisateur dans PredictionScreen:', user);
    if (!user) {
      setError('Utilisateur non authentifié');
      setLoading(false);
      return;
    }

    const ecgDataRef = ref(db, 'ecg_data');
    const predictionsRef = ref(db, 'predictions');

    const unsubscribeEcgData = onValue(
      ecgDataRef,
      (ecgSnapshot) => {
        const ecgData = ecgSnapshot.val();
        if (!ecgData) {
          setError('Aucune donnée ECG disponible');
          setLoading(false);
          return;
        }

        const unsubscribePredictions = onValue(
          predictionsRef,
          (predSnapshot) => {
            const predData = predSnapshot.val();
            if (!predData) {
              setError('Aucune prédiction disponible');
              setLoading(false);
              return;
            }

            const mergedData = [];
            for (const key in ecgData) {
              if (predData[key]) {
                const timestamp = parseInt(key.split('-')[1], 36) * 1000;
                const formattedDate = new Date(timestamp).toLocaleString('fr-FR');

                mergedData.push({
                  id: key,
                  date: formattedDate,
                  ecgData: ecgData[key].ecg_values || [],
                  result: predData[key].message || 'Inconnu',
                  confidence: predData[key].confidence || 0,
                  diagnostic: ecgData[key].diagnostic || null,
                });
              }
            }

            mergedData.sort((a, b) => new Date(b.date) - new Date(a.date));

            setPredictions(mergedData);
            setLoading(false);
          },
          (err) => {
            console.error('Erreur lors de la récupération des prédictions:', err);
            setError('Erreur lors de la récupération des prédictions: ' + err.message);
            setLoading(false);
          }
        );

        return () => unsubscribePredictions();
      },
      (err) => {
        console.error('Erreur lors de la récupération des données ECG:', err);
        setError('Erreur lors de la récupération des données ECG: ' + err.message);
        setLoading(false);
      }
    );

    return () => unsubscribeEcgData();
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Auth' }],
      });
    } catch (error) {
      Alert.alert('Erreur', error.message);
    }
  };

  if (loading) {
    return (
      <ImageBackground source={require('../../../assets/image/background_medical.png')} style={styles.loadingContainer}>
        <Animatable.View animation="rotate" iterationCount="infinite">
          <ActivityIndicator size="large" color={COLORS.white} />
        </Animatable.View>
        <Animatable.Text animation="fadeIn" style={styles.loadingText}>
          Chargement des données...
        </Animatable.Text>
      </ImageBackground>
    );
  }

  if (error) {
    return (
      <ImageBackground source={require('../../../assets/image/background_medical.png')} style={styles.emptyContainer}>
        <Animatable.Text animation="shake" style={styles.errorText}>
          {error}
        </Animatable.Text>
        <Animatable.View animation="pulse">
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Icon name="sign-out" size={20} color={COLORS.white} />
            <Text style={styles.logoutButtonText}>Se déconnecter</Text>
          </TouchableOpacity>
        </Animatable.View>
      </ImageBackground>
    );
  }

  if (predictions.length === 0) {
    return (
      <ImageBackground source={require('../../../assets/image/background_medical.png')} style={styles.emptyContainer}>
        <Animatable.Text animation="fadeIn" style={styles.emptyText}>
          Aucune prédiction disponible
        </Animatable.Text>
        <Animatable.View animation="pulse">
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Icon name="sign-out" size={20} color={COLORS.white} />
            <Text style={styles.logoutButtonText}>Se déconnecter</Text>
          </TouchableOpacity>
        </Animatable.View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={require('../../../assets/image/background_medical.png')} style={styles.container}>
      <Animatable.View animation="fadeIn" style={styles.header}>
        <Text style={styles.headerText}>Prédictions</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="sign-out" size={20} color={COLORS.white} />
          <Text style={styles.logoutButtonText}>Se déconnecter</Text>
        </TouchableOpacity>
      </Animatable.View>

      {selectedPrediction && (
        <Animatable.View animation="zoomIn" style={styles.chartContainer}>
          <ECGChart data={selectedPrediction.ecgData} />
        </Animatable.View>
      )}

      <FlatList
        data={predictions}
        renderItem={({ item, index }) => (
          <Animatable.View animation="fadeInUp" delay={index * 100}>
            <PredictionCard
              prediction={item}
              onPress={() => setSelectedPrediction(item)}
            />
          </Animatable.View>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    textShadowColor: COLORS.shadow,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: COLORS.white,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 20,
    color: COLORS.white,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 20,
    color: COLORS.white,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  chartContainer: {
    padding: 15,
    backgroundColor: COLORS.lightWhite,
    margin: 10,
    borderRadius: 15,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  listContent: {
    padding: 10,
    paddingBottom: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.error,
    padding: 10,
    borderRadius: 10,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  logoutButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});