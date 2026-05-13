import * as Haptics from 'expo-haptics';
import { createAudioPlayer } from 'expo-audio';
import { useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SOUNDS = {
  tap: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  win: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
  draw: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
};

export const useAppFeedback = () => {
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [isHapticEnabled, setIsHapticEnabled] = useState(true);
  const players = useRef({});

  useEffect(() => {
    loadSettings();
    return () => {
      // Cleanup players
      Object.values(players.current).forEach(player => player.release());
    };
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
    
    try {
      if (!players.current[type]) {
        players.current[type] = createAudioPlayer(SOUNDS[type]);
      }
      
      const player = players.current[type];
      if (player.playing) {
        player.seekTo(0);
      } else {
        player.play();
      }
    } catch (e) {
      console.error('Failed to play sound', e);
    }
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
