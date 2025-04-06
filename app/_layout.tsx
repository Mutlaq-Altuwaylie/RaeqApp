import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Linking } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

SplashScreen.preventAutoHideAsync();

// Helper functions
const extractSteamIdFromUrl = (url: string): string | null => {
  const matches = url.match(/\/auth\/steam\?id=(\d+)/);
  return matches ? matches[1] : null;
};

const fetchSteamUserData = async (steamId: string) => {
  const STEAM_API_KEY = Constants.expoConfig?.extra?.steamApiKey;
  if (!STEAM_API_KEY) return null;

  try {
    const response = await fetch(
      `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${STEAM_API_KEY}&steamids=${steamId}`
    );
    const data = await response.json();
    return data.response?.players?.[0] || null;
  } catch (error) {
    console.error('Failed to fetch Steam data:', error);
    return null;
  }
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const router = useRouter();

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Handle Steam OpenID redirect
  useEffect(() => {
    const handleDeepLink = async ({ url }: { url: string }) => {
      if (url.includes('/auth/steam')) {
        const steamId = extractSteamIdFromUrl(url);
        
        if (steamId) {
          // Fetch user data from Steam API
          const userData = await fetchSteamUserData(steamId);
          
          if (userData) {
            // Create account object
            const account = {
              id: steamId,
              username: userData.personaname,
              avatarUrl: userData.avatarfull,
              linkedAt: new Date().toISOString()
            };
            
            // Store in AsyncStorage
            await AsyncStorage.setItem('steamAccount', JSON.stringify(account));
            console.log('Steam account linked:', account);
          }
        }
        
        // Redirect to main app container after auth
        router.replace('/AppContainer');
      }
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);
    return () => subscription.remove();
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Auth screens (outside app container) */}
        <Stack.Screen name="index" />
        <Stack.Screen name="SignInScreen" />
        <Stack.Screen name="SignUpScreen" />
        <Stack.Screen name="NewPasswordScreen" />
        <Stack.Screen name="PasswordResetScreen" />
        <Stack.Screen name="OTPVerificationScreen" />
        
        {/* Main app container with tabs */}
        <Stack.Screen name="AppContainer" />
        
        {/* Individual screens that can be pushed on top */}
        <Stack.Screen name="SettingsScreen" />
      </Stack>
    </ThemeProvider>
  );
}