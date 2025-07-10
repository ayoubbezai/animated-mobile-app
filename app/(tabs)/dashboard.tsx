import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Animated,
  Easing,
  StatusBar,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { PanGestureHandler, ScrollView, State } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');
const primary = "#F78F2A";
const accent = "#FF5E5B";

export default function StudentDashboard() {
  const videoRef = useRef<Video>(null);
  const [currentTime, setCurrentTime] = useState('Morning');
  const scrollViewRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Constants
  const maxTranslate = 0; 
  const minTranslate = height * 0.62;

  const dragY = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(minTranslate)).current;
  const lastOffset = useRef(minTranslate);

  useEffect(() => {
    const hour = new Date().getHours();
    setCurrentTime(hour < 12 ? 'Morning' : hour < 18 ? 'Afternoon' : 'Evening');
  }, []);

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: dragY } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = ({ nativeEvent }: any) => {
    if (nativeEvent.oldState === State.ACTIVE) {
      const totalTranslate = nativeEvent.translationY + lastOffset.current;
      
      let toValue;
      if (totalTranslate < minTranslate * 0.5) {
        toValue = maxTranslate; // Expanded
        setIsExpanded(true);
      } else {
        toValue = minTranslate; // Collapsed
        setIsExpanded(false);
      }

      toValue = Math.max(maxTranslate, Math.min(minTranslate, toValue));

      translateY.setValue(totalTranslate);
      dragY.setValue(0);
      lastOffset.current = toValue;

      Animated.timing(translateY, {
        toValue,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  };

  const modalTranslate = Animated.add(translateY, dragY).interpolate({
    inputRange: [maxTranslate, minTranslate],
    outputRange: [maxTranslate, minTranslate],
    extrapolate: 'clamp',
  });

  const videoOpacity = modalTranslate.interpolate({
    inputRange: [maxTranslate, minTranslate],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  // Handle scroll enabling/disabling based on modal state
  const handleScroll = (e) => {
    if (!isExpanded && e.nativeEvent.contentOffset.y <= 0) {
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Video Background */}
      <View style={styles.videoContainer}>
        <Animated.View style={{ opacity: videoOpacity }}>
          <Video
            ref={videoRef}
            source={require('../../assets/videos/1.mp4')}
            resizeMode={ResizeMode.COVER}
            shouldPlay
            isLooping
            isMuted
            style={styles.videoBackground}
          />
        </Animated.View>

        <LinearGradient
          colors={['rgba(18,18,18,0.8)', 'rgba(247,143,42,0.3)', 'rgba(18,18,18,0.8)']}
          style={styles.gradientOverlay}
        />

        {/* Top Bar */}
        <BlurView intensity={40} tint="dark" style={styles.topBar}>
          <Animated.View style={[styles.greetingContainer, { opacity: videoOpacity }]}>
            <Text style={styles.greetingText}>Good {currentTime},</Text>
            <Text style={styles.nameText}>Ayoub Bezai</Text>
          </Animated.View>

          <View style={styles.topBarRight}>
            <View style={styles.notifBadge}>
              <Ionicons name="notifications" size={22} color={primary} />
              <View style={styles.notifDot}><Text style={styles.notifDotText}>6</Text></View>
            </View>
            <Image source={require('../../assets/images/Group 1000004492.png')} style={styles.avatar} />
          </View>
        </BlurView>
      </View>

      {/* Draggable Modal */}
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
        activeOffsetY={[-10, 10]}
      >
        <Animated.View style={[
          styles.modalCard,
          { transform: [{ translateY: modalTranslate }] },
        ]}>
          <View style={styles.modalHandle} />
          <ScrollView
            ref={scrollViewRef}
            style={styles.modalScrollContent}
            scrollEnabled={isExpanded}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Stats Section */}
            <Text style={styles.sectionTitle}>Study Overview</Text>
            <View style={styles.statsContainer}>
              {/* Total Hours */}
              <View style={styles.statItem}>
                <View style={styles.statIconContainer}>
                  <Ionicons name="time-outline" size={20} color={primary} />
                </View>
                <Text style={styles.statNumber}>12.5</Text>
                <Text style={styles.statLabel}>Total Hours</Text>
              </View>
              
              {/* Total Sessions */}
              <View style={styles.statItem}>
                <View style={styles.statIconContainer}>
                  <Ionicons name="book-outline" size={20} color={primary} />
                </View>
                <Text style={styles.statNumber}>8</Text>
                <Text style={styles.statLabel}>Sessions</Text>
              </View>
              
              {/* Total Payments */}
              <View style={styles.statItem}>
                <View style={styles.statIconContainer}>
                  <Ionicons name="wallet-outline" size={20} color={primary} />
                </View>
                <Text style={styles.statNumber}>$240</Text>
                <Text style={styles.statLabel}>Payments</Text>
              </View>
            </View>
            
            {/* Hours Graph */}
            <View style={styles.graphContainer}>
              <Text style={styles.graphTitle}>Weekly Study Hours</Text>
              <View style={styles.graph}>
                {[4, 8, 6, 10, 7, 5, 3].map((value, index) => (
                  <View key={index} style={styles.graphBarContainer}>
                    <View style={[styles.graphBar, { height: `${value * 8}%` }]} />
                    <Text style={styles.graphLabel}>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}</Text>
                  </View>
                ))}
              </View>
            </View>
            
            {/* Previous Sessions */}
            <Text style={styles.sectionTitle}>Previous Sessions</Text>
            <View style={styles.sessionsContainer}>
              {[
                {
                  subject: 'Mathematics',
                  date: 'May 12, 2023',
                  description: 'Covered Algebra basics and quadratic equations with practice problems.',
                  hours: '2.5 hours',
                  price: '$30'
                },
                {
                  subject: 'Physics',
                  date: 'May 10, 2023',
                  description: 'Newtonian mechanics with focus on kinematics and dynamics.',
                  hours: '2 hours',
                  price: '$25'
                },
                {
                  subject: 'Chemistry',
                  date: 'May 8, 2023',
                  description: 'Chemical bonding and molecular structure with examples.',
                  hours: '1.5 hours',
                  price: '$20'
                }
              ].map((session, index) => (
                <View key={index} style={styles.sessionCard}>
                  <View style={styles.sessionHeader}>
                    <Text style={styles.sessionSubject}>{session.subject}</Text>
                    <Text style={styles.sessionDate}>{session.date}</Text>
                  </View>
                  <Text style={styles.sessionDescription}>
                    {session.description}
                  </Text>
                  <View style={styles.sessionFooter}>
                    <Text style={styles.sessionHours}>{session.hours}</Text>
                    <Text style={styles.sessionPrice}>{session.price}</Text>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        </Animated.View>
      </PanGestureHandler>

      {/* Bottom Navigation Tab */}
      <View style={styles.bottomTab}>
        <View style={styles.tabItem}>
          <Ionicons name="home" size={20} color={primary} />
          <Text style={[styles.tabText, { color: primary }]}>Home</Text>
        </View>
        <View style={styles.tabItem}>
          <Ionicons name="calendar" size={20} color="#999" />
        </View>
        <View style={styles.tabItem}>
          <Ionicons name="wallet" size={20} color="#999" />
        </View>
        <View style={styles.tabItem}>
          <Ionicons name="notifications" size={20} color="#999" />
        </View>
        <View style={styles.tabItem}>
          <Ionicons name="person" size={20} color="#999" />
        </View>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'white',
  },
  videoContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.65,
    zIndex: 1,
  },
  videoBackground: {
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 44,
    paddingBottom:15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  greetingContainer: {
    flex: 1,
  },
  greetingText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  nameText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '500',
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notifBadge: {
    position: 'relative',
    marginRight: 15,
  },
  notifDot: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifDotText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  modalCard: {
    position: 'absolute',
    top:0,
    left: 0,
    right: 0,
    height: height, // Full screen height
    backgroundColor: 'white',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    zIndex: 10,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
  },
  modalScrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100, // Extra space for bottom tab
  },
  bottomTab: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    zIndex: 20,
  },
  tabItem: {
    alignItems: 'center',
    flex: 1,
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 20,
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 15,
    width: '30%',
  },
  statIconContainer: {
    backgroundColor: '#f0e6d8',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  graphContainer: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  graphTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 15,
  },
  graph: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 150,
    paddingHorizontal: 10,
  },
  graphBarContainer: {
    alignItems: 'center',
    width: '12%',
  },
  graphBar: {
    width: '80%',
    backgroundColor: primary,
    borderRadius: 4,
    marginBottom: 5,
  },
  graphLabel: {
    fontSize: 12,
    color: '#666',
  },
  sessionsContainer: {
    marginBottom: 80, // Space for bottom tab
  },
  sessionCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sessionSubject: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  sessionDate: {
    fontSize: 12,
    color: '#666',
  },
  sessionDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 12,
    lineHeight: 20,
  },
  sessionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sessionHours: {
    fontSize: 14,
    color: primary,
    fontWeight: '500',
  },
  sessionPrice: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
});