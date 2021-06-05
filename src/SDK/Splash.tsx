import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import { useRequest } from 'ahooks';
import { getSplashAd, IAd, sendClickEvent, sendShowEvent } from './apis';
import { getImg, getImgUrl } from './utils';
import { useCountdown } from './useCountdown';

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

interface Props {
  splashCodeId: string;
  // run: boolean;
  onGetAdSuccess?: () => void;
  onCountdown?: () => void;
  onPressBtn?: () => void;
}

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

const Splash = (props: Props) => {
  const {
    splashCodeId,
    // run,
    onGetAdSuccess = () => {},
    onCountdown = () => {},
    onPressBtn = () => {},
  } = props;
  const [adImgUrl, setAdImgUrl] = useState('');
  const [adInfo, setAdInfo] = useState<IAd>();
  const { start, countdown } = useCountdown({
    timer: 3000,
    onExpire: () => {
      onCountdown();
    },
  });
  useEffect(() => {
    getSplashAdR.run(splashCodeId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handlePressAd = () => {
    if (adInfo?.creative_config.location_url) {
      Linking.openURL(adInfo?.creative_config.location_url);
    }
    if (adInfo?._id) {
      sendClickEvent(adInfo._id, splashCodeId);
    }
  };
  const handleJump = () => {
    onPressBtn();
  };
  const getSplashAdR = useRequest(getSplashAd, {
    manual: true,
    onSuccess: (res) => {
      if (res.length) {
        onGetAdSuccess();
        sendShowEvent(res[0]._id, splashCodeId);
        start();
        setAdInfo(res[0]);
        setAdImgUrl(getImgUrl(res[0].creative_config.img));
      } else {
        onCountdown();
      }
    },
    onError: (res) => {
      console.log(res);
    },
  });
  return (
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
          <Text style={styles.adButton}>{`跳过广告 ${
            countdown / 1000
          } s`}</Text>
        </TouchableOpacity>
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default Splash;
