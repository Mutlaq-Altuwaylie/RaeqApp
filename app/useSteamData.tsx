import { useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { AppState } from 'react-native';

type GamingData = {
  todayGamingTime: string | null;
  todayGamingDuration: string;
  currentGame: string | null;
  isLoading: boolean;
  error: string | null;
  debug?: string;
};

type SteamSession = {
  gameId: string;
  gameName: string;
  startTime: string;
  endTime?: string;
  durationMinutes: number;
  isEstimated?: boolean;
};

type StoredSessionState = {
  activeSession: SteamSession | null;
  sessions: SteamSession[];
  totalMinutes: number;
  firstGameTime: string | null;
  lastChecked: string;
};

const useSteamData = (steamId: string | undefined) => {
  const [gamingData, setGamingData] = useState<GamingData>({
    todayGamingTime: null,
    todayGamingDuration: 'No gaming today',
    currentGame: null,
    isLoading: true,
    error: null
  });

  // For debugging
  const [debugInfo, setDebugInfo] = useState<string>('');
  
  // Refs to track state between renders
  const activeSessionRef = useRef<SteamSession | null>(null);
  const todaySessionsRef = useRef<SteamSession[]>([]);
  const totalMinutesRef = useRef<number>(0);
  const firstGameTimeRef = useRef<Date | null>(null);
  const lastCheckedRef = useRef<Date>(new Date());
  const appStateRef = useRef(AppState.currentState);
  
  // Storage keys
  const getTodayString = (): string => {
    const today = new Date();
    return `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`;
  };
  
  const STORAGE_KEY = `@gaming_data_${getTodayString()}`;
  const ACTIVE_SESSION_KEY = '@active_session_state';
  
  const STEAM_API_KEY = Constants.expoConfig.extra.steamApiKey;
  
  // Check if a date is today
  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  // Check if we're within a reasonable time of the last check to consider
  // the session as continuous (e.g. 15 minutes)
  const isWithinContinuousSession = (lastChecked: Date): boolean => {
    const now = new Date();
    const minutesDiff = (now.getTime() - lastChecked.getTime()) / (60 * 1000);
    // If it's been less than 15 minutes, consider it a continuous session
    return minutesDiff < 15;
  };

  // Save active session state for app restarts
  const saveActiveSessionState = async (): Promise<void> => {
    try {
      const state: StoredSessionState = {
        activeSession: activeSessionRef.current,
        sessions: todaySessionsRef.current,
        totalMinutes: totalMinutesRef.current,
        firstGameTime: firstGameTimeRef.current ? firstGameTimeRef.current.toISOString() : null,
        lastChecked: new Date().toISOString()
      };
      await AsyncStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(state));
      console.log('Saved active session state');
    } catch (error) {
      console.error('Failed to save active session state:', error);
    }
  };

  // Load active session state after app restart
  const loadActiveSessionState = async (): Promise<boolean> => {
    try {
      const savedState = await AsyncStorage.getItem(ACTIVE_SESSION_KEY);
      if (savedState) {
        const state: StoredSessionState = JSON.parse(savedState);
        
        // Check if the saved state is from today, otherwise ignore it
        const savedLastChecked = new Date(state.lastChecked);
        if (!isToday(savedLastChecked)) {
          console.log('Saved session state is not from today, ignoring');
          await AsyncStorage.removeItem(ACTIVE_SESSION_KEY);
          return false;
        }
        
        // Restore state
        activeSessionRef.current = state.activeSession;
        todaySessionsRef.current = state.sessions || [];
        totalMinutesRef.current = state.totalMinutes || 0;
        firstGameTimeRef.current = state.firstGameTime ? new Date(state.firstGameTime) : null;
        lastCheckedRef.current = savedLastChecked;
        
        console.log('Loaded active session state:', state);
        setDebugInfo('Loaded active state: ' + JSON.stringify(state, null, 2));
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to load active session state:', error);
      return false;
    }
  };

  // Save all gaming data to storage
  const saveGamingData = async (): Promise<void> => {
    try {
      const dataToSave = {
        sessions: todaySessionsRef.current,
        totalMinutes: totalMinutesRef.current,
        firstGameTime: firstGameTimeRef.current ? firstGameTimeRef.current.toISOString() : null
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      // Also update the active state
      await saveActiveSessionState();
    } catch (error) {
      console.error('Failed to save gaming data:', error);
    }
  };

  // Load gaming data from storage
  const loadGamingData = async (): Promise<boolean> => {
    try {
      const savedData = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        todaySessionsRef.current = parsedData.sessions || [];
        totalMinutesRef.current = parsedData.totalMinutes || 0;
        firstGameTimeRef.current = parsedData.firstGameTime ? new Date(parsedData.firstGameTime) : null;
        
        console.log('Loaded saved gaming data:', parsedData);
        setDebugInfo('Loaded data: ' + JSON.stringify(parsedData, null, 2));
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to load gaming data:', error);
      return false;
    }
  };

  // Format duration (minutes) to a readable string
  const formatDuration = (minutes: number): string => {
    if (minutes <= 0) return 'No gaming today';
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours} ساعة و ${mins} دقيقة`;
    } else {
      return `${mins} دقيقة`;
    }
  };

  // Format time to a readable string
  const formatTime = (date: Date | null): string => {
    if (!date) return 'No gaming today';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Update UI with current gaming data
  const updateUI = (currentGame: string | null): void => {
    let totalDuration = totalMinutesRef.current;
    
    if (activeSessionRef.current) {
      const activeSessionDuration = Math.floor(
        (new Date().getTime() - new Date(activeSessionRef.current.startTime).getTime()) / (60 * 1000)
      );
      totalDuration += activeSessionDuration;
    }
    
    setGamingData({
      todayGamingTime: formatTime(firstGameTimeRef.current),
      todayGamingDuration: formatDuration(totalDuration),
      currentGame: currentGame,
      isLoading: false,
      error: null,
      debug: debugInfo
    });
  };

  // Process the active session when we detect the same game is still running
  const processActiveSession = (currentGameId: string | null, currentlyPlaying: string | null): void => {
    const now = new Date();
    
    // If we had an active session and enough time has passed since last check
    if (activeSessionRef.current) {
      const timeSinceLastCheck = Math.floor(
        (now.getTime() - lastCheckedRef.current.getTime()) / (60 * 1000)
      );
      
      // If it's been more than a threshold (e.g., 2 minutes) since last check
      // and the same game is still running, update the session duration
      if (timeSinceLastCheck >= 2 && 
          currentlyPlaying && 
          activeSessionRef.current.gameId === currentGameId) {
        
        console.log(`Game still running after ${timeSinceLastCheck} minutes, updating session`);
        
        // We don't need to create a new session, just continue using the active one
        // and update lastChecked for the next cycle
        lastCheckedRef.current = now;
        saveActiveSessionState();
      }
    }
  };

  // Fetch Steam data and update gaming info
  const fetchSteamData = async (): Promise<void> => {
    if (!steamId) {
      setGamingData(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: 'Steam account not linked' 
      }));
      return;
    }
    
    try {
      // Get player summary
      const playerSummaryUrl = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${STEAM_API_KEY}&steamids=${steamId}`;
      const playerSummaryResponse = await fetch(playerSummaryUrl);
      const playerSummaryData = await playerSummaryResponse.json();
      
      if (!playerSummaryData.response?.players?.length) {
        throw new Error('Invalid response from Steam API');
      }
      
      const playerInfo = playerSummaryData.response.players[0];
      const now = new Date();
      
      // Check if player is currently in game
      const currentlyPlaying = playerInfo.gameextrainfo || null;
      const currentGameId = playerInfo.gameid || null;
      
      console.log('Current state:', { 
        currentlyPlaying, 
        activeSession: activeSessionRef.current,
        totalMinutes: totalMinutesRef.current,
        sessions: todaySessionsRef.current.length
      });
      
      // If the same game is running from an active session, process it
      if (activeSessionRef.current && 
          currentlyPlaying && 
          activeSessionRef.current.gameId === currentGameId) {
        processActiveSession(currentGameId, currentlyPlaying);
      }
      // Case 1: Player started playing and we don't have an active session
      else if (currentlyPlaying && !activeSessionRef.current) {
        console.log('Starting new session:', currentlyPlaying);
        
        activeSessionRef.current = {
          gameId: currentGameId || '',
          gameName: currentlyPlaying,
          startTime: now.toISOString(),
          durationMinutes: 0
        };
        
        if (!firstGameTimeRef.current) {
          firstGameTimeRef.current = now;
        }
        
        // Save the active session state immediately
        await saveActiveSessionState();
      }
      // Case 2: Player was playing but now stopped
      else if (!currentlyPlaying && activeSessionRef.current) {
        console.log('Ending session');
        
        const sessionStart = new Date(activeSessionRef.current.startTime);
        const sessionDuration = Math.floor((now.getTime() - sessionStart.getTime()) / (60 * 1000));
        
        if (sessionDuration >= 1) {
          const completedSession: SteamSession = {
            ...activeSessionRef.current,
            endTime: now.toISOString(),
            durationMinutes: sessionDuration
          };
          
          todaySessionsRef.current.push(completedSession);
          totalMinutesRef.current += sessionDuration;
          
          await saveGamingData();
        }
        
        activeSessionRef.current = null;
        await saveActiveSessionState();
      }
      // Case 3: Player switched games
      else if (currentlyPlaying && activeSessionRef.current && 
               activeSessionRef.current.gameId !== currentGameId) {
        console.log('Switching games from', activeSessionRef.current.gameName, 'to', currentlyPlaying);
        
        const sessionStart = new Date(activeSessionRef.current.startTime);
        const sessionDuration = Math.floor((now.getTime() - sessionStart.getTime()) / (60 * 1000));
        
        if (sessionDuration >= 1) {
          const completedSession: SteamSession = {
            ...activeSessionRef.current,
            endTime: now.toISOString(),
            durationMinutes: sessionDuration
          };
          
          todaySessionsRef.current.push(completedSession);
          totalMinutesRef.current += sessionDuration;
        }
        
        activeSessionRef.current = {
          gameId: currentGameId || '',
          gameName: currentlyPlaying,
          startTime: now.toISOString(),
          durationMinutes: 0
        };
        
        await saveGamingData();
      }
      
      // Handle recently played games as backup
      try {
        const recentGamesUrl = `https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v1/?key=${STEAM_API_KEY}&steamid=${steamId}&format=json`;
        const recentGamesResponse = await fetch(recentGamesUrl);
        const recentGamesData = await recentGamesResponse.json();
        
        if (recentGamesData.response?.games) {
          recentGamesData.response.games.forEach((game: any) => {
            const lastPlayedDate = new Date(game.last_played * 1000);
            
            if (isToday(lastPlayedDate) && 
                todaySessionsRef.current.length === 0 && 
                !activeSessionRef.current &&
                !firstGameTimeRef.current &&
                game.playtime_2weeks > 0) {
              
              console.log('Found recent game played today:', game.name);
              
              if (!firstGameTimeRef.current) {
                firstGameTimeRef.current = lastPlayedDate;
              }
              
              if (totalMinutesRef.current === 0) {
                const estimatedMinutes = Math.min(game.playtime_2weeks, 60);
                totalMinutesRef.current = estimatedMinutes;
                
                todaySessionsRef.current.push({
                  gameId: game.appid.toString(),
                  gameName: game.name,
                  startTime: new Date(lastPlayedDate.getTime() - estimatedMinutes * 60 * 1000).toISOString(),
                  endTime: lastPlayedDate.toISOString(),
                  durationMinutes: estimatedMinutes,
                  isEstimated: true
                });
                
                saveGamingData();
              }
            }
          });
        }
      } catch (recentGamesError) {
        console.error('Error fetching recent games:', recentGamesError);
      }
      
      // Update lastChecked time
      lastCheckedRef.current = now;
      await saveActiveSessionState();
      
      updateUI(currentlyPlaying);
      
      setDebugInfo(prev => {
        const status = currentlyPlaying ? `Playing: ${currentlyPlaying}` : 'Not playing';
        const sessionInfo = activeSessionRef.current 
          ? `Active session: ${activeSessionRef.current.gameName}` 
          : 'No active session';
        const totalInfo = `Total: ${totalMinutesRef.current} minutes, ${todaySessionsRef.current.length} sessions`;
        
        return `${status}\n${sessionInfo}\n${totalInfo}\n\nPrevious: ${prev}`.substring(0, 500);
      });
      
    } catch (error) {
      console.error('Error fetching Steam data:', error);
      
      setGamingData(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to fetch Steam data: ' + (error instanceof Error ? error.message : 'Unknown error')
      }));
    }
  };

  // Handle app state changes
  const handleAppStateChange = (nextAppState: string) => {
    if (appStateRef.current === 'active' && nextAppState.match(/inactive|background/)) {
      // App is going into background
      console.log('App going to background, saving state');
      saveActiveSessionState();
    } else if (appStateRef.current.match(/inactive|background/) && nextAppState === 'active') {
      // App is coming to foreground
      console.log('App returning to foreground, checking session');
      
      // Check if we need to handle resumed session
      if (activeSessionRef.current && isWithinContinuousSession(lastCheckedRef.current)) {
        console.log('Continuing session after app return');
      }
      
      // Fetch fresh data right away when returning
      fetchSteamData();
    }
    
    appStateRef.current = nextAppState;
  };

  // Initialize and set up polling
  useEffect(() => {
    let isMounted = true;
    let intervalId: NodeJS.Timeout;
    
    const initialize = async () => {
      // Try to load active session state first
      const activeStateLoaded = await loadActiveSessionState();
      
      if (!activeStateLoaded) {
        // Fall back to regular gaming data if no active state
        await loadGamingData();
      }
      
      // Set up app state change listener
      const subscription = AppState.addEventListener('change', handleAppStateChange);
      
      console.log('Initial state:', {
        activeSession: activeSessionRef.current,
        sessions: todaySessionsRef.current.length,
        totalMinutes: totalMinutesRef.current,
        firstGameTime: firstGameTimeRef.current
      });
      
      await fetchSteamData();
      
      intervalId = setInterval(fetchSteamData, 60 * 1000);
      
      return () => {
        subscription.remove();
      };
    };
    
    initialize();
    
    return () => {
      isMounted = false;
      clearInterval(intervalId);
      
      // Save state when unmounting
      if (activeSessionRef.current) {
        const now = new Date();
        const sessionStart = new Date(activeSessionRef.current.startTime);
        const sessionDuration = Math.floor((now.getTime() - sessionStart.getTime()) / (60 * 1000));
        
        if (sessionDuration >= 1) {
          const completedSession: SteamSession = {
            ...activeSessionRef.current,
            endTime: now.toISOString(),
            durationMinutes: sessionDuration
          };
          
          todaySessionsRef.current.push(completedSession);
          totalMinutesRef.current += sessionDuration;
          
          saveGamingData();
        }
      }
    };
  }, [steamId]);
  
  return {
    ...gamingData,
    checkSession: () => ({
      active: activeSessionRef.current,
      minutes: totalMinutesRef.current,
      sessions: todaySessionsRef.current,
      debug: debugInfo
    })
  };
};

export default useSteamData;