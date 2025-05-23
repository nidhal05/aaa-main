import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { COLORS } from '../../src/utils/colors';

const PredictionCard = ({ prediction, onPress }) => {
  const getResultIcon = () => {
    if (!prediction.result) return require('../../assets/image/heart_ecg_icon.jpg');
    
    const lowerResult = prediction.result.toLowerCase();
    if (lowerResult.includes('anormal') || lowerResult.includes('anomal')) {
      return require('../../assets/image/heart_cross_icon.jpg');
    }
    return require('../../assets/image/heart_ecg_icon.jpg');
  };

  const getResultColor = () => {
    if (!prediction.result) return COLORS.primary;
    
    const lowerResult = prediction.result.toLowerCase();
    if (lowerResult.includes('anormal') || lowerResult.includes('anomal')) {
      return COLORS.error;
    }
    return COLORS.success;
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Image
          source={getResultIcon()}
          style={styles.icon}
        />
      </View>
      <View style={styles.content}>
        <Text style={styles.date}>{prediction.date}</Text>
        <Text style={[styles.result, { color: getResultColor() }]}>
          {prediction.result || 'Résultat inconnu'}
        </Text>
        {prediction.confidence > 0 && (
          <Text style={styles.confidence}>
            Confiance: {(prediction.confidence * 100).toFixed(1)}%
          </Text>
        )}
        {prediction.diagnostic && (
          <Text style={styles.diagnostic}>
            {prediction.diagnostic}
          </Text>
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
    marginTop: 5,
    fontWeight: '600',
  },
  confidence: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 3,
  },
  diagnostic: {
    fontSize: 12,
    color: COLORS.error,
    marginTop: 3,
    fontStyle: 'italic',
  },
  arrow: {
    marginLeft: 10,
  },
});

export default PredictionCard;