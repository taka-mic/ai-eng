import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { HomeScreen } from '../screens/HomeScreen';
import { VocabularyScreen } from '../screens/VocabularyScreen';
import { GrammarScreen } from '../screens/GrammarScreen';
import { ProgressScreen } from '../screens/ProgressScreen';

import { TabParamList } from './types';
import { Colors } from '../constants/Colors';
import { Theme } from '../constants/Theme';

const Tab = createBottomTabNavigator<TabParamList>();

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

const TAB_CONFIG: Record<
  keyof TabParamList,
  { label: string; icon: IoniconsName; iconFocused: IoniconsName; title: string }
> = {
  Home:       { label: 'ホーム',  icon: 'home-outline',      iconFocused: 'home',       title: '受験クエスト' },
  Vocabulary: { label: '単語',    icon: 'book-outline',      iconFocused: 'book',       title: '単語クエスト' },
  Grammar:    { label: '文法',    icon: 'pencil-outline',    iconFocused: 'pencil',     title: '文法クエスト' },
  Progress:   { label: '進捗',    icon: 'bar-chart-outline', iconFocused: 'bar-chart',  title: '進捗確認' },
};

export function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const config = TAB_CONFIG[route.name as keyof TabParamList];
        return {
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? config.iconFocused : config.icon}
              size={size}
              color={color}
            />
          ),
          tabBarLabel: config.label,
          headerTitle: config.title,

          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.tabIconDefault,
          tabBarStyle: {
            backgroundColor: Colors.surface,
            borderTopColor: Colors.border,
            borderTopWidth: 1,
            height: 60,
            paddingBottom: 8,
            paddingTop: 6,
          },
          tabBarLabelStyle: {
            fontSize: Theme.fontSize.xs,
            fontWeight: Theme.fontWeight.medium,
          },
          headerStyle: { backgroundColor: Colors.background },
          headerTitleStyle: {
            fontWeight: '700',
            color: Colors.textPrimary,
            fontSize: Theme.fontSize.lg,
          },
        };
      }}
    >
      <Tab.Screen name="Home"       component={HomeScreen} />
      <Tab.Screen name="Vocabulary" component={VocabularyScreen} />
      <Tab.Screen name="Grammar"    component={GrammarScreen} />
      <Tab.Screen name="Progress"   component={ProgressScreen} />
    </Tab.Navigator>
  );
}
