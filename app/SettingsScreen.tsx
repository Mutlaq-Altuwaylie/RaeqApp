import React, { useState } from "react";
import { View, Text, TouchableOpacity, Switch, StyleSheet, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const Header = ({ title, onBack }) => (
  <View style={styles.header}>
    <TouchableOpacity onPress={onBack} style={styles.backButton}>
      <Ionicons name="arrow-back" size={24} color="#00C2A8" />
    </TouchableOpacity>
    <Text style={styles.title}>{title}</Text>
  </View>
);

const ToggleOption = ({ label, value, onValueChange }) => (
  <View style={styles.option}>
    <Text style={styles.optionText}>{label}</Text>
    <Switch value={value} onValueChange={onValueChange} />
  </View>
);

const ButtonOption = ({ label, icon, onPress }) => (
  <TouchableOpacity style={styles.optionButton} onPress={onPress}>
    {icon && <Ionicons name={icon} size={20} color="#00C2A8" />}
    <Text style={styles.optionText}>{label}</Text>
    <Ionicons name="chevron-forward" size={20} color="#999" />
  </TouchableOpacity>
);

const SectionTitle = ({ title }) => (
  <Text style={styles.sectionTitle}>{title}</Text>
);

const SettingsScreen = () => {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [arabic, setArabic] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <Header title="الإعدادات" onBack={() => router.back()} />

      <ToggleOption label="الوضع الليلي" value={darkMode} onValueChange={setDarkMode} />
      <ToggleOption label="الإشعارات" value={notifications} onValueChange={setNotifications} />
      <ButtonOption label="حذف الحساب" onPress={() => {}} />
      <ToggleOption label="عربي" value={arabic} onValueChange={setArabic} />

      <SectionTitle title="ربط الحساب" />

      {[
        { name: "PlayStation Network", icon: "logo-playstation" },
        { name: "Steam", icon: "logo-steam" },
        { name: "Xbox Live", icon: "logo-xbox" },
      ].map((account, index) => (
        <ButtonOption key={index} label={account.name} icon={account.icon} onPress={() => {}} />
      ))}

      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutText}>تسجيل الخروج</Text>
        <Ionicons name="log-out-outline" size={20} color="#E57373" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  backButton: {
    position: "absolute",
    left: 0,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  optionText: {
    fontSize: 16,
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  logoutButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8D7DA",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  logoutText: {
    fontSize: 16,
    color: "#E57373",
    fontWeight: "bold",
  },
});

export default SettingsScreen;