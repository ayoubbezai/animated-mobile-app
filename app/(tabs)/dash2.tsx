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
  TouchableOpacity,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { PanGestureHandler, ScrollView, State } from 'react-native-gesture-handler';
import Svg, { Path, Circle } from 'react-native-svg';

const { width, height } = Dimensions.get('window');
const primary = "#F78F2A";
const accent = "#FF5E5B";

// Sample data for the line graph
const monthlyData = [20, 35, 28, 42, 30, 25, 18, 22, 38, 45, 32, 40];
const maxValue = Math.max(...monthlyData);
const months = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

export default function StudentDashboard() {
  const videoRef = useRef<Video>(null);
  const [currentTime, setCurrentTime] = useState('Morning');
  const scrollViewRef = useRef<ScrollView>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [scrollEnabled, setScrollEnabled] = useState(false);
  const [isBlurred, setIsBlurred] = useState(false);

  // Animation values
  const maxTranslate = 0; 
  const minTranslate = height * 0.62;
  const dragY = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(minTranslate)).current;
  const lastOffset = useRef(minTranslate);

  useEffect(() => {
    const hour = new Date().getHours();
    setCurrentTime(hour < 12 ? 'Morning' : hour < 18 ? 'Afternoon' : 'Evening');
  }, []);

  const toggleBlur = () => {
    setIsBlurred(!isBlurred);
  };

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: dragY } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = ({ nativeEvent }: any) => {
    if (nativeEvent.oldState === State.ACTIVE) {
      const totalTranslate = nativeEvent.translationY + lastOffset.current;
      
      let toValue;
      if (totalTranslate < minTranslate * 0.5) {
        toValue = maxTranslate;
        setIsExpanded(true);
        setScrollEnabled(true);
        
    } else {
        toValue = minTranslate;
        setIsExpanded(false);
        setScrollEnabled(false);
        scrollViewRef.current?.scrollTo({ y: 18, animated: false });
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

  const generateLinePath = () => {
    const graphHeight = 80;
    const graphWidth = width - 60;
    const pointDistance = graphWidth / (monthlyData.length - 1);
    
    let path = `M 30 ${graphHeight - (monthlyData[0] / maxValue) * graphHeight}`;
    
    monthlyData.forEach((value, index) => {
      if (index > 0) {
        const x = 30 + (index * pointDistance);
        const y = graphHeight - (value / maxValue) * graphHeight;
        path += ` L ${x} ${y}`;
      }
    });
    
    return path;
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
          {isBlurred && (
            <BlurView
              style={styles.videoBlur}
              intensity={20}
              tint="dark"
            />
          )}
        </Animated.View>

        {/* Gradient Overlay */}
        <LinearGradient
          colors={['rgba(18,18,18,0.8)', 'rgba(247,143,42,0.3)', 'rgba(18,18,18,0.8)']}
          style={styles.gradientOverlay}
        />

        {/* Centered Logo and Tagline */}
        <Animated.View style={[styles.heroLogoContainer, { opacity: videoOpacity }]}> 
          <BlurView intensity={30} tint="light" style={styles.logoContainer}>
            <Image
              source={require('../../assets/images/Group 1000004492.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </BlurView>
          <View style={styles.brandContainer}>
            <Text style={styles.brandWE}>WE</Text>
            <Text style={styles.brandXPLAIN}>XPLAIN</Text>
          </View>
          <Text style={styles.heroTagline}>Empowering your learning journey</Text>
          <TouchableOpacity style={styles.bookSessionBtnWrap} onPress={() => { /* TODO: Implement booking */ }} activeOpacity={0.85}>
            <BlurView intensity={30} tint="light" style={styles.bookSessionBtnBlur}>
              <LinearGradient
                colors={[primary, '#FFB86C']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.bookSessionBtnGradient}
              >
                <Text style={styles.bookSessionBtnText}>Book a Session</Text>
              </LinearGradient>
            </BlurView>
          </TouchableOpacity>
        </Animated.View>

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
        activeOffsetY={[0, 1]}
      >
        <Animated.View style={[
          styles.modalCard,
          { transform: [{ translateY: modalTranslate }] },
        ]}>
          <View style={styles.modalHandle} />
          <ScrollView
            ref={scrollViewRef}
            style={styles.modalScrollContent}
            scrollEnabled={scrollEnabled}
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
                <Text style={styles.statNumber}>2400DA</Text>
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
                  date: 'May 12, 2025',
                  description: 'Covered Algebra basics and quadratic equations with practice problems.',
                  hours: '2.5 hours',
                  price: '1200 DA'
                },
                {
                  subject: 'Physics',
                  date: 'May 10, 2025',
                  description: 'Newtonian mechanics with focus on kinematics and dynamics.',
                  hours: '2 hours',
                  price: '2500 DA'
                },
                {
                  subject: 'Chemistry',
                  date: 'May 8, 2025',
                  description: 'Chemical bonding and molecular structure with examples.',
                  hours: '1.5 hours',
                  price: '2000 DA'
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

      {/* Add extra blur to video when modal is expanded */}
      <Animated.View style={{ opacity: videoOpacity, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 2 }} pointerEvents="none">
        {isExpanded && (
          <BlurView intensity={30} tint="dark" style={{ flex: 1, width: '100%', height: '100%' }} />
        )}
      </Animated.View>
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
  videoBlur: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  videoGraphContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    zIndex: 5,
  },
  monthlyGraph: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 12,
    padding: 12,
    paddingBottom: 15,
  },
  graphHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  monthlyGraphTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  blurButton: {
    padding: 5,
  },
  lineGraphContainer: {
    height: 100,
    width: '100%',
  },
  monthLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    marginTop: 5,
  },
  monthLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 10,
    width: 20,
    textAlign: 'center',
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
    height: height,
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
    marginBottom: 10,
  },
  modalScrollContent: {
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 50,
    paddingTop:18,
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
    paddingVertical: 1,
    paddingBottom: 20,
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
    marginBottom: 80,
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
  heroLogoContainer: {
    position: 'absolute',
    top: height * 0.22, // Adjust as needed
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 5,
  },
  logoContainer: {
    width: width * 0.3, // Adjust as needed
    height: width * 0.3, // Adjust as needed
    marginBottom: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  brandContainer: {
    flexDirection: 'row',
    marginBottom: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandWE: {
    fontSize: 24,
    fontWeight: 'bold',
    color: primary,
    marginRight: 2,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  brandXPLAIN: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  heroTagline: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: 5,
  },
  bookSessionBtn: {
    backgroundColor: primary,
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 30,
    alignSelf: 'center',
    marginTop: 15,
    shadowColor: 'rgba(247,143,42,0.3)',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 5,
  },
  bookSessionBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bookSessionBtnWrap: {
    marginTop: 15,
  },
  bookSessionBtnBlur: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  bookSessionBtnGradient: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
});