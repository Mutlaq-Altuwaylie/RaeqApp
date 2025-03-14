import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';

export default function SignInScreen() {
  const navigation = useNavigation();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>رايق</Text>
      <TextInput style={styles.input} placeholder="البريد الإلكتروني" placeholderTextColor="#999" />
      <TextInput style={styles.input} placeholder="كلمة المرور" placeholderTextColor="#999" secureTextEntry />
      <TouchableOpacity>
        <Text style={styles.forgotPassword} onPress={() => router.push('/PasswordResetScreen')}>نسيت كلمة المرور؟</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/AppContainer')}>
        <Text style={styles.buttonText}>تسجيل الدخول</Text>
      </TouchableOpacity>
      <Text style={styles.registerText} onPress={() => router.push('/SignUpScreen')}>ما عندك حساب؟ <Text style={styles.registerLink}>أنشئ حسابك الآن</Text></Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F8FA',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    textAlign: 'right',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    color: '#007AFF',
    marginBottom: 20,
  },
  button: {
    width: '100%',
    backgroundColor: '#00C7A0',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerText: {
    marginTop: 20,
    color: '#333',
  },
  registerLink: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
});
