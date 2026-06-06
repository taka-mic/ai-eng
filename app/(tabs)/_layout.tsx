import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Theme } from '../../constants/Theme';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface TabIconProps {
  name: IoniconsName;
  color: string | import('react-native').ColorValue;
  size: number;
}

function TabIcon({ name, color, size }: TabIconProps) {
  return <Ionicons name={name} color={color as string} size={size} />;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
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
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'ホーム',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="home" color={color} size={size} />
          ),
          headerTitle: '受験クエスト',
        }}
      />
      <Tabs.Screen
        name="vocabulary"
        options={{
          title: '単語',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="book" color={color} size={size} />
          ),
          headerTitle: '単語クエスト',
        }}
      />
      <Tabs.Screen
        name="grammar"
        options={{
          title: '文法',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="pencil" color={color} size={size} />
          ),
          headerTitle: '文法クエスト',
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: '進捗',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="bar-chart" color={color} size={size} />
          ),
          headerTitle: '進捗確認',
        }}
      />
    </Tabs>
  );
}
