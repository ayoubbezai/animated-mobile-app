import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable } from 'react-native';
import { Animated } from 'react-native';
import BottomTabBar from '../../components/BottomTabBar';
import { Ionicons } from '@expo/vector-icons';

const primary = "#F78F2A";
const dark = "#121212";
const light = "#F8F8F8";
const gray = "#E0E0E0";
const white = "#FFFFFF";

const sessions = [
  {
    id: '1', 
    subject: 'Mathematics', 
    date: 'May 12, 2023', 
    time: '10:00 AM - 12:30 PM', 
    description: 'Covered Algebra basics and quadratic equations with practice problems.', 
    hours: '2.5 hours', 
    price: '3000 DA', 
    rating: 4, 
    status: 'completed'
  },
  {
    id: '2', 
    subject: 'Physics', 
    date: 'May 10, 2023', 
    time: '2:00 PM - 4:00 PM', 
    description: 'Newtonian mechanics with focus on kinematics and dynamics.', 
    hours: '2 hours', 
    price: '2500 DA', 
    rating: 5, 
    status: 'completed'
  },
  {
    id: '3', 
    subject: 'Chemistry', 
    date: 'May 8, 2023', 
    time: '9:00 AM - 10:30 AM', 
    description: 'Chemical bonding and molecular structure with examples.', 
    hours: '1.5 hours', 
    price: '2000 DA', 
    rating: 3, 
    status: 'completed'
  },
  {
    id: '4', 
    subject: 'Computer Science', 
    date: 'Tomorrow', 
    time: '11:00 AM - 1:00 PM', 
    description: 'Introduction to algorithms and programming concepts.', 
    hours: '2 hours', 
    price: '2600 DA', 
    status: 'upcoming'
  },
  {
    id: '5', 
    subject: 'Biology', 
    date: 'June 5, 2023', 
    time: '3:00 PM - 5:00 PM', 
    description: 'Cell biology and genetics overview.', 
    hours: '2 hours', 
    price: '2200 DA', 
    status: 'cancelled'
  }
];

const statusTabs = [
  { key: 'all', label: 'All', icon: 'grid' },
  { key: 'upcoming', label: 'Upcoming', icon: 'close' },
  { key: 'completed', label: 'Completed', icon: 'checkmark-done' },
  { key: 'cancelled', label: 'Cancelled', icon: 'close' },
];

