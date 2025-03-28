import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import {
  initialize,
  requestPermission,
  readRecords,
} from 'react-native-health-connect';
import { TimeRangeFilter } from 'react-native-health-connect/lib/typescript/types/base.types';

const useSleepData = (date: Date) => {
  const [sleepData, setSleepData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSleepData = async () => {
      try {
        // initialize the client
        const isInitialized = await initialize();
        if (!isInitialized) {
          throw new Error('Health Connect not initialized');
        }

        // request permissions
        const grantedPermissions = await requestPermission([
          { accessType: 'read', recordType: 'SleepSession' },
        ]);

        // check if granted
        if (!grantedPermissions) {
          throw new Error('Permissions not granted');
        }

        const { records } = await readRecords('SleepSession', {
          timeRangeFilter: {
            operator: 'between',
            startTime: '2025-03-25T12:00:00.405Z',
            endTime: '2025-03-26T23:53:15.405Z',
          },
        });

        setSleepData(records);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchSleepData();
  }, [date]);

  return { sleepData, loading, error };
};

export default useSleepData;