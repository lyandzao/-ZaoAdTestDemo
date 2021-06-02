import { useRecoilState } from 'recoil';
import { userInfoState } from '@/globalState';

const useDirectionalConfig = () => {
  const [userInfo] = useRecoilState(userInfoState);
  return {
    ...userInfo,
    age: Number(userInfo.age),
  };
};

export default useDirectionalConfig;
