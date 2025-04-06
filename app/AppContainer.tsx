import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, StatusBar, Platform } from 'react-native';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome5, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Import tab content components
import DashboardScreen from './DashboardScreen';
import BadgesScreen from './BadgesScreen';
import ProfileScreen from './ProfileScreen';
import NotificationScreen from './NotificationScreen';

const MainApp = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('home');
  const insets = useSafeAreaInsets();

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home': return <DashboardScreen />;
      case 'badges': return <BadgesScreen />;
      case 'notifications': return <NotificationScreen setActiveTab={setActiveTab} />;
      case 'profile': return <ProfileScreen />;
      default: return <DashboardScreen />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#00c4b4" barStyle="light-content" />
      
      {/* Header with safe area padding */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => activeTab === 'profile' ? setActiveTab('home') : setActiveTab('profile')}>
          {activeTab === 'profile' ? (
            <Ionicons name="arrow-back" size={24} color="#fff" />
          ) : (
            <Image source={require('../assets/profile.png')} style={styles.profileImage} />
          )}
        </TouchableOpacity>
        <Text style={styles.appTitle}>Raeq</Text>
        <TouchableOpacity onPress={() => router.push('/SettingsScreen')}>
          <MaterialIcons name="settings" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Main content */}
      <View style={styles.contentContainer}>
        {renderTabContent()}
      </View>

      {/* Bottom navigation with safe area padding */}
      <View style={[styles.bottomNavContainer, { paddingBottom: insets.bottom }]}>
        <View style={styles.bottomNav}>
          <TouchableOpacity onPress={() => setActiveTab('home')}>
            <FontAwesome5
              name="home"
              size={24}
              color={activeTab === 'home' ? '#00c4b4' : 'gray'}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab('badges')}>
            <MaterialIcons
              name="shield"
              size={24}
              color={activeTab === 'badges' ? '#00c4b4' : 'gray'}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab('notifications')}>
            <FontAwesome5
              name="bell"
              size={24}
              color={activeTab === 'notifications' ? '#00c4b4' : 'gray'}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const AppContainer = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeAreaContainer} edges={['right', 'left']}>
        <MainApp />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: '#00c4b4',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#00c4b4',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  appTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
  },
  bottomNavContainer: {
    backgroundColor: '#fff',
    paddingTop: 10,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
});

export default AppContainer;