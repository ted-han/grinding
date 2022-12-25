import React, {useRef} from 'react';
import {Animated, StyleSheet, Image, View, Pressable} from 'react-native';

interface Header {
  onRefresh: (time: number) => void;
}

const Header = ({onRefresh}: Header) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const onPressInfo = () => {
    console.log('info');
  };
  const onPressRefresh = () => {
    onRefresh((prev: number) => prev + 1);

    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => rotateAnim.setValue(0));
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.header}>
      <Pressable onPress={onPressInfo}>
        <Image
          style={styles.icon}
          source={require('../assets/icon_info.png')}
        />
      </Pressable>
      <Pressable onPress={onPressRefresh}>
        <Animated.Image
          style={[
            styles.icon,
            styles.refresh,
            {
              transform: [{rotate: spin}],
            },
          ]}
          source={require('../assets/icon_refresh.png')}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    borderBottomColor: 'gray',
    borderStyle: 'solid',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 24,
    paddingRight: 24,
  },
  icon: {
    width: 18,
    height: 18,
  },
  refresh: {
    marginLeft: 8,
  },
});

export default Header;
