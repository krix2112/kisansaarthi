import React from 'react';
import { View, Text } from 'react-native';

export default function PriceScreen() {
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Mandi Crop Prices</Text>
      {/* TODO: Add Data.gov.in crop price listing */}
    </View>
  );
}
