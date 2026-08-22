import React from 'react';
import { View, Text, Button, Alert } from 'react-native';

export default function StatusScreen() {
  const handleCallVoiceAgent = () => {
    // TODO: Trigger IVR/telephony call to KisanSaarthi Voice Agent
    Alert.alert('Calling Voice Agent', 'Initiating call to KisanSaarthi voice assistant...');
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'space-between' }}>
      <View>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Procurement Status</Text>
        {/* TODO: Render current slot and payment status */}
      </View>
      
      <Button title="Call KisanSaarthi" onPress={handleCallVoiceAgent} color="#16a34a" />
    </View>
  );
}
