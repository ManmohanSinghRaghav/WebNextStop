import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, BackHandler } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// Import components
import { AppSidebar } from './components/AppSidebar';
import { TripTracking } from './components/TripTracking';
import { DriverDashboard } from './components/DriverDashboard';
import { RouteMap } from './components/RouteMap';
import { PassengerManagement } from './components/PassengerManagement';
import { EmergencyAlert } from './components/EmergencyAlert';
import { ScheduleFeed } from './components/ScheduleFeed';
import { CompletedTrips } from './components/CompletedTrips';
import { EmailAuth } from './components/EmailAuth';
import { SidebarProvider } from './components/ui/sidebar';
import { SidebarTrigger } from './components/ui/sidebar';
import { colors } from './components/ui/Theme';
import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import { initFirebase, onAuthChanged, setDriverLocation, logout } from './utils/firebase';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [driverData, setDriverData] = useState({
    name: 'Mohammad Rahman',
    phone: '+8801712345678',
    licenseNumber: 'DL123456789',
    vehicleType: 'bus',
    registrationDate: new Date().toISOString(),
    status: 'active'
  });
  const [driverId, setDriverId] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  // Initialize Firebase and ensure an auth session
  useEffect(() => {
    try {
      initFirebase();
      const unsub = onAuthChanged((user) => {
        setDriverId(user ? user.uid : null);
        setAuthReady(true);
      });
      return () => unsub && unsub();
    } catch (e) {
      console.warn('[Startup] Firebase initialization failed:', e?.message);
      setAuthReady(true);
    }
  }, []);

  // Push driver location to RTDB every ~7 seconds
  useEffect(() => {
    let intervalId;
    (async () => {
      if (!driverId) return;
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.warn('Location permission not granted');
          return;
        }
        const pushUpdate = async () => {
          try {
            const loc = await Location.getCurrentPositionAsync({});
            await setDriverLocation(driverId, loc.coords.latitude, loc.coords.longitude);
          } catch (_) {}
        };
        await pushUpdate();
        intervalId = setInterval(pushUpdate, 7000);
      } catch (err) {
        console.warn('Location setup failed:', err?.message);
      }
    })();
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [driverId]);

  // Handle hardware back button for Android
  useEffect(() => {
    const backAction = () => {
      if (sidebarOpen) {
        setSidebarOpen(false);
        return true;
      }
      
      if (currentView !== 'dashboard' && currentView !== 'registration') {
        setCurrentView('dashboard');
        return true;
      }
      
      if (currentView === 'dashboard') {
        Alert.alert('Exit App', 'Are you sure you want to exit?', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Yes', onPress: () => BackHandler.exitApp() }
        ]);
        return true;
      }
      
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [currentView, sidebarOpen]);

  const handleViewChange = (viewId) => {
    try {
      setIsLoading(true);
      setCurrentView(viewId);
      setSidebarOpen(false);
    } catch (error) {
      console.error('Navigation error:', error);
      Alert.alert('Navigation Error', 'Failed to navigate to the requested page.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            try { await logout(); } catch {}
            setSidebarOpen(false);
          }
        }
      ]
    );
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'tracking':
        return <TripTracking driverName={driverData.name} />;
      case 'dashboard':
        return (
          <DriverDashboard
            onNavigateToRoute={() => setCurrentView('route')}
            onViewPassengers={() => setCurrentView('passengers')}
            onEmergencyAlert={() => setCurrentView('emergency')}
            driverName={driverData.name}
          />
        );
      case 'route':
        return <RouteMap driverId={driverId} onBack={() => setCurrentView('dashboard')} />;
      case 'passengers':
        return <PassengerManagement onBack={() => setCurrentView('dashboard')} />;
      case 'emergency':
        return <EmergencyAlert onBack={() => setCurrentView('dashboard')} />;
      case 'schedule':
        return <ScheduleFeed onBack={() => setCurrentView('dashboard')} driverName={driverData.name} />;
      case 'completed':
        return <CompletedTrips driverName={driverData.name} />;
      case 'registration':
        return null;
      default:
        return <DriverDashboard driverName={driverData.name} />;
    }
  };

  if (!authReady) {
    return (
      <SafeAreaProvider>
        <StatusBar style="dark" translucent />
        <SafeAreaView style={styles.container} edges={["top", "left", "right"]} />
      </SafeAreaProvider>
    );
  }

  if (!driverId) {
    return (
      <SafeAreaProvider>
        <StatusBar style="dark" translucent />
        <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
          <EmailAuth />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" translucent />
      <SidebarProvider>
        <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
          {/* Main Content */}
          <View style={styles.mainContent}>
            <View style={styles.topBar}>
              <SidebarTrigger onPress={() => setSidebarOpen(true)} />
            </View>
            
            {/* Current View */}
            <View style={styles.content}>
              {renderCurrentView()}
            </View>
          </View>

          {/* Sidebar Overlay */}
          {sidebarOpen && (
            <View style={styles.sidebarContainer}>
              {/* Backdrop */}
              <TouchableOpacity 
                style={styles.backdrop} 
                onPress={() => setSidebarOpen(false)}
                activeOpacity={1}
              />
              
              {/* Sidebar Content */}
              <View style={styles.sidebar}>
                <AppSidebar
                  navigation={{ closeDrawer: () => setSidebarOpen(false) }}
                  onViewChange={handleViewChange}
                  onLogout={handleLogout}
                  currentView={currentView}
                  driverData={driverData}
                />
              </View>
            </View>
          )}
        </SafeAreaView>
      </SidebarProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  mainContent: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  content: {
    flex: 1,
  },
  sidebarContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 280,
    backgroundColor: colors.sidebar,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});