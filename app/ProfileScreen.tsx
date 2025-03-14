import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const ProfileScreen = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('posts');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    username: 'محترف الألعاب',
    handle: '@GamerPro_SA',
    bio: 'لاعب محترف في فورتنايت وكول أوف ديوتي. أحب التحديات والإنجازات الكبيرة! 🎮🔥',
    birthdate: '8 فبراير 1990',
  });
  const [editData, setEditData] = useState({ ...profileData });

  // Mock games data
  const games = [
    { id: 1, name: 'فورتنايت', hours: 120, lastPlayed: 'قبل يومين' },
    { id: 2, name: 'ماينكرافت', hours: 85, lastPlayed: 'أمس' },
    { id: 3, name: 'كول أوف ديوتي', hours: 210, lastPlayed: 'قبل 5 أيام' },
  ];

  // Mock stats data
  const stats = {
    averageSleep: '7.2 ساعات',
    familyTime: '2.5 ساعة/يوم',
    moodScore: '85/100',
    screenTime: '4.2 ساعة/يوم',
    streaks: {
      healthySleep: 15,
      familyDinner: 8,
      balancedPlay: 12,
    },
  };

  const handleSaveProfile = () => {
    setProfileData(editData);
    setIsEditing(false);
  };

  const renderEditProfile = () => (
    <View style={styles.editContainer}>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>اسم المستخدم</Text>
        <TextInput
          style={styles.input}
          value={editData.username}
          onChangeText={(text) => setEditData({ ...editData, username: text })}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>الاسم التعريفي</Text>
        <TextInput
          style={styles.input}
          value={editData.handle}
          onChangeText={(text) => setEditData({ ...editData, handle: text })}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>السيرة الذاتية</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={editData.bio}
          onChangeText={(text) => setEditData({ ...editData, bio: text })}
          multiline
          numberOfLines={4}
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
        <Text style={styles.saveButtonText}>حفظ التعديلات</Text>
      </TouchableOpacity>
    </View>
  );

  const renderGames = () => (
    <View style={styles.gamesContainer}>
      {games.map((game) => (
        <View key={game.id} style={styles.gameItem}>
          <Text style={styles.gameName}>{game.name}</Text>
          <Text style={styles.gameHours}>{game.hours} ساعة لعب</Text>
          <Text style={styles.gameLastPlayed}>آخر مرة لعب: {game.lastPlayed}</Text>
        </View>
      ))}
    </View>
  );

  const renderStats = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statCard}>
        <Text style={styles.statTitle}>جودة النوم</Text>
        <Text style={styles.statValue}>{stats.averageSleep}</Text>
        <Text style={styles.statSubtext}>المعدل اليومي</Text>
      </View>

      <View style={styles.statCard}>
        <Text style={styles.statTitle}>وقت العائلة</Text>
        <Text style={styles.statValue}>{stats.familyTime}</Text>
        <Text style={styles.statSubtext}>المعدل اليومي</Text>
      </View>

      <View style={styles.statCard}>
        <Text style={styles.statTitle}>مستوى المزاج</Text>
        <Text style={styles.statValue}>{stats.moodScore}</Text>
        <Text style={styles.statSubtext}>المعدل الأسبوعي</Text>
      </View>

      <View style={styles.statCard}>
        <Text style={styles.statTitle}>وقت الشاشة</Text>
        <Text style={styles.statValue}>{stats.screenTime}</Text>
        <Text style={styles.statSubtext}>المعدل اليومي</Text>
      </View>

      <View style={styles.streaksContainer}>
        <Text style={styles.streaksTitle}>الإنجازات المتتالية</Text>
        <View style={styles.streakItem}>
          <FontAwesome5 name="bed" size={16} color="#10b981" />
          <Text style={styles.streakText}>نوم صحي: {stats.streaks.healthySleep} يوم</Text>
        </View>
        <View style={styles.streakItem}>
          <FontAwesome5 name="utensils" size={16} color="#10b981" />
          <Text style={styles.streakText}>عشاء عائلي: {stats.streaks.familyDinner} يوم</Text>
        </View>
        <View style={styles.streakItem}>
          <FontAwesome5 name="gamepad" size={16} color="#10b981" />
          <Text style={styles.streakText}>لعب متوازن: {stats.streaks.balancedPlay} يوم</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header with curved background */}
      <View style={styles.header}>
        <View style={[styles.headerBg, { backgroundColor: '#00c4b4' }]} />
      </View>

      {/* Profile info section */}
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <Image source={require('../assets/profile.png')} style={styles.avatar} />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.username}>{profileData.username}</Text>
          <Text style={styles.handle}>{profileData.handle}</Text>

          <Text style={styles.bio}>{profileData.bio}</Text>

          <View style={styles.infoRow}>
            <FontAwesome5 name="birthday-cake" size={14} color="#999" />
            <Text style={styles.infoText}>{profileData.birthdate}</Text>
          </View>
        </View>
      </View>

      {/* Tab navigation */}
      <View style={styles.tabNav}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'posts' && styles.activeTab]}
          onPress={() => setActiveTab('posts')}
        >
          <Text style={styles.tabButtonText}>الألعاب المفضلة</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'likes' && styles.activeTab]}
          onPress={() => setActiveTab('likes')}
        >
          <Text style={styles.tabButtonText}>الإحصاءات</Text>
        </TouchableOpacity>
      </View>

      {/* Content based on active tab */}
      <ScrollView style={styles.contentContainer}>
        {isEditing ? (
          renderEditProfile()
        ) : (
          <>
            {activeTab === 'posts' && renderGames()}
            {activeTab === 'likes' && renderStats()}
          </>
        )}
      </ScrollView>

      {/* Edit button (floating) */}
      <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(!isEditing)}>
        <FontAwesome5 name="pencil-alt" size={20} color="#fff" />
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 100,
    position: 'relative',
  },
  headerBg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
  },
  profileSection: {
    paddingHorizontal: 16,
    marginTop: -40,
  },
  avatarContainer: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#fff',
  },
  profileInfo: {
    alignItems: 'center',
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  handle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 15,
  },
  statItem: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  statNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  bio: {
    fontSize: 14,
    color: '#444',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },

  messageButton: {
    backgroundColor: '#1E90FF',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  buttonText: {
    color: '#fff',
    marginLeft: 6,
    fontWeight: '500',
  },
  followButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#1E90FF',
  },
  followButtonText: {
    color: '#1E90FF',
    fontWeight: '500',
  },
  tabNav: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#1E90FF',
  },
  tabButtonText: {
    color: '#666',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  editButton: {
    position: 'absolute',
    right: 20,
    bottom: 80,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1E90FF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5,
  },
  editContainer: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#10b981',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  gamesContainer: {
    marginTop: 10,
  },
  gameItem: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  gameName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  gameHours: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  gameLastPlayed: {
    fontSize: 12,
    color: '#999',
  },
  statsContainer: {
    marginTop: 10,
  },
  statCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  statTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#444',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10b981',
    marginBottom: 4,
  },
  statSubtext: {
    fontSize: 12,
    color: '#999',
  },
  streaksContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  streaksTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#444',
  },
  streakItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  streakText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
});

export default ProfileScreen;