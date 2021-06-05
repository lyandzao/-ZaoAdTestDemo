import React from 'react';
import { View, Text } from 'react-native';
// import { Input, Radio, Form } from 'beeshell';
import { Input, CheckBox } from 'react-native-elements';
import { useRecoilState } from 'recoil';
import { userInfoState } from '@/globalState';
import { sendCustomEvent } from '@/SDK';
import { useMount } from 'ahooks';

const Center = () => {
  const [userInfo, setUserInfo] = useRecoilState(userInfoState);
  useMount(() => {
    sendCustomEvent('60bb6dd72507b156e03ed0a0', 'center', 'show');
    sendCustomEvent('60bb6dd72507b156e03ed0a0', 'center', 'click');
  });
  return (
    <View>
      {/* <Text>{JSON.stringify(userInfo)}</Text> */}
      <Input
        label="地区"
        value={userInfo.location}
        onChangeText={(location) => {
          setUserInfo({ ...userInfo, location });
        }}
      />
      <Input
        label="年龄"
        value={userInfo.age}
        onChangeText={(age) => {
          setUserInfo({ ...userInfo, age });
        }}
      />
      <View style={{ flexDirection: 'row' }}>
        <CheckBox
          title="男"
          checked={userInfo.gender === 'man'}
          onPress={() => {
            setUserInfo({ ...userInfo, gender: 'man' });
          }}
        />
        <CheckBox
          title="女"
          checked={userInfo.gender === 'woman'}
          onPress={() => {
            setUserInfo({ ...userInfo, gender: 'woman' });
          }}
        />
        <CheckBox
          title="保密"
          checked={userInfo.gender === 'all'}
          onPress={() => {
            setUserInfo({ ...userInfo, gender: 'all' });
          }}
        />
      </View>
    </View>
  );
};

export default Center;
