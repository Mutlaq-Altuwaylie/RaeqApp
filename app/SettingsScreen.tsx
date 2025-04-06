import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Switch, StyleSheet, SafeAreaView, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useGlobalSearchParams } from "expo-router";
import { initiateSteamLogin, isSteamLinked, unlinkSteam, SteamAccount } from './SteamAuth';

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
  const params = useGlobalSearchParams();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [arabic, setArabic] = useState(false);
  const [steamAccount, setSteamAccount] = useState<SteamAccount | null>(null);
  const [linkedAccounts, setLinkedAccounts] = useState({
    psn: null,
    xbox: null
  });

  // Load account and listen for auth success
  useEffect(() => {
    const loadAccount = async () => {
      const account = await isSteamLinked();
      setSteamAccount(account);
    };

    loadAccount();
    
    if (params.steamAuthSuccess) {
      loadAccount(); // Refresh after auth
      router.setParams({ steamAuthSuccess: undefined }); // Clear param
    }
  }, [params.steamAuthSuccess]);

  const handleSteamPress = async () => {
    if (steamAccount) {
      Alert.alert(
        "Unlink Steam",
        "Are you sure you want to unlink your Steam account?",
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Unlink", 
            style: "destructive",
            onPress: async () => {
              await unlinkSteam();
              setSteamAccount(null);
            }
          }
        ]
      );
    } else {
      await initiateSteamLogin();
    }
  };

  const LinkedButtonOption = ({ label, icon, onPress, isLinked, username }) => (
    <TouchableOpacity style={[styles.optionButton, isLinked && styles.linkedOptionButton]} onPress={onPress}>
      {icon && <Ionicons name={icon} size={20} color="#00C2A8" />}
      <View style={{ flex: 1 }}>
        <Text style={styles.optionText}>{label}</Text>
        {isLinked && username && <Text style={styles.linkedText}>Linked to: {username}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={20} color="#999" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="الإعدادات" onBack={() => router.back()} />

      <ToggleOption label="الوضع الليلي" value={darkMode} onValueChange={setDarkMode} />
      <ToggleOption label="الإشعارات" value={notifications} onValueChange={setNotifications} />
      <ButtonOption label="حذف الحساب" onPress={() => {}} />
      <ToggleOption label="عربي" value={arabic} onValueChange={setArabic} />

      <SectionTitle title="ربط الحساب" />

      <LinkedButtonOption 
        label="PlayStation Network" 
        icon="logo-playstation" 
        isLinked={!!linkedAccounts.psn}
        username={linkedAccounts.psn?.username}
        onPress={() => {}} 
      />
      
      <LinkedButtonOption 
        label="Steam" 
        icon="logo-steam" 
        isLinked={!!steamAccount}
        username={steamAccount?.username}
        onPress={handleSteamPress} 
      />
      
      <LinkedButtonOption 
        label="Xbox Live" 
        icon="logo-xbox" 
        isLinked={!!linkedAccounts.xbox}
        username={linkedAccounts.xbox?.username}
        onPress={() => {}} 
      />

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
  linkedOptionButton: {
    backgroundColor: '#E6F7F5',
    borderColor: '#00C2A8',
    borderWidth: 1,
  },
  optionText: {
    fontSize: 16,
    fontWeight: "500",
  },
  linkedText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
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