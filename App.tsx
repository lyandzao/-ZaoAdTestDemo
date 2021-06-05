import React, { useState } from 'react';
import { StatusBar, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '@/Home';
import Center from '@/Center';
import Video from '@/Video';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SplashScreen from 'react-native-splash-screen';
import { RecoilRoot } from 'recoil';
import { SPLASH_CODE_ID } from '@/constants/ad';
import { Splash } from '@/SDK';
import { useMount } from 'ahooks';

const Tab = createBottomTabNavigator();

const styles = StyleSheet.create({
  adWrapper: {
    position: 'absolute',
    top: 20,
    right: 20,
    marginLeft: 'auto',
  },
  adButton: {
    backgroundColor: 'rgba(39, 34, 34, 0.3)',
    width: 110,
    height: 30,
    color: '#f5f4f4',
    borderRadius: 4,
    fontSize: 16,
    lineHeight: 30,
    textAlign: 'center',
  },
  statusBar: {
    height: 23,
    backgroundColor: 'rgb(242, 242, 242)',
  },
});

const App = () => {
  const [showSplashAd, setShowSplashAd] = useState(true);
  // const [runAd, setRunAd] = useState(false);

  const handleSplashGetAdSuccess = () => {
    setShowSplashAd(true);
    // SplashScreen.hide();
  };
  const handleCountdown = () => {
    setShowSplashAd(false);
  };
  useMount(() => {
    // setRunAd(true);
    SplashScreen.hide();
  });
  return (
    <>
      {showSplashAd ? (
        <StatusBar hidden />
      ) : (
        <View style={styles.statusBar}>
          <StatusBar
            backgroundColor="rgba(0,0,0,0)"
            translucent={true}
            barStyle="dark-content"
          />
        </View>
      )}

      {showSplashAd ? (
        <Splash
          // run={runAd}
          splashCodeId={SPLASH_CODE_ID}
          onGetAdSuccess={handleSplashGetAdSuccess}
          onCountdown={handleCountdown}
          onPressBtn={handleCountdown}
        />
      ) : (
        <RecoilRoot>
          <NavigationContainer>
            <Tab.Navigator
              initialRouteName="Home"
              tabBarOptions={{
                activeTintColor: '#2187DB',
                inactiveTintColor: '#93919A',
                tabStyle: {
                  marginBottom: 5,
                },
              }}
            >
              <Tab.Screen
                name="Home"
                component={Home}
                options={{
                  tabBarLabel: '主页',
                  tabBarIcon: ({ size, color }) => {
                    return <Icon name="home" size={size} color={color} />;
                  },
                }}
              />
              <Tab.Screen
                name="Video"
                component={Video}
                options={{
                  tabBarLabel: '视频',
                  tabBarIcon: ({ size, color }) => {
                    return <Icon name="videocam" size={size} color={color} />;
                  },
                }}
              />
              <Tab.Screen
                name="Center"
                component={Center}
                options={{
                  tabBarLabel: '我的',
                  tabBarIcon: ({ size, color }) => {
                    return (
                      <Icon name="perm-identity" size={size} color={color} />
                    );
                  },
                }}
              />
            </Tab.Navigator>
          </NavigationContainer>
        </RecoilRoot>
      )}
    </>
  );
};

export default App;
