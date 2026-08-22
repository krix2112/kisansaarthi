import React from 'react';
import { View, Text } from 'react-native';

export default function QueueScreen() {
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Live Queue Tracker</Text>
      {/* TODO: Add real-time queue position and ETA display */}
    </View>
  );
}
