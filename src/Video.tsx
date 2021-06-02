import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Linking,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
} from 'react-native';
import { Dimensions } from 'react-native';
import { Longlist } from 'beeshell';
import { useRequest, useUpdate } from 'ahooks';
import { getVideoNewsList, IVideoNewsRes } from '@/apis/news';
import { getAd, sendClickEvent, sendShowEvent } from '@/apis/ad';
import { getRandomAdOrderNum, getImgUrl, getImg } from '@/utils';
import Spinner from 'react-native-loading-spinner-overlay';
import Carousel from 'react-native-snap-carousel';
import useDirectionalConfig from '@/hooks/useDirectionalConfig';

const screenWidth = Math.round(Dimensions.get('window').width);

interface IVideoNews extends IVideoNewsRes {
  type?: 'ad' | 'normal';
  adConfig?: {
    ads_id: string;
  };
}

const Video = () => {
  const [newsList, setNewsList] = useState<IVideoNews[]>([]);
  const [carouselList, setCarouselList] = useState<IVideoNews[]>([]);
  const [initCount, setInitCount] = useState(0);
  const directionalConfig = useDirectionalConfig();
  const update = useUpdate();
  const handleAdShow = (ads_id: string) => {
    sendShowEvent(ads_id, '60b3444c28d2f9612c4453f4');
  };
  const handlePress = (newsInfo: IVideoNews) => {
    Linking.openURL(newsInfo.share_url);
    if (newsInfo.type === 'ad') {
      newsInfo.adConfig &&
        sendClickEvent(newsInfo.adConfig?.ads_id, '60b3444c28d2f9612c4453f4');
    }
  };
  const getCarouselListR = useRequest(getVideoNewsList, {
    manual: true,
    onSuccess: async (res) => {
      let ad: IVideoNews[] = [];
      try {
        const _ad = await getAd('banner', directionalConfig);
        ad = _ad.map((i) => ({
          big_pic: getImgUrl(i.creative_config.img),
          h_pic: getImgUrl(i.creative_config.img),
          published_at: '',
          id: i.advertiser_id,
          share_url: i.creative_config.location_url,
          title: i.creative_config.brand_title,
          type: 'ad',
          adConfig: {
            ads_id: i._id,
          },
        }));
      } catch (error) {
      } finally {
        if (ad.length) {
          ad.forEach((i) => i.adConfig && handleAdShow(i.adConfig?.ads_id));
        }
        const num = Math.round(Math.random() * 14 + 1);
        const _res = res.slice(num, num + 3);
        const newsData = [];
        const _newsData: IVideoNews[] = _res.map((i) => ({
          ...i,
          type: 'normal',
        }));
        _newsData.splice(getRandomAdOrderNum(), 0, ...ad);
        newsData.push(..._newsData);
        console.log(newsData);
        setCarouselList(newsData);
        update();
      }
    },
  });
  const getNewsListR = useRequest(getVideoNewsList, {
    manual: true,
    onSuccess: async (res) => {
      setInitCount(initCount + 1);
      const newsData = newsList;
      const _newsData: IVideoNews[] = res.map((i) => ({
        ...i,
        type: 'normal',
      }));
      newsData.push(..._newsData);
      setNewsList(newsData);
      update();
    },
  });
  useEffect(() => {
    getCarouselListR.run();
    getNewsListR.run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <ScrollView style={{ flex: 1 }}>
        <Spinner
          visible={
            (getNewsListR.loading || newsList.length === 0) && initCount === 0
          }
        />
        <View>
          <Carousel
            style={styles.wrapper}
            data={carouselList}
            sliderWidth={340}
            itemWidth={300}
            layout={'default'}
            renderItem={({ item }: any) => {
              const news: IVideoNews = item;
              return (
                <TouchableOpacity
                  key={`carousel-${news.id}`}
                  activeOpacity={0.5}
                  onPress={() => handlePress(news)}
                >
                  <View style={styles.slider}>
                    <ImageBackground
                      source={getImg(news.big_pic)}
                      style={{ width: 300, height: 168.75 }}
                    >
                      {news.type === 'ad' ? (
                        <View style={styles.sliderTextWrapper}>
                          <Text style={styles.sliderText}>广告</Text>
                        </View>
                      ) : null}
                    </ImageBackground>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
        <ScrollView style={styles.container}>
          {newsList.map((news) => (
            <TouchableOpacity
              key={`${news.id}-${news.title}`}
              activeOpacity={0.5}
              onPress={() => handlePress(news)}
            >
              <View style={styles.newsBox}>
                <View style={styles.newsInfo}>
                  <Text style={styles.newsTitle}>{news.title}</Text>
                  <Text style={styles.newsTime}>
                    {news.type === 'ad' ? '广告' : news.published_at}
                  </Text>
                </View>
                <Image
                  source={{
                    uri: news.h_pic,
                  }}
                  style={styles.img}
                />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>
    </>
  );
};

export default Video;

const styles = StyleSheet.create({
  wrapper: {
    margin: 10,
  },
  slider: {},
  sliderTextWrapper: {
    backgroundColor: 'rgba(5, 3, 3, 0.5)',
    bottom: -140,
    width: 40,
    textAlign: 'center',
    left: 10,
  },
  sliderText: {
    color: '#a19a9a',
    width: 40,
    textAlign: 'center',
  },
  container: {
    padding: 10,
  },
  loadMore: {
    textAlign: 'center',
    marginBottom: 20,
  },
  newsBox: {
    height: 100,
    flexDirection: 'row',
    margin: 10,
    marginTop: 0,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#b4b1b1',
    alignItems: 'center',
  },
  newsInfo: {
    justifyContent: 'space-between',
    height: '100%',
  },
  newsTitle: {
    width: screenWidth - 160 - 40,
    fontSize: 15,
    fontWeight: '600',
  },
  newsTime: {
    fontSize: 10,
    color: '#868383',
  },
  img: {
    width: 160,
    height: 90,
    borderRadius: 5,
  },
});
