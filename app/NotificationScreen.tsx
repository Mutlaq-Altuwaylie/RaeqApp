import React from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const NotificationScreen = ({setActiveTab }) => {
  const router = useRouter();
  const notificationsData = [
    {
      id: '1',
      type: 'warning',
      title: 'وقت اللعب الطويل',
      message: 'لقد لعبت Apex Legends لمدة 4 ساعات متواصلة. حان وقت أخذ استراحة!',
      time: 'قبل 5 دقائق',
      icon: 'gamepad',
      read: false,
    },
    {
      id: '2',
      type: 'reminder',
      title: 'حان وقت النوم',
      message: 'تذكير: حسب جدولك، حان وقت الاستعداد للنوم للحصول على 8 ساعات من النوم الجيد',
      time: 'قبل 30 دقيقة',
      icon: 'bed',
      read: false,
    },
    {
      id: '3',
      type: 'social',
      title: 'التواصل العائلي',
      message: 'لم تقضِ وقتاً مع العائلة منذ 3 أيام. ما رأيك بزيارة قصيرة اليوم؟',
      time: 'قبل ساعتين',
      icon: 'users',
      read: true,
    },
    {
      id: '4',
      type: 'survey',
      title: 'تحديث المزاج اليومي',
      message: 'كيف تشعر اليوم؟ حان وقت إكمال استبيان المزاج اليومي للمتابعة',
      time: 'قبل 6 ساعات',
      icon: 'smile',
      read: true,
    },
    {
      id: '5',
      type: 'achievement',
      title: 'مبارك! شارة جديدة',
      message: 'أكملت شارة "التوازن الصحي" بنجاح. انقر للاطلاع على تفاصيل الشارة',
      time: 'قبل يوم واحد',
      icon: 'award',
      read: true,
    },
    {
      id: '6',
      type: 'health',
      title: 'تنبيه صحي',
      message: 'نمت أقل من 6 ساعات لثلاث ليالٍ متتالية. قد يؤثر هذا على صحتك النفسية',
      time: 'قبل يومين',
      icon: 'heart',
      read: true,
    },
    {
      id: '7',
      type: 'achievement',
      title: 'إنجاز جديد!',
      message: 'قمت بتقليل وقت اللعب بنسبة 20٪ هذا الأسبوع. استمر في العمل الجيد!',
      time: 'قبل 3 أيام',
      icon: 'trophy',
      read: true,
    },
  ];

  const getIconColor = (type) => {
    switch (type) {
      case 'warning':
        return '#e53935';
      case 'reminder':
        return '#1e88e5';
      case 'social':
        return '#009688';
      case 'survey':
        return '#9c27b0';
      case 'achievement':
        return '#ffc107';
      case 'health':
        return '#8bc34a';
      default:
        return '#757575';
    }
  };

  const getIconBackgroundColor = (type) => {
    switch (type) {
      case 'warning':
        return '#ffcdd2';
      case 'reminder':
        return '#bbdefb';
      case 'social':
        return '#b2dfdb';
      case 'survey':
        return '#e1bee7';
      case 'achievement':
        return '#ffecb3';
      case 'health':
        return '#dcedc8';
      default:
        return '#eeeeee';
    }
  };

  const renderNotificationItem = ({ item }) => (
    
    <TouchableOpacity 
      style={[styles.notificationCard, !item.read && styles.unreadCard]}
      onPress={() => {
        // Handle notification click based on type
        if (item.type === 'achievement') {
          setActiveTab('badges');
        }
      }}
    >
      <View 
        style={[
          styles.iconContainer, 
          { backgroundColor: getIconBackgroundColor(item.type) }
        ]}
      >
        <FontAwesome5 
          name={item.icon} 
          size={24} 
          color={getIconColor(item.type)} 
        />
      </View>
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          <Text style={styles.notificationTime}>{item.time}</Text>
        </View>
        <Text style={styles.notificationMessage}>{item.message}</Text>
      </View>
      {!item.read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Notification Count Summary */}
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>
          لديك <Text style={styles.summaryCount}>2</Text> إشعارات غير مقروءة
        </Text>
        <TouchableOpacity style={styles.markAllButton}>
          <Text style={styles.markAllText}>تحديد الكل كمقروء</Text>
        </TouchableOpacity>
      </View>

      {/* Notifications List */}
      <FlatList
        data={notificationsData}
        keyExtractor={(item) => item.id}
        renderItem={renderNotificationItem}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#00c4b4',
    padding: 20,
    paddingTop: 40,
  },
  appTitle: { 
    color: '#fff', 
    fontSize: 20, 
    fontWeight: 'bold' 
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  summaryTitle: {
    fontSize: 16,
    color: '#333',
  },
  summaryCount: {
    fontWeight: 'bold',
    color: '#e53935',
  },
  markAllButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
  },
  markAllText: {
    color: '#00c4b4',
    fontSize: 12,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 16,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 12,
    padding: 16,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    alignItems: 'center',
  },
  unreadCard: {
    backgroundColor: '#f0faff',
    borderLeftWidth: 4,
    borderLeftColor: '#00c4b4',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  notificationTime: {
    fontSize: 12,
    color: '#888',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#00c4b4',
    marginLeft: 8,
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

export default NotificationScreen;