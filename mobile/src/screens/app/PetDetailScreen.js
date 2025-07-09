import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export default function PetDetailScreen({ route }) {
  const { petId } = route.params;
  
  return (
    <View style={styles.container}>
      <Text>Pet Detail Screen - {petId}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});