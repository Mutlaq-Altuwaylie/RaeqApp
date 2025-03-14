import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient'; // Import LinearGradient
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

const IntroScreen = () => {
  const translateY = useSharedValue(-height / 2); // Shared value for animation
  const router = useRouter();

  useEffect(() => {
    translateY.value = withTiming(0, { duration: 1000 }); // Animate to 0
  }, []);

  // Animated style for the image and gradient
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {/* Animated Image */}
        <Animated.Image
          source={require('../assets/Splash.jpg')}
          style={[styles.image, animatedStyle]}
        />
        {/* Animated Gradient Overlay */}
        <Animated.View style={[styles.gradientOverlay, animatedStyle]}>
          <LinearGradient
            colors={['transparent', '#E0F2F1']}
            locations={[0.5, 1]} // Adjust the gradient start and end points
            style={StyleSheet.absoluteFill} // Fill the parent container
          />
        </Animated.View>
      </View>
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
    alignItems: 'stretch', 
    backgroundColor: '#E0F2F1',
    padding: 0,
    margin: 0,
  },
  imageContainer: {
    position: 'relative', // Needed for absolute positioning of the gradient
  },
  image: { 
    width: '100%', 
    height: height * 0.5, 
    resizeMode: 'cover', 
  },
  gradientOverlay: {
    position: 'absolute', // Position the gradient over the image
    left: 0,
    right: 0,
    bottom: 0,
    height: height * 0.25, // Adjust the height of the gradient
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