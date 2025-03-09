import React, { useEffect } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useRouter } from 'expo-router';

const { height } = Dimensions.get('window');

const IntroScreen = () => {
  const translateY = useSharedValue(-height / 2);
  const router = useRouter(); // For navigation

  useEffect(() => {
    translateY.value = withTiming(0, { duration: 1000 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <View style={styles.container}>
      <Animated.Image source={require('../assets/Splash.jpg')} style={[styles.image, animatedStyle]} />
      <Text style={styles.title}>رايق</Text>
      <Text style={styles.subtitle}>اللعب بذكاء! تابع وقت لعبك، نومك، واكسب شارات رهيبة</Text>

      <TouchableOpacity style={styles.button} >
        <Text style={styles.buttonText}>تسجيل الدخول</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/SignUpScreen')}>
        <Text style={styles.link}>إنشاء حساب</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#E0F2F1' },
  image: { width: '100%', height: height * 0.5, resizeMode: 'contain' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#000', marginVertical: 10 },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginHorizontal: 20 },
  button: { backgroundColor: '#1ABC9C', padding: 15, borderRadius: 25, width: '80%', alignItems: 'center', marginTop: 20 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  link: { color: '#3498DB', fontSize: 16, marginTop: 15 },
});

export default IntroScreen;
