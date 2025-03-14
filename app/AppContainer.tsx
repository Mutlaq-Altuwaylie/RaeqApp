import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { FontAwesome5, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Import tab content components
import DashboardScreen from './DashboardScreen';
import BadgesScreen from './BadgesScreen';
import ProfileScreen from './ProfileScreen';
import NotificationScreen from './NotificationScreen';

const AppContainer = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'badges', 'notifications', 'profile'

  // Render the appropriate content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return <DashboardScreen />;
      case 'badges':
        return <BadgesScreen />;
      case 'notifications':
        return <NotificationScreen setActiveTab={setActiveTab}  />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Status Bar */}
      <StatusBar backgroundColor="#00c4b4" barStyle="light-content" />

      {/* Shared Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            if (activeTab === 'profile') {
              setActiveTab('home'); // Go back to the home screen
            } else {
              setActiveTab('profile'); // Go to the profile screen
            }
          }}
        >
          {activeTab === 'profile' ? (
            <Ionicons name="arrow-back" size={24} color="#fff" /> // Back arrow for profile screen
          ) : (
            <Image source={require('../assets/profile.png')} style={styles.profileImage} /> // Profile image for other screens
          )}
        </TouchableOpacity>
        <Text style={styles.appTitle}>Raeq</Text>
        <TouchableOpacity onPress={() => router.push('/SettingsScreen')}>
          <MaterialIcons name="settings" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      <View style={styles.contentContainer}>{renderTabContent()}</View>

      {/* Shared Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => setActiveTab('home')}>
          <FontAwesome5
            name="home"
            size={24}
            color={activeTab === 'home' ? '#008080' : 'gray'}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('badges')}>
          <MaterialIcons
            name="shield"
            size={24}
            color={activeTab === 'badges' ? '#008080' : 'gray'}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('notifications')}>
          <FontAwesome5
            name="bell"
            size={24}
            color={activeTab === 'notifications' ? '#008080' : 'gray'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#00c4b4',
    padding: 20,
    paddingTop: 40,
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
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});

export default AppContainer;