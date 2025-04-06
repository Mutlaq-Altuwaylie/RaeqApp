import { useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import AppleHealthKit, {
  HealthInputOptions,
  HealthKitPermissions,
} from 'react-native-health';
import {
  initialize,
  requestPermission,
  readRecords,
} from 'react-native-health-connect';

const permissions = {
  permissions: {
    read: [
      AppleHealthKit.Constants.Permissions.SleepAnalysis,
    ],
    write: [],
  },
};

const useSleepData = (date) => {
  const [sleepData, setSleepData] = useState(0);
  const [hasPermissions, setHasPermission] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [androidPermissionsGranted, setAndroidPermissionsGranted] = useState(false);
  const permissionRequestInProgress = useRef(false);

  // iOS - HealthKit
  useEffect(() => {
    if (Platform.OS !== 'ios') {
      return;
    }
    
    AppleHealthKit.isAvailable((err, isAvailable) => {
      if (err) {
        console.log('Error checking availability');
        return;
      }
      if (!isAvailable) {
        console.log('Apple Health not available');
        return;
      }
      
      AppleHealthKit.initHealthKit(permissions, (err) => {
        if (err) {
          console.log('Error getting permissions');
          return;
        }
        setHasPermission(true);
      });
    });
  }, []);

  useEffect(() => {
    if (!hasPermissions || Platform.OS !== 'ios') {
      return;
    }

    // Set start and end time to cover the entire day
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const options = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      limit: 100,
    };

    AppleHealthKit.getSleepSamples(options, (err, results) => {
      if (err) {
        console.log('Error getting sleep data:', err);
        return;
      }
      
      try {
        // Calculate total sleep duration in hours
        let totalSleepMs = 0;
        
        results.forEach(sample => {
          // Only count samples that represent actual sleep (asleep)
          if (sample.value === 1 || sample.value === 3 || sample.value === 4 || sample.value === 5) {
            const startTime = new Date(sample.startDate).getTime();
            const endTime = new Date(sample.endDate).getTime();
            totalSleepMs += (endTime - startTime);
          }
        });
        
        // Convert milliseconds to hours with 1 decimal place
        const sleepHours = parseFloat((totalSleepMs / (1000 * 60 * 60)).toFixed(1));
        setSleepData(sleepHours);
      } catch (error) {
        console.log('Error processing sleep data:', error);
        // Return a default value in case of error
        setSleepData(0);
      }
    });
  }, [hasPermissions, date]);

  // Android - First initialize Health Connect
  useEffect(() => {
    if (Platform.OS !== 'android') {
      return;
    }

    const initHealthConnect = async () => {
      try {
        const initialized = await initialize();
        setIsInitialized(initialized);
      } catch (err) {
        console.error('Error initializing Health Connect:', err);
      }
    };

    initHealthConnect();
  }, []);

  // Android - Then request permissions only once
  useEffect(() => {
    if (Platform.OS !== 'android' || !isInitialized || androidPermissionsGranted || permissionRequestInProgress.current) {
      return;
    }

    const requestHealthPermissions = async () => {
      try {
        permissionRequestInProgress.current = true;
        const granted = await requestPermission([
          { accessType: 'read', recordType: 'SleepSession' },
        ]);
        permissionRequestInProgress.current = false;
        setAndroidPermissionsGranted(granted);
      } catch (err) {
        permissionRequestInProgress.current = false;
        console.error('Error requesting permissions:', err);
      }
    };

    requestHealthPermissions();
  }, [isInitialized]);

  // Android - Only read data after permissions are granted
  useEffect(() => {
    if (Platform.OS !== 'android' || !isInitialized || !androidPermissionsGranted) {
      return;
    }

    const readSleepData = async () => {
      try {
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);

        const timeRangeFilter = {
          operator: 'between',
          startTime: startDate.toISOString(),
          endTime: endDate.toISOString(),
        };

        // Sleep Sessions
        const response = await readRecords('SleepSession', { timeRangeFilter });
        console.log('Sleep sessions response:', JSON.stringify(response));
        
        let totalSleepMs = 0;
        
        // Access the records array from the response
        if (response && response.records && Array.isArray(response.records)) {
          response.records.forEach(session => {
            const startTime = new Date(session.startTime).getTime();
            const endTime = new Date(session.endTime).getTime();
            totalSleepMs += (endTime - startTime);
            
            console.log(`Sleep session: ${new Date(startTime).toLocaleString()} to ${new Date(endTime).toLocaleString()}`);
          });
        } else {
          console.log('No sleep sessions found or invalid response format:', response);
        }
        
        // Convert milliseconds to hours with 1 decimal place
        const sleepHours = parseFloat((totalSleepMs / (1000 * 60 * 60)).toFixed(1));
        setSleepData(sleepHours);
        console.log(`Total sleep hours: ${sleepHours}`);
      } catch (err) {
        console.error('Error reading sleep data:', err);
        // Return a default value in case of error
        setSleepData(0);
      }
    };

    readSleepData();
  }, [date, androidPermissionsGranted, isInitialized]);

  return {
    sleepData,
  };
};

export default useSleepData;