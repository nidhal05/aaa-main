import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { COLORS } from '../utils/colors';

const PredictionCard = ({ prediction, onPress }) => {
  const getResultIcon = (result) => {
    switch (result) {
      case 'Normal':
        return require('../../assets/image/heart_ecg_icon.jpg'); // Image 2
      case 'Anormal':
        return require('../../assets/image/heart_cross_icon.jpg'); // Image 3
      default:
        return require('../../assets/image/heart_ecg_icon.jpg'); // Par défaut
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Image
          source={getResultIcon(prediction.result)}
          style={styles.icon}
        />
      </View>
      <View style={styles.content}>
        <Text style={styles.date}>{prediction.date}</Text>
        <Text style={styles.result}>Résultat: {prediction.result}</Text>
        <Text style={styles.confidence}>Confiance: {(prediction.confidence * 100).toFixed(2)}%</Text>
        {prediction.diagnostic && (
          <Text style={styles.diagnostic}>Diagnostic: {prediction.diagnostic}</Text>
        )}
      </View>
      <Icon name="chevron-right" size={20} color={COLORS.textLight} style={styles.arrow} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.lightWhite,
    borderRadius: 15,
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 10,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 15,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  content: {
    flex: 1,
  },
  date: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  result: {
    fontSize: 14,
    color: COLORS.primary,
    marginTop: 5,
  },
  confidence: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 3,
  },
  diagnostic: {
    fontSize: 14,
    color: COLORS.error,
    marginTop: 3,
  },
  arrow: {
    marginLeft: 10,
  },
});

export default PredictionCard;