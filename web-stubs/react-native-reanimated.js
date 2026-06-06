// Web 用スタブ: react-native-reanimated の Web 互換レイヤー
const React = require('react');
const RN = require('react-native');

// Animated values
function useSharedValue(init) { return { value: init }; }
function useAnimatedStyle(fn) { return fn(); }
function withTiming(val) { return val; }
function withSpring(val) { return val; }
function runOnJS(fn) { return fn; }
function runOnUI(fn) { return fn; }
function interpolate(val, input, output) { return output[0]; }

const Animated = {
  View: RN.View,
  Text: RN.Text,
  Image: RN.Image,
  ScrollView: RN.ScrollView,
  FlatList: RN.FlatList,
};

module.exports = {
  default: { ...RN.Animated },
  Animated,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
  runOnUI,
  interpolate,
  Easing: RN.Easing,
  cancelAnimation: () => {},
  useDerivedValue: (fn) => ({ value: fn() }),
  useAnimatedRef: () => React.createRef(),
  useAnimatedScrollHandler: () => ({}),
};
