import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';

const SignUpScreen = ( ) => {
    const router = useRouter();
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>رائق</Text>
      <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
        {image ? (
          <Image source={{ uri: image }} style={styles.profileImage} />
        ) : (
          <Image source={require('../assets/profile.png')} style={styles.profileImage} />
        )}
        <View style={styles.addIcon}>
          <Text style={styles.plus}>+</Text>
        </View>
      </TouchableOpacity>
      <Text style={styles.addPhotoText}>أضف صورة</Text>
      <TextInput style={styles.input} placeholder="اسم المستخدم" value={username} onChangeText={setUsername} />
      <TextInput style={styles.input} placeholder="البريد الإلكتروني" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="كلمة المرور" value={password} onChangeText={setPassword} secureTextEntry />
      <TextInput style={styles.input} placeholder="تأكيد كلمة المرور" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText} onPress={() => router.push ('/AppContainer')}>إنشاء الحساب</Text>
      </TouchableOpacity>
      <Text style={styles.loginText}>
        لديك حساب بالفعل؟{' '}
        <Text style={styles.loginLink} onPress={() => router.replace ('/SignInScreen')}>سجل دخولك</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5F5F5', padding: 20 },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 20 },
  imageContainer: { position: 'relative', alignItems: 'center' },
  profileImage: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#ddd' },
  addIcon: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#00AEEF', width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  plus: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  addPhotoText: { color: '#00AEEF', marginVertical: 10 },
  input: { width: '100%', padding: 15, borderRadius: 10, backgroundColor: '#fff', marginVertical: 5, shadowOpacity: 0.1, shadowRadius: 5, elevation: 2 },
  button: { backgroundColor: '#00C3A3', padding: 15, borderRadius: 10, marginTop: 10, width: '100%', alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  loginText: { marginTop: 10, color: '#333' },
  loginLink: { color: '#00AEEF', fontWeight: 'bold' },
});

export default SignUpScreen;