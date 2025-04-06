import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SocialInteractionProps {
  onInteractionUpdated: (hasInteraction: boolean, duration: number, feedback: string) => void;
  style?: any;
}

interface DailyInteractionData {
  date: string;
  hasInteraction: boolean;
  duration: number;
  feedback: string;
  lastUpdated: string;
}

const SocialInteractionComponent: React.FC<SocialInteractionProps> = ({ onInteractionUpdated, style }) => {
  const [hasInteraction, setHasInteraction] = useState<boolean>(false);
  const [interactionDuration, setInteractionDuration] = useState<number>(30);
  const [isDatePickerVisible, setDatePickerVisibility] = useState<boolean>(false);
  const [interactionFeedback, setInteractionFeedback] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>('');

  // Load saved data when component mounts
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setCurrentDate(today);
    loadInteractionData(today);
    
    // Check if day has changed or if it's midnight
    const intervalId = setInterval(() => {
      const now = new Date();
      const newDate = now.toISOString().split('T')[0];
      const hours = now.getHours();
      const minutes = now.getMinutes();
      
      if (newDate !== currentDate || (hours === 0 && minutes === 0)) {
        setCurrentDate(newDate);
        resetInteractionData();
        loadInteractionData(newDate);
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(intervalId);
  }, [currentDate]);

  // Load interaction data for the current day
  const loadInteractionData = async (date: string) => {
    try {
      const storedData = await AsyncStorage.getItem(`socialInteraction_${date}`);
      if (storedData) {
        const data: DailyInteractionData = JSON.parse(storedData);
        setHasInteraction(data.hasInteraction);
        setInteractionDuration(data.duration);
        setInteractionFeedback(data.feedback);
        setLastUpdatedTime(data.lastUpdated || '');
        onInteractionUpdated(data.hasInteraction, data.duration, data.feedback);
      } else {
        // No data for today, reset values
        resetInteractionData();
      }
    } catch (error) {
      console.error('Error loading interaction data:', error);
    }
  };

  // Save interaction data for the current day
  const saveInteractionData = async (newData?: Partial<DailyInteractionData>) => {
    try {
      const now = new Date();
      const timeString = now.toTimeString().split(' ')[0];
      
      const data: DailyInteractionData = {
        date: currentDate,
        hasInteraction,
        duration: interactionDuration,
        feedback: interactionFeedback,
        lastUpdated: timeString,
        ...newData
      };
      
      await AsyncStorage.setItem(`socialInteraction_${currentDate}`, JSON.stringify(data));
      setLastUpdatedTime(timeString);
    } catch (error) {
      console.error('Error saving interaction data:', error);
    }
  };

  // Reset interaction data when day changes or at midnight
  const resetInteractionData = () => {
    setHasInteraction(false);
    setInteractionDuration(30);
    setInteractionFeedback('');
    setLastUpdatedTime('');
    onInteractionUpdated(false, 0, '');
    
    // Also clear the AsyncStorage for the current day if it's midnight
    const now = new Date();
    if (now.getHours() === 0 && now.getMinutes() === 0) {
      AsyncStorage.removeItem(`socialInteraction_${currentDate}`)
        .catch(error => console.error('Error clearing storage:', error));
    }
  };

  const handleInteractionToggle = () => {
    const newValue = !hasInteraction;
    setHasInteraction(newValue);
    
    if (!newValue) {
      // Reset values when toggling off
      setInteractionDuration(30);
      setInteractionFeedback('');
      onInteractionUpdated(false, 0, '');
      saveInteractionData({
        hasInteraction: false,
        duration: 30,
        feedback: ''
      });
    } else {
      showDatePicker();
      saveInteractionData({ hasInteraction: true });
    }
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    // Calculate duration in minutes from the time picker
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const totalMinutes = (hours * 60) + minutes;
    
    // If total is 0, set to at least 1 minute
    const duration = totalMinutes === 0 ? 1 : totalMinutes;
    
    setInteractionDuration(duration);
    onInteractionUpdated(hasInteraction, duration, interactionFeedback);
    hideDatePicker();
    
    // Save after update
    saveInteractionData({ duration });
  };

  const handleFeedbackSelected = (feedback: string) => {
    setInteractionFeedback(feedback);
    onInteractionUpdated(hasInteraction, interactionDuration, feedback);
    
    // Save after update
    saveInteractionData({ feedback });
  };

  const renderFeedbackSelector = () => {
    return (
      <View style={styles.feedbackContainer}>
        <Text style={styles.feedbackQuestion}>كيف كان شعورك مع هذا التفاعل؟</Text>
        
        <View style={styles.feedbackOptions}>
          <TouchableOpacity 
            style={[
              styles.feedbackOption,
              interactionFeedback === 'positive' && styles.selectedFeedback
            ]}
            onPress={() => handleFeedbackSelected('positive')}
          >
            <FontAwesome5 
              name="thumbs-up" 
              size={24} 
              color={interactionFeedback === 'positive' ? 'white' : '#4CAF50'} 
            />
            <Text style={[
              styles.feedbackText,
              interactionFeedback === 'positive' && styles.selectedFeedbackText
            ]}>إيجابي</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.feedbackOption,
              interactionFeedback === 'neutral' && styles.selectedFeedback,
              { backgroundColor: interactionFeedback === 'neutral' ? '#FFC107' : '#fff8e1' }
            ]}
            onPress={() => handleFeedbackSelected('neutral')}
          >
            <FontAwesome5 
              name="meh" 
              size={24} 
              color={interactionFeedback === 'neutral' ? 'white' : '#FFC107'} 
            />
            <Text style={[
              styles.feedbackText,
              interactionFeedback === 'neutral' && styles.selectedFeedbackText
            ]}>محايد</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.feedbackOption,
              interactionFeedback === 'negative' && styles.selectedFeedback,
              { backgroundColor: interactionFeedback === 'negative' ? '#F44336' : '#ffebee' }
            ]}
            onPress={() => handleFeedbackSelected('negative')}
          >
            <FontAwesome5 
              name="thumbs-down" 
              size={24} 
              color={interactionFeedback === 'negative' ? 'white' : '#F44336'} 
            />
            <Text style={[
              styles.feedbackText,
              interactionFeedback === 'negative' && styles.selectedFeedbackText
            ]}>سلبي</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const getFeedbackEmoji = () => {
    switch (interactionFeedback) {
      case 'positive':
        return <FontAwesome5 name="smile" size={16} color="#4CAF50" />;
      case 'neutral':
        return <FontAwesome5 name="meh" size={16} color="#FFC107" />;
      case 'negative':
        return <FontAwesome5 name="frown" size={16} color="#F44336" />;
      default:
        return null;
    }
  };

  const getSummaryText = () => {
    if (!hasInteraction) return '';
    
    // Convert total minutes to hours and minutes for display
    const hours = Math.floor(interactionDuration / 60);
    const minutes = interactionDuration % 60;
    
    let durationText = '';
    if (hours > 0) {
      durationText = `${hours} ساعة`;
      if (minutes > 0) {
        durationText += ` و ${minutes} دقيقة`;
      }
    } else {
      durationText = `${minutes} دقيقة`;
    }
    
    if (!interactionFeedback) return `تفاعل لمدة ${durationText}`;
    
    let feedbackText = '';
    switch (interactionFeedback) {
      case 'positive':
        feedbackText = 'شعور إيجابي';
        break;
      case 'neutral':
        feedbackText = 'شعور محايد';
        break;
      case 'negative':
        feedbackText = 'شعور سلبي';
        break;
    }
    
    return `تفاعل لمدة ${durationText}، ${feedbackText}`;
  };

  // Create a Date object for time picker to set hours and minutes
  const getTimeDate = () => {
    const hours = Math.floor(interactionDuration / 60);
    const minutes = interactionDuration % 60;
    
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);
    
    return date;
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={styles.title}>هل قابلت أحداً اليوم؟</Text>
        <TouchableOpacity 
          style={[styles.checkbox, hasInteraction && styles.checkboxActive]}
          onPress={handleInteractionToggle}
        >
          {hasInteraction && <FontAwesome5 name="check" size={16} color="white" />}
        </TouchableOpacity>
      </View>

      {hasInteraction && (
        <View style={styles.contentContainer}>
          <View style={styles.summary}>
            <Text style={styles.summaryText}>
              {getSummaryText()}
              {' '}{getFeedbackEmoji()}
            </Text>
            {lastUpdatedTime && (
              <Text style={styles.lastUpdatedText}>
                آخر تحديث: {lastUpdatedTime}
              </Text>
            )}
          </View>

          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="time"
            date={getTimeDate()}
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
            is24Hour={true}
            headerTextIOS="حدد مدة التفاعل"
            confirmTextIOS="تأكيد"
            cancelTextIOS="إلغاء"
          />
          
          <TouchableOpacity 
            style={styles.editButton}
            onPress={showDatePicker}
          >
            <Text style={styles.editButtonText}>تعديل المدة</Text>
          </TouchableOpacity>

          {!interactionFeedback && renderFeedbackSelector()}
          
          {interactionFeedback && (
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => {
                setInteractionFeedback('');
                saveInteractionData({ feedback: '' });
              }}
            >
              <Text style={styles.editButtonText}>تغيير التقييم</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#008080',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: '#008080',
  },
  contentContainer: {
    width: '100%',
    alignItems: 'center',
  },
  summary: {
    marginVertical: 10,
    padding: 8,
    backgroundColor: '#e3f2fd',
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  summaryText: {
    fontSize: 14,
    marginBottom: 4,
  },
  lastUpdatedText: {
    fontSize: 12,
    color: '#666',
  },
  feedbackContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 15,
  },
  feedbackQuestion: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  feedbackOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  feedbackOption: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    width: '30%',
  },
  selectedFeedback: {
    backgroundColor: '#4CAF50',
  },
  feedbackText: {
    marginTop: 5,
    fontSize: 12,
  },
  selectedFeedbackText: {
    color: 'white',
    fontWeight: 'bold',
  },
  editButton: {
    marginTop: 10,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 5,
  },
  editButtonText: {
    color: '#008080',
    fontSize: 12,
  },
});

export default SocialInteractionComponent;