import React from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

const DashboardScreen = () => {
  const healthData = [
    {
      id: '1',
      title: 'جلسة اللعب',
      subtitle: 'متابعة مدة اللعب',
      role: 'آخر جلسة: 3 ساعات',
      description: 'تم لعب Apex Legends لمدة 3 ساعات اليوم.',
      image: require('../assets/gaming_session.png'),
      checked: true,
    },
    {
      id: '2',
      title: 'جودة النوم',
      subtitle: 'تحليل نومك',
      role: 'نمت 4.5 ساعات',
      description: 'نومك أقل من المعدل الطبيعي، حاول تحسين جدولك.',
      image: require('../assets/sleep_quality.png'),
      checked: true,
    },
    {
      id: '3',
      title: 'المزاج اليومي',
      subtitle: 'كيف تشعر اليوم؟',
      role: 'تقييم المزاج: 3/5',
      description: 'متوسط، ربما تحتاج إلى استراحة من اللعب.',
      image: require('../assets/mood_tracking.png'),
      checked: true,
    },
    {
      id: '4',
      title: 'التواصل الاجتماعي',
      subtitle: 'تفاعلك مع الآخرين',
      role: '0 لقاءات اليوم',
      description: 'لم تقم بمقابلة الأصدقاء أو العائلة اليوم.',
      image: require('../assets/social_interaction.png'),
      checked: false,
    },
  ];

  return (
    <View style={styles.container}>
      {/* Mental Health Score */}
      <View style={styles.wellnessCard}>
        <Text style={styles.wellnessTitle}>تقييم الصحة النفسية</Text>
        <Text style={styles.score}>7.5/10</Text>
        <Text style={styles.wellnessText}>
          نومك أقل من المعدل الطبيعي. جرب إيقاف الأجهزة قبل النوم بنصف ساعة، 
          وقلل السهر لتحسين جودة نومك.
        </Text>
      </View>

      {/* List of Health Data */}
      <FlatList
        data={healthData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={item.image} style={styles.avatar} />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
              <Text style={styles.cardRole}>{item.role}</Text>
              <Text style={styles.cardDescription}>{item.description}</Text>
            </View>
            {item.checked && <FontAwesome5 name="check-circle" size={24} color="green" />}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 10, // Add some padding to avoid overlap with the header
  },
  wellnessCard: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 15,
    borderRadius: 10,
    elevation: 3,
  },
  wellnessTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  score: { color: '#008080', fontSize: 16, fontWeight: 'bold' },
  wellnessText: { color: '#666', marginTop: 5 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginBottom: 10,
    padding: 15,
    borderRadius: 10,
    elevation: 2,
  },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: 'bold' },
  cardSubtitle: { color: '#888', fontSize: 12 },
  cardRole: { color: '#008080', fontSize: 14, fontWeight: 'bold' },
  cardDescription: { color: '#666', fontSize: 12, marginTop: 5 },
});

export default DashboardScreen;