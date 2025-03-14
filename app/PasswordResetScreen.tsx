import React from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';


const PasswordResetScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="blue" />
      </TouchableOpacity>

      {/* Icon */}
      <Image source={require("../assets/Key.png")} style={styles.icon} />

      {/* Title */}
      <Text style={styles.title}>استعادة كلمة المرور</Text>

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="أدخل البريد الإلكتروني"
        placeholderTextColor="#999"
      />

      {/* Submit Button */}
      <TouchableOpacity  onPress={() => router.push('/OTPVerificationScreen')} style={styles.button}>
        <Text style={styles.buttonText}>إرسال</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000",
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    textAlign: "right",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 20,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#00C2A8",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
};

export default PasswordResetScreen;
