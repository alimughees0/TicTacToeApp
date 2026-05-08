import * as Haptics from 'expo-haptics';
import { useAudioPlayer, createAudioPlayer } from 'expo-audio';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAppFeedback = () => {
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [isHapticEnabled, setIsHapticEnabled] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await AsyncStorage.getItem('app_settings');
      if (settings) {
        const { sound, haptic } = JSON.parse(settings);
        setIsSoundEnabled(sound);
        setIsHapticEnabled(haptic);
      }
    } catch (e) {
      console.error('Failed to load settings');
    }
  };

  const playSound = async (type) => {
    if (!isSoundEnabled) return;
    // Implementation for sound loading/playing
    // For now, just a placeholder as we don't have local assets yet
  };

  const triggerHaptic = (type = Haptics.ImpactFeedbackStyle.Light) => {
    if (isHapticEnabled) {
      Haptics.impactAsync(type);
    }
  };

  const triggerSuccessHaptic = () => {
    if (isHapticEnabled) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  return {
    triggerHaptic,
    triggerSuccessHaptic,
    playSound,
    settings: { isSoundEnabled, isHapticEnabled, setIsSoundEnabled, setIsHapticEnabled }
  };
};