export default function SessionsScreen() {
  const [activeTab, setActiveTab] = React.useState('all');
  const [filterModalVisible, setFilterModalVisible] = React.useState(false);
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const filteredSessions = activeTab === 'all' ? sessions : sessions.filter(s => s.status === activeTab);

  // Fade-in animation for session cards
  const fadeAnims = React.useRef(filteredSessions.map(() => new Animated.Value(0))).current;
  React.useEffect(() => {
    fadeAnims.forEach(anim => anim.setValue(0));
    Animated.stagger(80, fadeAnims.map(anim =>
      Animated.timing(anim, { toValue: 1, duration: 400, useNativeDriver: true })
    )).start();
  }, [activeTab, filteredSessions.length]);

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0],
    extrapolate: 'clamp'
  });

  return (
    <View style={styles.root}>
      {/* Floating Header */}
      <Animated.View style={[styles.floatingHeader, { opacity: headerOpacity }]}> 
        <Text style={styles.headerTitle}>My Sessions</Text>
        <TouchableOpacity style={styles.filterButton} activeOpacity={0.7} onPress={() => setFilterModalVisible(true)}>
          <Ionicons name="options" size={20} color={dark} />
        </TouchableOpacity>
      </Animated.View>

      {/* Filter Modal */}
      <Modal
        visible={filterModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Sessions</Text>
              <Pressable onPress={() => setFilterModalVisible(false)} style={styles.modalCloseBtn}>
                <Ionicons name="close" size={24} color={dark} />
              </Pressable>
            </View>
            <View style={styles.statusTabsModalContainer}>
              {statusTabs.map(tab => (
                <TouchableOpacity
                  key={tab.key}
                  style={[styles.statusTab, activeTab === tab.key && styles.activeTab]}
                  onPress={() => {
                    setActiveTab(tab.key);
                    setFilterModalVisible(false);
                  }}
                  activeOpacity={0.8}
                >
                  <Ionicons 
                    name={tab.icon as any} 
                    size={18} 
                    color={activeTab === tab.key ? white : dark} 
                    style={styles.tabIcon}
                  />
                  <Text style={[styles.statusTabText, activeTab === tab.key && styles.activeTabText]}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>

      <Animated.ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* Main Header removed for cleaner UI */}
        {/* Sessions List */}
        <View style={styles.sessionsContainer}>
          {filteredSessions.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="document-text-outline" size={48} color={gray} />
              <Text style={styles.emptyText}>No sessions found</Text>
              <Text style={styles.emptySubtext}>Try changing your filters</Text>
            </View>
          ) : (
            filteredSessions.map((session, idx) => (
              <Animated.View
                key={session.id}
                style={[
                  styles.sessionCard,
                  session.status === 'cancelled' && styles.cancelledCard,
                  { opacity: fadeAnims[idx], transform: [{ translateY: fadeAnims[idx].interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }] }
                ]}
              >
                {/* Status Indicator */}
                <View style={[
                  styles.statusIndicator,
                  session.status === 'completed' && styles.completedIndicator,
                  session.status === 'upcoming' && styles.upcomingIndicator,
                  session.status === 'cancelled' && styles.cancelledIndicator
                ]} />
                {/* Session Content */}
                <TouchableOpacity
                  style={styles.sessionContent}
                  activeOpacity={0.93}
                  onPress={() => { /* Could open session details modal */ }}
                >
                  {/* Session Header */}
                  <View style={styles.sessionHeader}>
                    <View>
                      <Text style={styles.sessionSubject}>{session.subject}</Text>
                      <Text style={styles.sessionDate}>{session.date}</Text>
                    </View>
                    {session.status === 'completed' && session.rating && (
                      <TouchableOpacity style={styles.ratingBadge} activeOpacity={0.7}>
                        <Ionicons name="star" size={14} color={white} />
                        <Text style={styles.ratingBadgeText}>Rated {session.rating}/5</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  {/* Session Details */}
                  <View style={styles.sessionDetails}>
                    <View style={styles.detailRow}>
                      <Ionicons name="time-outline" size={16} color="#666" />
                      <Text style={styles.detailText}>{session.time}</Text>
                    </View>
                    <Text style={styles.sessionDescription}>{session.description}</Text>
                  </View>
                  {/* Session Footer */}
                  <View style={styles.cardFooter}>
                    <View style={styles.priceContainer}>
                      <Text style={styles.price}>{session.price}</Text>
                      <Text style={styles.hours}>{session.hours}</Text>
                    </View>
                    {session.status === 'completed' ? (
                      <TouchableOpacity 
                        style={[
                          styles.actionButton,
                          session.rating ? styles.changeRatingButton : styles.rateButton
                        ]} 
                        activeOpacity={0.8}
                      >
                        <Text style={styles.actionButtonText}>
                          {session.rating ? 'Change Rating' : 'Rate Session'}
                        </Text>
                      </TouchableOpacity>
                    ) : session.status === 'upcoming' ? (
                      <TouchableOpacity style={styles.startButton} activeOpacity={0.8}>
                        <Text style={styles.startButtonText}>Start Session</Text>
                        <Ionicons name="arrow-forward" size={16} color={white} />
                      </TouchableOpacity>
                    ) : (
                      <View style={styles.cancelledTag}>
                        <Text style={styles.cancelledTagText}>Cancelled</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))
          )}
        </View>
      </Animated.ScrollView>
      <BottomTabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: light,
  },
  floatingHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 16,
    backgroundColor: white,
    zIndex: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: dark,
  },
  filterButton: {
    backgroundColor: light,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 130,
  },
  mainHeader: {
    paddingTop: 80,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  mainHeaderTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: dark,
    marginBottom: 8,
  },
  mainHeaderSubtitle: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  statusTabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 24,
    marginBottom: 24,
    backgroundColor: light,
    borderRadius: 12,
    padding: 6,
  },
  statusTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: primary,
  },
  tabIcon: {
    marginRight: 8,
  },
  statusTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: white,
  },
  sessionsContainer: {
    paddingHorizontal: 24,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: dark,
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 4,
  },
  emptySubtext: {
    color: '#888',
    fontSize: 14,
  },
  sessionCard: {
    backgroundColor: white,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
    position: 'relative',
  },
  upcomingCard: {

  },
  cancelledCard: {
    opacity: 0.8,
  },
  statusIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  completedIndicator: {
    backgroundColor: primary,
  },
  upcomingIndicator: {
    backgroundColor: '#4CAF50',
  },
  cancelledIndicator: {
    backgroundColor: '#F44336',
  },
  sessionContent: {
    padding: 20,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sessionSubject: {
    fontSize: 18,
    fontWeight: '700',
    color: dark,
    marginBottom: 4,
  },
  sessionDate: {
    fontSize: 14,
    color: '#666',
  },
  ratingBadge: {
    backgroundColor: primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  ratingBadgeText: {
    color: white,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  sessionDetails: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  sessionDescription: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
    marginTop: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: gray,
    paddingTop: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: dark,
    marginRight: 12,
  },
  hours: {
    fontSize: 14,
    color: '#666',
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  rateButton: {
    backgroundColor: `${primary}20`,
  },
  changeRatingButton: {
    backgroundColor: `${primary}10`,
    borderWidth: 1,
    borderColor: `${primary}30`,
  },
  actionButtonText: {
    color: primary,
    fontWeight: '600',
    fontSize: 14,
  },
  startButton: {
    backgroundColor: primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  startButtonText: {
    color: white,
    fontWeight: '600',
    fontSize: 14,
    marginRight: 8,
  },
  cancelledTag: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  cancelledTagText: {
    color: '#9E9E9E',
    fontWeight: '600',
    fontSize: 14,
  },
  // Add these styles for modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 36,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: dark,
  },
  modalCloseBtn: {
    padding: 4,
  },
  statusTabsModalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: light,
    borderRadius: 12,
    padding: 6,
  },
});