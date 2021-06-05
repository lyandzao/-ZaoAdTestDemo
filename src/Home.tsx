import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Linking,
  TouchableOpacity,
} from 'react-native';
import { Dimensions } from 'react-native';
import { Longlist } from 'beeshell';
import { useRequest, useUpdate } from 'ahooks';
import { getNewsList } from '@/apis/news';
import { getAd, sendClickEvent, sendShowEvent, sendCustomEvent } from '@/SDK';
import { getImgUrl } from '@/SDK/utils';
import { getRandomAdOrderNum, getImg } from '@/utils';
import Spinner from 'react-native-loading-spinner-overlay';
import useDirectionalConfig from '@/hooks/useDirectionalConfig';
import { HOME_STREAM_CODE_ID } from '@/constants/ad';

const screenWidth = Math.round(Dimensions.get('window').width);

interface INews {
  url: string;
  thumbnail_pic_s: string;
  title: string;
  date: string;
  type?: 'ad' | 'normal';
  adConfig?: {
    ads_id: string;
  };
}

const Home = () => {
  const [newsList, setNewsList] = useState<INews[]>([]);
  const [initCount, setInitCount] = useState(0);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const directionalConfig = useDirectionalConfig();
  const update = useUpdate();
  const handleAdShow = (ads_id: string) => {
    sendShowEvent(ads_id, HOME_STREAM_CODE_ID);
  };
  const handlePress = (newsInfo: INews) => {
    Linking.openURL(newsInfo.url);
    if (newsInfo.type === 'ad') {
      newsInfo.adConfig &&
        sendClickEvent(newsInfo.adConfig?.ads_id, HOME_STREAM_CODE_ID);
    }
  };
  const handleLoadMore = () => {
    setLoadingStatus(true);
    getNewsListR.refresh();
  };
  const getNewsListR = useRequest(getNewsList, {
    manual: true,
    onSuccess: async (res) => {
      setInitCount(initCount + 1);
      let ad: INews[] = [];
      try {
        const _ad = await getAd(
          'stream',
          HOME_STREAM_CODE_ID,
          directionalConfig,
        );
        ad = _ad.map((i) => ({
          url: i.creative_config.location_url,
          thumbnail_pic_s: getImgUrl(i.creative_config.img),
          title: i.creative_config.desc,
          date: '',
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
        const newsData = newsList;
        const _newsData: INews[] = res.map((i) => ({ ...i, type: 'normal' }));
        _newsData.splice(getRandomAdOrderNum(), 0, ...ad);
        newsData.push(..._newsData);
        setNewsList(newsData);
        console.log(newsData);
        setLoadingStatus(false);
        update();
      }
    },
  });
  const getNewsListRefreshR = useRequest(getNewsList, {
    manual: true,
    onSuccess: async (res) => {
      let ad: INews[] = [];
      try {
        const _ad = await getAd(
          'stream',
          HOME_STREAM_CODE_ID,
          directionalConfig,
        );
        ad = _ad.map((i) => ({
          url: i.creative_config.location_url,
          thumbnail_pic_s: getImgUrl(i.creative_config.img),
          title: i.creative_config.desc,
          date: '',
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
        const newsData = [];
        const _newsData: INews[] = res.map((i) => ({ ...i, type: 'normal' }));
        _newsData.splice(getRandomAdOrderNum(), 0, ...ad);
        newsData.push(..._newsData);
        setNewsList(newsData);
        console.log(newsData);
        update();
      }
    },
  });
  useEffect(() => {
    getNewsListR.run();
    sendCustomEvent('60bb6dd72507b156e03ed0a0', 'home', 'show');
    sendCustomEvent('60bb6dd72507b156e03ed0a0', 'home', 'click');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Spinner
        visible={
          (getNewsListR.loading || newsList.length === 0) && initCount === 0
        }
      />
      <Longlist
        total={newsList.length}
        style={styles.container}
        data={newsList}
        onRefresh={getNewsListRefreshR.run}
        renderFooter={() => {
          return (
            <TouchableOpacity activeOpacity={0.5} onPress={handleLoadMore}>
              <Text style={styles.loadMore}>
                {!newsList.length
                  ? ''
                  : loadingStatus
                  ? '正在加载...'
                  : '加载更多'}
              </Text>
            </TouchableOpacity>
          );
        }}
        renderItem={({ item }) => {
          const news: INews = item;
          return (
            <TouchableOpacity
              key={news.url}
              activeOpacity={0.5}
              onPress={() => handlePress(news)}
            >
              <View style={styles.newsBox}>
                <View style={styles.newsInfo}>
                  <Text style={styles.newsTitle}>{news.title}</Text>
                  <Text style={styles.newsTime}>
                    {news.type === 'ad' ? '广告' : news.date}
                  </Text>
                </View>
                <Image
                  source={getImg(news.thumbnail_pic_s)}
                  style={styles.img}
                />
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </>
  );
};

export default Home;

const styles = StyleSheet.create({
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
