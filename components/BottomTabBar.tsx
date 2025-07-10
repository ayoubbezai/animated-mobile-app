import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';

const primary = "#F78F2A";
const accent = "#FF5E5B";
const dark = "#121212";
const light = "#F8F8F8";

const tabs = [
  { 
    name: 'Home', 
    icon: 'home-outline' as keyof typeof Ionicons.glyphMap, 
    activeIcon: 'home' as keyof typeof Ionicons.glyphMap,
    route: '/dashboard' 
  },
  { 
    name: 'Sessions', 
    icon: 'calendar-outline' as keyof typeof Ionicons.glyphMap, 
    activeIcon: 'calendar' as keyof typeof Ionicons.glyphMap,
    route: '/sessions' 
  },
  { 
    name: 'Wallet', 
    icon: 'wallet-outline' as keyof typeof Ionicons.glyphMap, 
    activeIcon: 'wallet' as keyof typeof Ionicons.glyphMap,
    route: '/(tabs)/wallet' 
  },
  { 
    name: 'Inbox', 
    icon: 'chatbubble-ellipses-outline' as keyof typeof Ionicons.glyphMap, 
    activeIcon: 'chatbubble-ellipses' as keyof typeof Ionicons.glyphMap,
    route: '/(tabs)/notifications' 
  },
  { 
    name: 'Profile', 
    icon: 'person-outline' as keyof typeof Ionicons.glyphMap, 
    activeIcon: 'person' as keyof typeof Ionicons.glyphMap,
    route: '/(tabs)/profile' 
  },
];

export default function BottomTabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const indicatorPosition = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const activeIndex = tabs.findIndex(tab => pathname === tab.route);
    Animated.spring(indicatorPosition, {
      toValue: activeIndex,
      useNativeDriver: true,
      stiffness: 180,
      damping: 20,
    }).start();
  }, [pathname]);

  const tabWidth = 100 / tabs.length;

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {tabs.map((tab, index) => {
          const isActive = pathname === tab.route;
          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.tabItem}
              onPress={() => router.replace(tab.route as any)}
              activeOpacity={0.8}
            >
              <Ionicons 
                name={isActive ? tab.activeIcon : tab.icon} 
                size={24}
                color={isActive ? primary : '#888'}
              />
              <Text style={[styles.tabText, isActive && { color: primary, fontWeight: '700' }]}>
                {tab.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    zIndex : 1000
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 16,
    paddingVertical: 12,
    elevation: 8,
    shadowColor: dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  tabText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#888',
    letterSpacing: 0.2,
    marginTop: 2,
  },
});