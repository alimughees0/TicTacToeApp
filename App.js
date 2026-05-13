import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import AppNavigator from './src/navigation/AppNavigator';
import CustomSplashScreen from './src/screens/CustomSplashScreen';
import { ThemeProvider } from './src/context/ThemeContext';

// Keep the native splash screen visible until we're ready to show our custom one
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [showCustomSplash, setShowCustomSplash] = useState(true);

  useEffect(() => {
    const prepare = async () => {
      try {
        // Hide native splash immediately to show our custom one with text
        await SplashScreen.hideAsync();
      } catch (e) {
        console.warn(e);
      }
    };

    prepare();

    const timer = setTimeout(() => {
      setShowCustomSplash(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  if (showCustomSplash) {
    return (
      <ThemeProvider>
        <StatusBar style="light" />
        <CustomSplashScreen />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <StatusBar style="light" />
      <AppNavigator />
    </ThemeProvider>
  );
}
