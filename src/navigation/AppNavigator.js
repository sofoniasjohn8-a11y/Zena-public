import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';
import HomeScreen from '../screens/HomeScreen';
import SongScreen from '../screens/SongScreen';

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();

const HEADER_OPTS = {
  headerStyle:        { backgroundColor: '#1C1917' },
  headerTintColor:    '#FCD34D',
  headerTitleStyle:   { fontWeight: 'bold', fontSize: 14, color: '#FCD34D' },
  headerTitleAlign:   'center',
  headerBackTitleVisible: false,
};

function HomeStackNav() {
  return (
    <HomeStack.Navigator screenOptions={HEADER_OPTS}>
      <HomeStack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'ዜና በገና — መንፈሳዊ የዜማ መሳሪያ ማሰልጠኛ ተቋም', headerLeft: () => null }}
      />
    </HomeStack.Navigator>
  );
}

const SongStack = createNativeStackNavigator();
function SongStackNav() {
  return (
    <SongStack.Navigator screenOptions={HEADER_OPTS}>
      <SongStack.Screen
        name="Songs"
        component={SongScreen}
        options={{ title: 'የዝማሬ ቤተ-መጻሕፍት' }}
      />
    </SongStack.Navigator>
  );
}

const TAB_ITEMS = [
  { name: 'HomeTab', label: 'ዋና ገጽ',  icon: '🏠' },
  { name: 'SongsTab', label: 'ዝማሬዎች', icon: '🎵' },
];

function CustomTabBar({ state, navigation }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[
      styles.tabBar,
      { paddingBottom: insets.bottom, height: 56 + insets.bottom },
    ]}>
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const tab = TAB_ITEMS.find(t => t.name === route.name) ?? TAB_ITEMS[0];
        return (
          <TouchableOpacity
            key={route.key}
            style={styles.tab}
            onPress={() => navigation.navigate(route.name)}
            activeOpacity={0.75}
          >
            {focused && <View style={styles.activeIndicator} />}
            <Text style={[styles.tabIcon, { color: focused ? COLORS.navActive : COLORS.navInactive }]}>
              {tab.icon}
            </Text>
            <Text style={[styles.tabLabel, {
              color: focused ? COLORS.navActive : COLORS.navInactive,
              fontWeight: focused ? 'bold' : '600',
            }]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar:          { flexDirection: 'row', backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: COLORS.border, elevation: 8 },
  tab:             { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 8, height: 56 },
  activeIndicator: { position: 'absolute', top: 0, width: 32, height: 3, borderRadius: 2, backgroundColor: COLORS.navActive },
  tabIcon:         { fontSize: 20, marginBottom: 2 },
  tabLabel:        { fontSize: 10, textAlign: 'center' },
});

export default function AppNavigator() {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="HomeTab"  component={HomeStackNav} />
      <Tab.Screen name="SongsTab" component={SongStackNav} />
    </Tab.Navigator>
  );
}
