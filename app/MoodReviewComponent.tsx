import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';

interface MoodReviewProps {
  onMoodSelected: (mood: number, label: string) => void;
  initialMood?: number;
}

interface Mood {
  value: number;
  label: string;
  animationSource: any;
  description: string;
  defaultProgress?: number;
}

const MoodReviewComponent: React.FC<MoodReviewProps> = ({ onMoodSelected, initialMood = 0 }) => {
  const [selectedMood, setSelectedMood] = useState<number>(initialMood);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [lastSubmittedDate, setLastSubmittedDate] = useState<string>('');
  const animationRefs = useRef<React.RefObject<LottieView>[]>([]);
  
  const moods: Mood[] = [
    { 
      value: 1, 
      label: 'سيء جداً', 
      animationSource: require('../assets/Angry.json'), 
      description: 'يوم صعب',
      defaultProgress: 0.7
    },
    { 
      value: 2, 
      label: 'سيء', 
      animationSource: require('../assets/sad.json'), 
      description: 'يوم غير جيد',
      defaultProgress: 0.3
    },
    { 
      value: 3, 
      label: 'عادي', 
      animationSource: require('../assets/neutral.json'), 
      description: 'يوم عادي',
      defaultProgress: 0.5
    },
    { 
      value: 4, 
      label: 'جيد', 
      animationSource: require('../assets/smile.json'), 
      description: 'يوم جيد',
      defaultProgress: 0.4
    },
    { 
      value: 5, 
      label: 'ممتاز', 
      animationSource: require('../assets/happy.json'), 
      description: 'يوم رائع',
      defaultProgress: 0.48
    },
  ];

  // Initialize refs
  moods.forEach((_, i) => {
    animationRefs.current[i] = React.createRef<LottieView>();
  });

  // Check if mood was already submitted today
  useEffect(() => {
    const checkMoodSubmission = async () => {
      try {
        const storedData = await AsyncStorage.getItem('moodData');
        if (storedData) {
          const { mood, label, date } = JSON.parse(storedData);
          
          // Check if the stored date is today
          const today = new Date().toDateString();
          if (date === today) {
            setSelectedMood(mood);
            onMoodSelected(mood, label);
            setIsSubmitted(true);
            setLastSubmittedDate(date);
            
            // Play the animation for the stored mood
            const selectedIndex = moods.findIndex(m => m.value === mood);
            if (selectedIndex !== -1) {
              animationRefs.current[selectedIndex].current?.play();
              // Stop the animation after it plays once
              setTimeout(() => {
                animationRefs.current[selectedIndex].current?.pause();
              }, 1000);
            }
          } else {
            // Reset if it's a new day
            setIsSubmitted(false);
            setLastSubmittedDate('');
          }
        }
      } catch (error) {
        console.error('Error loading mood data:', error);
      }
    };
    
    checkMoodSubmission();
  }, [onMoodSelected]);

  const handleMoodSelect = (moodValue: number) => {
    if (isSubmitted) return;

    // Reset all animations first
    moods.forEach((_, index) => {
      animationRefs.current[index].current?.reset();
    });

    // If clicking the same mood again, toggle it off
    if (selectedMood === moodValue) {
      setSelectedMood(0);
      return;
    }

    setSelectedMood(moodValue);
    
    // Play the selected animation
    const selectedIndex = moods.findIndex(m => m.value === moodValue);
    if (selectedIndex !== -1) {
      animationRefs.current[selectedIndex].current?.play();
    }
  };
  
  // Inside the handleSubmit function, modify the code to properly stop the animation
const handleSubmit = async () => {
    if (selectedMood === 0) {
      Alert.alert('تنبيه', 'الرجاء اختيار مزاجك أولاً');
      return;
    }
    
    const selectedMoodObj = moods.find(m => m.value === selectedMood);
    if (!selectedMoodObj) return;
    
    try {
      const today = new Date().toDateString();
      const moodData = {
        mood: selectedMood,
        label: selectedMoodObj.label,
        date: today
      };
      
      await AsyncStorage.setItem('moodData', JSON.stringify(moodData));
      
      // First pause the animation
      const selectedIndex = moods.findIndex(m => m.value === selectedMood);
      if (selectedIndex !== -1) {
        // Stop animation and set to default progress
        animationRefs.current[selectedIndex].current?.pause();
        // Set to default progress frame
        setTimeout(() => {
          if (selectedMoodObj.defaultProgress) {
            animationRefs.current[selectedIndex].current?.play(0, selectedMoodObj.defaultProgress);
            animationRefs.current[selectedIndex].current?.pause();
          }
        }, 10);
      }
      
      // Then update state
      onMoodSelected(selectedMood, selectedMoodObj.label);
      setIsSubmitted(true);
      setLastSubmittedDate(today);
      
      Alert.alert('تم', 'تم تسجيل مزاجك لهذا اليوم');
    } catch (error) {
      console.error('Error saving mood data:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء حفظ البيانات');
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.moodsContainer}>
          {moods.map((mood, index) => (
            <TouchableOpacity
              key={mood.value}
              style={[
                styles.moodOption,
                selectedMood === mood.value && styles.selectedMood,
                isSubmitted && styles.disabledMood
              ]}
              onPress={() => handleMoodSelect(mood.value)}
              disabled={isSubmitted}
            >
              <LottieView
                ref={animationRefs.current[index]}
                source={mood.animationSource}
                style={styles.animation}
                loop={!isSubmitted && selectedMood === mood.value}
                autoPlay={false}
                progress={selectedMood === mood.value && isSubmitted ? mood.defaultProgress : undefined}
              />
            </TouchableOpacity>
          ))}
        </View>
        
        {selectedMood > 0 && (
          <Text style={styles.cardDescription}>
            {moods.find(m => m.value === selectedMood)?.description}
          </Text>
        )}
        
        {!isSubmitted && selectedMood > 0 && (
          <TouchableOpacity 
            style={styles.submitButton}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>تأكيد</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fff',
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
    fontWeight: 'bold',
    marginVertical: 5
  },
  cardDescription: { 
    color: '#666', 
    fontSize: 12, 
    marginTop: 5,
    textAlign: 'center'
  },
  moodsContainer: {
    alignItems: 'center', 
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 5,
  },
  moodOption: {
    alignItems: 'center',
    padding: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    width: 45,
    height: 45,
    justifyContent: 'center',
  },
  selectedMood: {
    alignItems: 'center', 
    borderColor: '#008080',
    backgroundColor: '#e6f7f7',
  },
  disabledMood: {
    opacity: 0.5,
  },
  animation: {
    width: 35,
    height: 35,
  },
  submitButton: {
    width: '100%',
    backgroundColor: '#00c4b4',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginTop: 8,
    alignItems: 'center',
    alignSelf: 'center',
  },
  submitButtonText: {
    alignItems: 'center',
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  }
});

export default MoodReviewComponent;