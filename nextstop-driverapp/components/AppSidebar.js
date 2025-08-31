import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "./ui/sidebar";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import { SidebarMap } from "./SidebarMap";
import { colors, fontWeights, radius } from './ui/Theme';
import { 
  Home, 
  Map, 
  CheckCircle, 
  Calendar, 
  Users, 
  AlertTriangle, 
  User, 
  Settings, 
  LogOut, 
  Navigation, 
  Star, 
  DollarSign,
  Leaf
} from "lucide-react-native";

// This component is designed to be passed to the `drawerContent` prop of a Drawer Navigator
export function AppSidebar({ navigation, onViewChange, onLogout, currentView, driverData }) {
  const mainNavItems = [
    {
      title: "Live Tracking",
      icon: Home,
      id: "tracking",
      badge: null,
    },
    {
      title: "Completed Trips",
      icon: CheckCircle,
      id: "completed",
      badge: "12",
    },
    {
      title: "Dashboard",
      icon: Navigation,
      id: "dashboard",
      badge: null,
    },
  ];

  const managementItems = [
    {
      title: "Route Map",
      icon: Map,
      id: "route",
      badge: null,
    },
    {
      title: "Passengers",
      icon: Users,
      id: "passengers",
      badge: "28",
    },
    {
      title: "Schedule",
      icon: Calendar,
      id: "schedule",
      badge: "2",
    },
  ];

  const accountItems = [
    {
      title: "Profile",
      icon: User,
      id: "profile",
      badge: null,
    },
    {
      title: "Emergency",
      icon: AlertTriangle,
      id: "emergency",
      badge: null,
    },
  ];

  const driverStats = {
    rating: 4.8,
    totalTrips: 1247,
    todayEarnings: 156.75
  };

  const handleNavigation = (viewId) => {
    onViewChange(viewId);
    if (navigation?.closeDrawer) {
      navigation.closeDrawer(); // Close the drawer after an item is selected
    }
  };

  return (
    <Sidebar>
      <SidebarHeader style={styles.headerBorder}>
        <View style={styles.headerTop}>
          <View style={styles.logoContainer}>
            <Leaf size={20} color={colors.primaryForeground} />
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>NextStop</Text>
            <Text style={styles.headerSubtitle}>Driver Dashboard</Text>
          </View>
        </View>
        
        {/* Quick Stats */}
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Rating</Text>
            <View style={styles.statValueRow}>
              <Text style={styles.statValue}>{driverStats.rating}</Text>
              <Star size={12} color={colors.yellow500} style={styles.starFilled} />
            </View>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Trips</Text>
            <Text style={styles.statValue}>{driverStats.totalTrips}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Today</Text>
            <View style={styles.statValueRow}>
              <DollarSign size={12} color={colors.foreground} />
              <Text style={styles.statValue}>{driverStats.todayEarnings}</Text>
            </View>
          </View>
        </View>
      </SidebarHeader>

      <SidebarContent>
        {/* Live Map View */}
        <SidebarGroup>
          <SidebarGroupLabel>Live Route</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMap onStartTrip={() => handleNavigation('tracking')} isCompact={true} />
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton 
                      onPress={() => handleNavigation(item.id)}
                      isActive={isActive}
                    >
                      <Icon size={16} color={isActive ? colors.primary : colors.mutedForeground} />
                      <Text style={[styles.menuItemText, isActive && styles.menuItemTextActive]}>
                        {item.title}
                      </Text>
                      {item.badge && (
                        <Badge variant="secondary" style={styles.menuBadge}>
                          <Text style={styles.badgeText}>{item.badge}</Text>
                        </Badge>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Trip Management */}
        <SidebarGroup>
          <SidebarGroupLabel>Trip Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {managementItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton 
                      onPress={() => handleNavigation(item.id)}
                      isActive={isActive}
                    >
                      <Icon size={16} color={isActive ? colors.primary : colors.mutedForeground} />
                      <Text style={[styles.menuItemText, isActive && styles.menuItemTextActive]}>
                        {item.title}
                      </Text>
                      {item.badge && (
                        <Badge variant="secondary" style={styles.menuBadge}>
                          <Text style={styles.badgeText}>{item.badge}</Text>
                        </Badge>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Account */}
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton 
                      onPress={() => handleNavigation(item.id)}
                      isActive={isActive}
                    >
                      <Icon size={16} color={isActive ? colors.primary : colors.mutedForeground} />
                      <Text style={[styles.menuItemText, isActive && styles.menuItemTextActive]}>
                        {item.title}
                      </Text>
                      {item.badge && (
                        <Badge variant="secondary" style={styles.menuBadge}>
                          <Text style={styles.badgeText}>{item.badge}</Text>
                        </Badge>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter style={styles.footerBorder}>
        <Button 
          variant="ghost" 
          onPress={onLogout}
          style={styles.logoutButton}
        >
          <LogOut size={16} color={colors.destructive} style={styles.logoutIcon} />
          <Text style={styles.logoutText}>Logout</Text>
        </Button>
        <Text style={styles.versionText}>NextStop v2.1.0</Text>
      </SidebarFooter>
    </Sidebar>
  );
}

const styles = StyleSheet.create({
  headerBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.sidebarBorder,
    padding: 16,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoContainer: {
    width: 40,
    height: 40,
    backgroundColor: colors.primary,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: fontWeights.semibold,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.muted,
    padding: 8,
    borderRadius: 8,
  },
  statLabel: {
    fontSize: 10,
    color: colors.mutedForeground,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 14,
    fontWeight: fontWeights.semibold,
    color: colors.foreground,
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  starFilled: {
    // Add fill color if supported by your icon library
  },
  menuItemText: {
    fontSize: 14,
    color: colors.foreground,
    flex: 1,
    marginLeft: 12,
    fontWeight: fontWeights.normal,
  },
  menuItemTextActive: {
    color: colors.primary,
    fontWeight: fontWeights.semibold,
  },
  menuBadge: {
    marginLeft: 'auto',
  },
  badgeText: {
    fontSize: 12,
    color: colors.secondaryForeground,
  },
  footerBorder: {
    borderTopWidth: 1,
    borderTopColor: colors.sidebarBorder,
    padding: 16,
  },
  logoutButton: {
    width: '100%',
    justifyContent: 'flex-start',
    backgroundColor: 'transparent',
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    color: colors.destructive,
    fontSize: 14,
    fontWeight: fontWeights.medium,
  },
  versionText: {
    fontSize: 10,
    textAlign: 'center',
    color: colors.mutedForeground,
    marginTop: 8,
  },
});