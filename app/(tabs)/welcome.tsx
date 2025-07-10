import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, StatusBar, Animated, Easing, PanResponder } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');
const primary = "#F78F2A";
const secondary = "#FFD166";

export default function WelcomeScreen() {
  const videoRef = useRef<Video>(null);
  const [isReady, setIsReady] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(20)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  
  // Feature icons animation
  const featureAnim1 = useRef(new Animated.Value(0)).current;
  const featureAnim2 = useRef(new Animated.Value(0)).current;
  const featureAnim3 = useRef(new Animated.Value(0)).current;

  // Swipe button animations
  const swipeWidth = width * 0.7;
  const swipeAnim = useRef(new Animated.Value(0)).current;
  const swipeTextOpacity = useRef(new Animated.Value(1)).current;
  const swipeComplete = useRef(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        if (swipeComplete.current) return;
        
        const newX = Math.max(0, Math.min(gestureState.dx, swipeWidth - 60));
        swipeAnim.setValue(newX);
        
        // Fade out text as user swipes
        swipeTextOpacity.setValue(1 - (newX / (swipeWidth * 0.7)));
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (swipeComplete.current) return;
        
        if (gestureState.dx > swipeWidth * 0.7) {
          // Swipe completed
          swipeComplete.current = true;
          Animated.timing(swipeAnim, {
            toValue: swipeWidth - 60,
            duration: 200,
            useNativeDriver: false,
          }).start(() => {
            handleGetStarted();
          });
        } else {
          // Return to start position
          Animated.spring(swipeAnim, {
            toValue: 0,
            friction: 7,
            useNativeDriver: false,
          }).start();
          
          Animated.timing(swipeTextOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    // Start animations when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
      Animated.stagger(150, [
        Animated.timing(featureAnim1, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(featureAnim2, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(featureAnim3, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const handleGetStarted = () => {
    router.replace('/(tabs)/dashboard');
  };

  const handleVideoRef = (ref: Video) => {
    videoRef.current = ref;
    if (ref) {
      ref.playAsync();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Video Background */}
      <Video
        ref={handleVideoRef}
        source={require('../../assets/videos/2.mp4')}
        rate={1.0}
        volume={0.0}
        isMuted
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping
        style={styles.video}
        onLoad={() => setIsReady(true)}
      />
      
      {/* Blur overlay on top of the video */}
      <BlurView
        style={styles.video}
        intensity={40}
        tint="dark"
      />
      
      {/* Gradient overlay */}
      <LinearGradient
        colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)']}
        locations={[0, 0.5, 1]}
        style={styles.overlay}
      />
      
      {/* Content */}
      <Animated.View 
        style={[
          styles.content,
          { 
            opacity: fadeAnim,
            transform: [{ translateY: slideUpAnim }] 
          }
        ]}
      >
        {/* Logo with animation */}
        <Animated.View 
          style={[
            styles.logoContainer,
            { transform: [{ scale: scaleAnim }] }
          ]}
        >
          <Image
            source={require('../../assets/images/Group 1000004492.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>
        
        {/* Title with animated parts */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Welcome to </Text>
          <View style={styles.brandContainer}>
            <Text style={[styles.title, styles.we]}>WE</Text>
            <Text style={[styles.title, styles.xplain]}>XPLAIN</Text>
          </View>
        </View>
        
        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Get help from real tutors, anytime.
        </Text>
        
        {/* Description */}
        <Text style={styles.description}>
          Connect with qualified tutors for personalized learning support
        </Text>
        
        {/* Blur Swipe Button */}
        <View style={[styles.swipeContainer, { width: swipeWidth }]}>
          <BlurView intensity={30} tint="light" style={styles.blurBackground}>
            <Animated.Text 
              style={[
                styles.swipeText,
                { opacity: swipeTextOpacity }
              ]}
            >
              Swipe to get started
            </Animated.Text>
            
            <View style={styles.swipeTrack} />
            
            <Animated.View
              style={[
                styles.swipeThumb,
                {
                  transform: [{ translateX: swipeAnim }]
                }
              ]}
              {...panResponder.panHandlers}
            >
              <Ionicons name="arrow-forward" size={24} color="white" />
            </Animated.View>
          </BlurView>
        </View>
        
        {/* Features with staggered animation */}
        <View style={styles.features}>
          <Animated.View 
            style={[
              styles.feature, 
              { 
                opacity: featureAnim1,
                transform: [{ 
                  translateY: featureAnim1.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0]
                  }) 
                }] 
              }
            ]}
          >
            <View style={styles.featureIcon}>
              <Ionicons name="time" size={20} color={primary} />
            </View>
            <Text style={styles.featureText}>24/7 Available</Text>
          </Animated.View>
          
          <Animated.View 
            style={[
              styles.feature, 
              { 
                opacity: featureAnim2,
                transform: [{ 
                  translateY: featureAnim2.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0]
                  }) 
                }] 
              }
            ]}
          >
            <View style={styles.featureIcon}>
              <Ionicons name="people" size={20} color={primary} />
            </View>
            <Text style={styles.featureText}>Expert Tutors</Text>
          </Animated.View>
          
          <Animated.View 
            style={[
              styles.feature, 
              { 
                opacity: featureAnim3,
                transform: [{ 
                  translateY: featureAnim3.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0]
                  }) 
                }] 
              }
            ]}
          >
            <View style={styles.featureIcon}>
              <Ionicons name="shield-checkmark" size={20} color={primary} />
            </View>
            <Text style={styles.featureText}>Safe & Secure</Text>
          </Animated.View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width * 0.08,
    paddingTop: StatusBar.currentHeight || 40,
  },
  logoContainer: {
    marginBottom: height * 0.03,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  logo: {
    height: width * 0.2,
    width: width * 0.2,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: height * 0.01,
  },
  title: {
    color: 'white',
    fontSize: width * 0.08,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.5,
    lineHeight: width * 0.09,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  we: {
    color: primary,
    fontWeight: '800',
    marginTop: 5
  },
  xplain: {
    fontWeight: '700',
    color: 'white',
    marginTop: 5
  },
  subtitle: {
    color: 'white',
    fontSize: width * 0.05,
    textAlign: 'center',
    marginBottom: height * 0.01,
    opacity: 0.9,
    fontWeight: '500',
    letterSpacing: 0.3,
    marginTop: 5
  },
  description: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: width * 0.04,
    textAlign: 'center',
    marginBottom: height * 0.05,
    lineHeight: width * 0.06,
    maxWidth: '90%',
    fontWeight: '400',
  },
  // Swipe button styles
  swipeContainer: {
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    marginBottom: height * 0.05,
  },
  blurBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  swipeText: {
    color: 'white',
    fontSize: width * 0.04,
    fontWeight: '600',
    position: 'absolute',
    zIndex: 1,
  },
  swipeTrack: {
    position: 'absolute',
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
    width: '80%',
    borderRadius: 1,
  },
  swipeThumb: {
    position: 'absolute',
    left: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  features: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: width * 0.05,
    marginTop: height * 0.02,
  },
  feature: {
    alignItems: 'center',
    flex: 1,
  },
  featureIcon: {
    backgroundColor: 'rgba(247, 143, 42, 0.1)',
    padding: 10,
    borderRadius: 12,
    marginBottom: 8,
  },
  featureText: {
    color: 'white',
    fontSize: width * 0.03,
    fontWeight: '500',
    textAlign: 'center',
    opacity: 0.9,
  },
});