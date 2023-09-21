import * as React from 'react';
import {Text, View} from 'react-native';
import LottieView from 'lottie-react-native';

interface SplashProps {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

function SplashScreen({setIsLoading}: SplashProps): JSX.Element {
  return (
    <View style={{flex: 1, alignItems: 'center', margin: 0}}>
      <LottieView
        source={require('../../assets/splash/splash.json')}
        autoPlay
        loop={false}
        resizeMode="cover"
        onAnimationFinish={() => setIsLoading(false)}
      />
    </View>
  );
}

export default SplashScreen;
