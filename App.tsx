import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  StatusBar,
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '@/Home';
import Center from '@/Center';
import Video from '@/Video';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SplashScreen from 'react-native-splash-screen';
import { useCountDown, useRequest } from 'ahooks';
import { getAd, IAd, sendClickEvent, sendShowEvent } from '@/apis/ad';
import { getImgUrl, getImg } from '@/utils';
import { RecoilRoot } from 'recoil';
import { SPLASH_CODE_ID } from '@/constants/ad';

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

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
});

const App = () => {
  const [showSplashAd, setShowSplashAd] = useState(true);
  const [adInfo, setAdInfo] = useState<IAd>();
  const [adImgUrl, setAdImgUrl] = useState('');
  const [countdown, setTargetDate] = useCountDown({
    onEnd: () => setShowSplashAd(false),
  });
  const getAdR = useRequest(getAd, {
    manual: true,
    onSuccess: (res) => {
      SplashScreen.hide();
      if (res.length) {
        sendShowEvent(res[0]._id, SPLASH_CODE_ID);
        setShowSplashAd(true);
        setTargetDate(Date.now() + 3000);
        setAdInfo(res[0]);
        setAdImgUrl(getImgUrl(res[0].creative_config.img));
      }
    },
  });
  useEffect(() => {
    getAdR.run('splash');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleJump = () => {
    setShowSplashAd(false);
  };
  const handlePressAd = () => {
    if (adInfo?.creative_config.location_url) {
      Linking.openURL(adInfo?.creative_config.location_url);
    }
    if (adInfo?._id) {
      sendClickEvent(adInfo._id, SPLASH_CODE_ID);
    }
  };
  return (
    <>
      {showSplashAd ? (
        <StatusBar hidden />
      ) : (
        <View
          style={{
            height: 23,
            backgroundColor: 'rgb(242, 242, 242)',
          }}
        >
          <StatusBar
            backgroundColor="rgba(0,0,0,0)"
            translucent={true}
            barStyle="dark-content"
          />
        </View>
      )}

      {showSplashAd && adImgUrl !== '' ? (
        <>
          <TouchableOpacity onPress={handlePressAd} activeOpacity={1}>
            <ImageBackground
              style={{ width: screenWidth, height: screenHeight }}
              source={getImg(adImgUrl)}
            >
              <TouchableOpacity
                style={styles.adWrapper}
                onPress={handleJump}
                activeOpacity={0.6}
              >
                <Text style={styles.adButton}>{`跳过广告 ${Math.round(
                  countdown / 1000,
                )} s`}</Text>
              </TouchableOpacity>
            </ImageBackground>
          </TouchableOpacity>
        </>
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
