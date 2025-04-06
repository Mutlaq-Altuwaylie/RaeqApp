// utils/SteamAuth.ts
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import Constants from 'expo-constants';

const STEAM_API_KEY = Constants.expoConfig?.extra?.steamApiKey;

type SteamAccount = {
  id: string;
  username: string;
  avatarUrl: string;
  linkedAt: string;
};

export const initiateSteamLogin = async (): Promise<SteamAccount | null> => {
  // Use your GitHub Pages URL
  const returnUrl = 'https://mutlaq-altuwaylie.github.io/RaeqApp/steam-auth.html';
  const realm = 'https://mutlaq-altuwaylie.github.io'; // Base domain without path

  const authUrl = `https://steamcommunity.com/openid/login?` +
    `openid.ns=http://specs.openid.net/auth/2.0&` +
    `openid.mode=checkid_setup&` +
    `openid.return_to=${encodeURIComponent(returnUrl)}&` +
    `openid.realm=${encodeURIComponent(realm)}&` +
    `openid.identity=http://specs.openid.net/auth/2.0/identifier_select&` +
    `openid.claimed_id=http://specs.openid.net/auth/2.0/identifier_select`;

  try {
    // Open Steam login and wait for redirect to GitHub page
    const result = await WebBrowser.openAuthSessionAsync(authUrl, returnUrl);

    if (result.type === 'success') {
      // GitHub page will redirect to myapp://auth/steam?id=STEAM_ID
      // This will be handled by your _layout.tsx's Linking listener
      return null; // The actual account will be set via the deep link handler
    }
    return null;
  } catch (error) {
    Alert.alert('Error', 'Failed to authenticate with Steam');
    return null;
  }
};

// 2. Extract SteamID from OpenID response
const extractSteamIdFromUrl = (url: string): string | null => {
  const matches = url.match(/\/openid\/id\/(\d+)/);
  return matches ? matches[1] : null;
};

// 3. Fetch additional user data (optional)
const fetchSteamUserData = async (steamId: string) => {
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

// 4. Check if Steam is linked
export const isSteamLinked = async (): Promise<SteamAccount | null> => {
  const account = await AsyncStorage.getItem('steamAccount');
  return account ? JSON.parse(account) : null;
};

// 5. Unlink Steam
export const unlinkSteam = async (): Promise<void> => {
  await AsyncStorage.removeItem('steamAccount');
};