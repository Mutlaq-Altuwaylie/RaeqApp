// DashboardScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import useSleepData from './useSleepData';
import useSteamData from './useSteamData';
import { isSteamLinked } from './SteamAuth';
import { router } from 'expo-router';
import MoodReviewComponent from './MoodReviewComponent';
import SocialInteractionComponent from './SocialInteractionComponent';

interface SteamAccount {
  id: string;
  username: string;
  avatarUrl: string;
  linkedAt: string;
}

interface HealthDataItem {
  id: string;
  title: string;
  subtitle: string;
  role: string;
  description: string;
  image: any;
  checked: boolean;
  action?: () => void;
  showButton?: boolean;
  customComponent?: React.ReactNode;
  useCustomComponent?: boolean;
}

const DashboardScreen = () => {
  const [steamAccount, setSteamAccount] = useState<SteamAccount | null>(null);
  const [loadingAccount, setLoadingAccount] = useState(true);
  const [currentMood, setCurrentMood] = useState<number>(0);
  const [moodLabel, setMoodLabel] = useState<string>('');
  const [socialInteraction, setSocialInteraction] = useState({
    hasInteraction: false,
    duration: 0,
    feedback: ''
  });

  useEffect(() => {
    const loadAccount = async () => {
      setLoadingAccount(true);
      const account = await isSteamLinked();
      setSteamAccount(account);
      setLoadingAccount(false);
    };
    loadAccount();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const reloadAccount = async () => {
        const account = await isSteamLinked();
        setSteamAccount(account);
      };
      reloadAccount();
    }, [])
  );

  const handleMoodChange = (mood: number, label: string) => {
    setCurrentMood(mood);
    setMoodLabel(label);
  };

  const handleSocialInteractionUpdate = (hasInteraction: boolean, duration: number, feedback: string) => {
    setSocialInteraction({
      hasInteraction,
      duration,
      feedback
    });
  };

  const today = new Date();
  const { sleepData } = useSleepData(today);
  
  const { 
    todayGamingTime, 
    todayGamingDuration, 
    currentGame, 
    isLoading: steamDataLoading,
    error: steamError
  } = useSteamData(steamAccount?.id);

  const sleepDescription =
    sleepData < 5
      ? 'نومك أقل من المعدل الطبيعي، حاول تحسين جدولك.'
      : sleepData < 7
      ? 'جيد، لكن يمكنك تحسينه بنوم أكثر انتظامًا.'
      : 'نوم صحي، استمر على هذا النمط!';

  const getGamingDescription = () => {
    if (loadingAccount) return 'جاري التحقق من حساب Steam...';
    if (!steamAccount) return 'يرجى ربط حساب Steam لمشاهدة إحصائيات اللعب';
    if (steamDataLoading) return 'جاري تحميل بيانات اللعب...';
    if (steamError) return `حدث خطأ في تحميل بيانات Steam: ${steamError}`;
    
    if (currentGame) {
      return `تلعب حاليًا ${currentGame}${todayGamingTime !== 'No gaming today' ? ` منذ ${todayGamingTime}` : ''}.`;
    }
    
    if (todayGamingDuration === 'No gaming today') {
      return 'لم تلعب أي ألعاب اليوم.';
    }
    
    return `تم لعب الألعاب لمدة ${todayGamingDuration} اليوم.`;
  };

  const calculateMentalHealthScore = () => {
    if (!steamAccount || steamDataLoading) return '...';
    
    let score = 7.5;
    
    if (sleepData < 5) score -= 1;
    else if (sleepData >= 7) score += 1;
    
    if (currentMood > 0) {
      if (currentMood <= 2) score -= 0.5;
      else if (currentMood >= 4) score += 0.5;
    }
    
    if (todayGamingDuration && todayGamingDuration !== 'No gaming today') {
      const durationText = todayGamingDuration.toString();
      if (durationText.includes('3 ساعة') || 
          durationText.includes('4 ساعة') || 
          durationText.includes('5 ساعة')) {
        score -= 0.5;
      } else if (durationText.includes('6 ساعة') || parseInt(durationText) > 6) {
        score -= 1.5;
      }
    }
    
    // Factor in social interactions
    if (socialInteraction.hasInteraction) {
      if (socialInteraction.feedback === 'positive') {
        score += 0.5;
      } else if (socialInteraction.feedback === 'negative') {
        score -= 0.3;
      }
      
      // Bonus for having any social interaction
      score += 0.2;
    } else {
      // Slight penalty for no social interaction
      score -= 0.2;
    }
    
    score = Math.max(0, Math.min(10, score));
    return score.toFixed(1);
  };

  const healthData: HealthDataItem[] = [
    {
      id: '1',
      title: 'جلسة اللعب',
      subtitle: steamAccount ? 'متابعة مدة اللعب' : 'ربط حساب Steam',
      role: loadingAccount ? 'جاري التحميل...' : 
            steamAccount ? (steamDataLoading ? '...' : `مدة اللعب: ${todayGamingDuration}`) 
            : 'غير مربوط',
      description: getGamingDescription(),
      image: require('../assets/gaming_session.png'),
      checked: !!steamAccount,
      action: !steamAccount ? () => router.push('/SettingsScreen') : undefined,
      showButton: !steamAccount && !loadingAccount
    },
    {
      id: '2',
      title: 'جودة النوم',
      subtitle: 'تحليل نومك',
      role: `نمت ${sleepData} ساعات`,
      description: sleepDescription,
      image: require('../assets/sleep_quality.png'),
      checked: true,
    },
    {
      id: '3',
      title: 'المزاج اليومي',
      subtitle: 'كيف تشعر اليوم؟',
      role: currentMood > 0 ? `تقييم المزاج: ${currentMood}/5 - ${moodLabel}` : 'غير محدد بعد',
      description: currentMood <= 2 
        ? 'ربما تحتاج إلى استراحة من اللعب.' 
        : currentMood === 3 
          ? 'يوم عادي.' 
          : 'مزاج جيد، استمر!',
      image: require('../assets/mood_tracking.png'),
      checked: currentMood > 0,
      customComponent: (
        <View style={styles.moodCard}>
          <View style={styles.moodCardHeader}>
            <Image source={require('../assets/mood_tracking.png')} style={styles.avatar} />
            <View style={styles.moodCardHeaderText}>
              <Text style={styles.cardTitle}>المزاج اليومي</Text>
              <Text style={styles.cardSubtitle}>كيف تشعر اليوم؟</Text>
              <Text style={styles.cardRole}>
                {currentMood > 0 ? `تقييم المزاج: ${currentMood}/5 - ${moodLabel}` : 'غير محدد بعد'}
              </Text>
            </View>
            {currentMood > 0 && <FontAwesome5 name="check-circle" size={24} color="green" />}
          </View>
          <Text style={styles.cardDescription}>
            {currentMood <= 2 
              ? 'ربما تحتاج إلى استراحة من اللعب.' 
              : currentMood === 3 
                ? 'يوم عادي.' 
                : 'مزاج جيد، استمر!'}
          </Text>
          <MoodReviewComponent 
            onMoodSelected={handleMoodChange} 
            initialMood={currentMood} 
            style={styles.moodComponent}
          />
        </View>
      ),
      useCustomComponent: true
    },
    {
      id: '4',
      title: 'التواصل الاجتماعي',
      subtitle: 'تفاعلك مع الآخرين',
      role: socialInteraction.hasInteraction 
        ? `تفاعلت لمدة ${socialInteraction.duration} دقيقة`
        : '0 لقاءات اليوم',
      description: socialInteraction.hasInteraction
        ? socialInteraction.feedback === 'positive'
          ? 'التفاعل الاجتماعي مفيد لصحتك النفسية.'
          : socialInteraction.feedback === 'neutral'
            ? 'اللقاءات الاجتماعية مهمة لتوازن حياتك.'
            : 'حاول تحسين تجاربك الاجتماعية القادمة.'
        : 'لم تقم بمقابلة الأصدقاء أو العائلة اليوم.',
      image: require('../assets/social_interaction.png'),
      checked: socialInteraction.hasInteraction,
      customComponent: (
        <View style={styles.moodCard}>
          <View style={styles.moodCardHeader}>
            <Image source={require('../assets/social_interaction.png')} style={styles.avatar} />
            <View style={styles.moodCardHeaderText}>
              <Text style={styles.cardTitle}>التواصل الاجتماعي</Text>
              <Text style={styles.cardSubtitle}>تفاعلك مع الآخرين</Text>
              <Text style={styles.cardRole}>
                {socialInteraction.hasInteraction 
                  ? `تفاعلت لمدة ${socialInteraction.duration} دقيقة`
                  : '0 لقاءات اليوم'}
              </Text>
            </View>
            {socialInteraction.hasInteraction && <FontAwesome5 name="check-circle" size={24} color="green" />}
          </View>
          <Text style={styles.cardDescription}>
            {socialInteraction.hasInteraction
              ? socialInteraction.feedback === 'positive'
                ? 'التفاعل الاجتماعي مفيد لصحتك النفسية.'
                : socialInteraction.feedback === 'neutral'
                  ? 'اللقاءات الاجتماعية مهمة لتوازن حياتك.'
                  : 'حاول تحسين تجاربك الاجتماعية القادمة.'
              : 'لم تقم بمقابلة الأصدقاء أو العائلة اليوم.'}
          </Text>
          <SocialInteractionComponent 
            onInteractionUpdated={handleSocialInteractionUpdate}
            style={styles.moodComponent}
          />
        </View>
      ),
      useCustomComponent: true
    },
  ];

  const renderItem = ({ item }: { item: HealthDataItem }) => {
    if (item.useCustomComponent && item.customComponent) {
      return item.customComponent;
    }
    
    return (
      <TouchableOpacity 
        style={[
          styles.card,
          !steamAccount && item.id === '1' ? styles.unlinkedCard : null
        ]}
        onPress={item.action}
        disabled={!item.action}
      >
        <Image source={item.image} style={styles.avatar} />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
          <Text style={[
            styles.cardRole,
            !steamAccount && item.id === '1' ? styles.unlinkedText : null
          ]}>
            {item.role}
          </Text>
          <Text style={styles.cardDescription}>{item.description}</Text>
          
          {item.showButton && (
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => router.push('/SettingsScreen')}
            >
              <Text style={styles.linkButtonText}>ربط حساب Steam</Text>
            </TouchableOpacity>
          )}
          
          {item.id === '1' && steamDataLoading && (
            <ActivityIndicator size="small" color="#008080" style={{marginTop: 5}} />
          )}
        </View>
        {item.checked && <FontAwesome5 name="check-circle" size={24} color="green" />}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {!loadingAccount && !steamAccount && (
        <View style={styles.statusBanner}>
          <Text style={styles.statusText}>لرؤية إحصائيات اللعب، يرجى ربط حساب Steam</Text>
          <TouchableOpacity
            style={styles.bannerButton}
            onPress={() => router.push('/SettingsScreen')}
          >
            <Text style={styles.bannerButtonText}>الذهاب إلى الإعدادات</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.wellnessCard}>
        <Text style={styles.wellnessTitle}>تقييم الصحة النفسية</Text>
        <Text style={styles.score}>{calculateMentalHealthScore()}/10</Text>
        <Text style={styles.wellnessText}>
          {steamDataLoading ? 'جاري تحليل بياناتك...' :
            sleepData < 5
              ? 'نومك أقل من المعدل الطبيعي. جرب إيقاف الأجهزة قبل النوم بنصف ساعة، وقلل السهر لتحسين جودة نومك.'
              : todayGamingDuration && todayGamingDuration !== 'No gaming today' && todayGamingDuration.includes('6 ساعة')
                ? 'مدة اللعب طويلة اليوم. خذ استراحات متكررة وخصص وقتًا للأنشطة الأخرى.'
                : 'نومك يبدو جيدًا، حافظ على جدول منتظم لتحسين صحتك.'}
        </Text>
        {!steamAccount && !loadingAccount && (
          <Text style={styles.wellnessHint}>
            ربط حساب Steam سيساعد في تحليل تأثير الألعاب على صحتك
          </Text>
        )}
      </View>

      <FlatList
        data={healthData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={!steamAccount ? { paddingTop: 10 } : null}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', paddingTop: 10 },
  wellnessCard: { 
    backgroundColor: '#fff', 
    margin: 15, 
    padding: 15, 
    borderRadius: 10, 
    elevation: 3 
  },
  wellnessTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 5 
  },
  score: { 
    color: '#008080', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  wellnessText: { 
    color: '#666', 
    marginTop: 5 
  },
  wellnessHint: {
    color: '#1976d2',
    fontSize: 12,
    marginTop: 5,
    fontStyle: 'italic'
  },
  card: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    marginHorizontal: 15, 
    marginBottom: 10, 
    padding: 15, 
    borderRadius: 10, 
    elevation: 2 
  },
  moodCard: {
    alignItems: 'center',
    backgroundColor: '#fff', 
    marginHorizontal: 15, 
    marginBottom: 10, 
    padding: 15, 
    borderRadius: 10, 
    elevation: 2
  },
  moodCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  moodCardHeaderText: {
    flex: 1,
    marginLeft: 10
  },
  moodComponent: {
    alignItems: 'center',
    marginTop: 10
  },
  unlinkedCard: {
    borderColor: '#ff9800',
    borderWidth: 1,
    backgroundColor: '#fff8e1'
  },
  avatar: { 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    marginRight: 10 
  },
  cardContent: { 
    flex: 1 
  },
  cardTitle: { 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  cardSubtitle: { 
    color: '#888', 
    fontSize: 12 
  },
  cardRole: { 
    color: '#008080', 
    fontSize: 14, 
    fontWeight: 'bold' 
  },
  unlinkedText: {
    color: '#ff9800'
  },
  cardDescription: { 
    color: '#666', 
    fontSize: 12, 
    marginTop: 5 
  },
  linkButton: {
    backgroundColor: '#008080',
    padding: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 8
  },
  linkButtonText: {
    color: 'white',
    fontSize: 12
  },
  statusBanner: {
    backgroundColor: '#e3f2fd',
    padding: 15,
    marginHorizontal: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15
  },
  statusText: {
    color: '#1976d2',
    flex: 1
  },
  bannerButton: {
    backgroundColor: '#1976d2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginLeft: 10
  },
  bannerButtonText: {
    color: 'white',
    fontSize: 12
  }
});

export default DashboardScreen;