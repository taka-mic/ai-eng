import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { TabNavigator } from './TabNavigator';
import { QuestScreen } from '../screens/QuestScreen';

import { RootStackParamList } from './types';
import { Colors } from '../constants/Colors';
import { Theme } from '../constants/Theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: Colors.background },
          headerTintColor: Colors.primary,
          headerTitleStyle: {
            fontWeight: '700',
            color: Colors.textPrimary,
            fontSize: Theme.fontSize.lg,
          },
          contentStyle: { backgroundColor: Colors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen
          name="Tabs"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Quest"
          component={QuestScreen}
          options={{ title: 'クエスト', headerBackTitle: '戻る' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
