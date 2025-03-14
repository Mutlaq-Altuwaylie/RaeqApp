import React, { useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const BadgesScreen = () => {
  const router = useRouter();
  const badgesData = [
    {
      id: '1',
      title: 'وقت اللعب المعتدل',
      description: 'لعبت أقل من 3 ساعات يومياً لمدة أسبوع متواصل',
      image: null,
      progress: 80,
      category: 'featured',
    },
    {
      id: '2',
      title: 'نوم صحي',
      description: 'حصلت على 8 ساعات من النوم لخمسة أيام متتالية',
      image: null,
      progress: 60,
      category: 'featured',
    },
    {
      id: '3',
      title: 'التواصل الاجتماعي',
      description: 'تحدثت مع العائلة أو الأصدقاء 3 مرات هذا الأسبوع',
      image: null,
      progress: 50,
      category: 'featured',
    },
    {
      id: '4',
      title: 'أخذ فترات راحة',
      description: 'استرحت لمدة 10 دقائق بعد كل ساعة من اللعب لمدة أسبوع',
      image: null,
      progress: 45,
      category: 'milestones',
    },
    {
      id: '5',
      title: 'المزاج المستقر',
      description: 'أكملت استبيان المزاج يومياً لمدة أسبوع',
      image: null,
      progress: 70,
      category: 'milestones',
    },
    {
      id: '6',
      title: 'التحكم في وقت اللعب',
      description: 'قللت وقت اللعب بنسبة 20٪ هذا الشهر',
      image: null,
      progress: 100,
      category: 'completed',
    },
  ];

  const [activeTab, setActiveTab] = useState('featured');
  const filteredBadges = badgesData.filter(badge => badge.category === activeTab);

  const renderBadgeItem = ({ item }) => (
    <View style={styles.badgeCard}>
      <Image source={item.image} style={styles.badgeIcon} />
      <View style={styles.badgeContent}>
        <Text style={styles.badgeTitle}>{item.title}</Text>
        <Text style={styles.badgeDescription}>{item.description}</Text>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${item.progress}%` }]} />
          <View style={[styles.progressBackground, { width: `${100 - item.progress}%` }]} />
        </View>
        <Text style={styles.progressText}>{item.progress}%</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'featured' && styles.activeTab]}
          onPress={() => setActiveTab('featured')}
        >
          <Text style={[styles.tabText, activeTab === 'featured' && styles.activeTabText]}>المميزة</Text>
          {activeTab === 'featured' && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'milestones' && styles.activeTab]}
          onPress={() => setActiveTab('milestones')}
        >
          <Text style={[styles.tabText, activeTab === 'milestones' && styles.activeTabText]}>الإنجازات</Text>
          {activeTab === 'milestones' && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
          onPress={() => setActiveTab('completed')}
        >
          <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>المكتملة</Text>
          {activeTab === 'completed' && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>
      </View>

      {/* Badges List */}
      <FlatList
        data={filteredBadges}
        keyExtractor={(item) => item.id}
        renderItem={renderBadgeItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    container: { 
      flex: 1, 
      backgroundColor: '#f5f5f5' 
    },
    tabContainer: {
      flexDirection: 'row',
      backgroundColor: '#fff',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
    },
    tab: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: 8,
      position: 'relative',
    },
    activeTab: {
      backgroundColor: '#fff',
    },
    tabText: {
      color: '#888',
      fontWeight: '500',
    },
    activeTabText: {
      color: '#000',
      fontWeight: 'bold',
    },
    activeTabIndicator: {
      position: 'absolute',
      bottom: 0,
      width: '70%',
      height: 3,
      backgroundColor: '#e53935',
    },
    listContainer: {
      padding: 16,
    },
    badgeCard: {
      flexDirection: 'row',
      backgroundColor: '#fff',
      marginBottom: 16,
      padding: 16,
      borderRadius: 10,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
    },
    badgeIcon: {
      width: 60,
      height: 60,
      marginRight: 16,
    },
    badgeContent: {
      flex: 1,
    },
    badgeTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 4,
    },
    badgeDescription: {
      fontSize: 12,
      color: '#666',
      marginBottom: 8,
    },
    progressContainer: {
      flexDirection: 'row',
      height: 10,
      borderRadius: 5,
      marginBottom: 4,
      overflow: 'hidden',
    },
    progressBar: {
      height: '100%',
      backgroundColor: '#9c27b0',
    },
    progressBackground: {
      height: '100%',
      backgroundColor: '#e0e0e0',
    },
    progressText: {
      fontSize: 14,
      fontWeight: 'bold',
      alignSelf: 'flex-end',
    },
  });

export default BadgesScreen;
