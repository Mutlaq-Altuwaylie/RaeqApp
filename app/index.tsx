import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

const IntroScreen = () => {
  const translateY = useSharedValue(-height / 2);
  const router = useRouter();

  useEffect(() => {
    translateY.value = withTiming(0, { duration: 1000 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../assets/Splash.jpg')}
        style={[styles.image, animatedStyle]}
      />
      <Text style={styles.title}>رايق</Text>
      <Text style={styles.subtitle}>
        العب بذكاء! تابع وقت لعبك، نومك، واكسب شارات رهيبة
      </Text>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/SignInScreen')}>
        <Text style={styles.buttonText}>تسجيل الدخول</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/SignUpScreen')}>
        <Text style={styles.link}>إنشاء حساب</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    // We want the image to stick to the top so align items to stretch
    alignItems: 'stretch', 
    backgroundColor: '#E0F2F1',
    padding: 0,
    margin: 0,
  },
  image: { 
    width: '100%',  // image takes the full width of the screen
    height: height * 0.5, 
    resizeMode: 'cover',  // ensures the image fills its container on both sides
  },
  title: { 
    fontSize: 32, 
    fontWeight: 'bold', 
    color: '#000', 
    marginVertical: 10, 
    textAlign: 'center',
  },
  subtitle: { 
    fontSize: 16, 
    color: '#666', 
    textAlign: 'center', 
    marginHorizontal: 20,
  },
  button: { 
    backgroundColor: '#1ABC9C', 
    padding: 15, 
    borderRadius: 25, 
    width: '80%', 
    alignSelf: 'center', 
    marginTop: 20,
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: 'bold',
    textAlign: 'center',
  },
  link: { 
    color: '#3498DB', 
    fontSize: 16, 
    marginTop: 15,
    textAlign: 'center',
  },
});

export default IntroScreen;