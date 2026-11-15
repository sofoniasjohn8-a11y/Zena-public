import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Font from 'expo-font';
import AppNavigator from './src/navigation/AppNavigator';

function Splash() {
  return (
    <View style={styles.splash}>
      <Text style={styles.splashTitle}>ዜና በገና</Text>
      <Text style={styles.splashSub}>መንፈሳዊ የዜማ ማሰልጠኛ ተቋም</Text>
      <ActivityIndicator size="large" color="#FCD34D" style={{ marginTop: 24 }} />
    </View>
  );
}

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    Font.loadAsync({ Nyala: require('./assets/nyala.ttf') })
      .catch(() => {})
      .finally(() => setFontLoaded(true));
  }, []);

  if (!fontLoaded) return <Splash />;

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" backgroundColor="#1C1917" />
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1, backgroundColor: '#1C1917',
    alignItems: 'center', justifyContent: 'center',
  },
  splashTitle: {
    fontSize: 36, fontWeight: 'bold', color: '#FCD34D',
    letterSpacing: 2, marginBottom: 8,
  },
  splashSub: {
    fontSize: 14, color: '#A8A29E', letterSpacing: 1,
  },
});
