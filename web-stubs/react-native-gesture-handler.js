// Web 用スタブ: react-native-gesture-handler は Web では不要
// React Navigation の Web ビルド時にこのファイルに差し替える
const React = require('react');
const { View } = require('react-native');

const GestureHandlerRootView = ({ children, style }) =>
  React.createElement(View, { style }, children);

module.exports = {
  GestureHandlerRootView,
  Swipeable: View,
  DrawerLayout: View,
  State: {},
  ScrollView: require('react-native').ScrollView,
  Slider: View,
  Switch: require('react-native').Switch,
  TextInput: require('react-native').TextInput,
  TouchableHighlight: require('react-native').TouchableHighlight,
  TouchableNativeFeedback: require('react-native').TouchableOpacity,
  TouchableOpacity: require('react-native').TouchableOpacity,
  TouchableWithoutFeedback: require('react-native').TouchableWithoutFeedback,
  FlatList: require('react-native').FlatList,
  gestureHandlerRootHOC: (Comp) => Comp,
  RectButton: require('react-native').TouchableOpacity,
  BorderlessButton: require('react-native').TouchableOpacity,
  BaseButton: require('react-native').TouchableOpacity,
  Directions: {},
};
