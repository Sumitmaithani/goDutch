import * as React from 'react';
import {Platform, Text, View} from 'react-native';
import SplashScreen from './src/screens/SplashScreen';
import HomeScreen from './src/screens/HomeScreen';

import SplashScreens from 'react-native-splash-screen';

function App(): JSX.Element {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    if (Platform.OS === 'android') SplashScreens.hide();
  }, []);

  return isLoading ? (
    <SplashScreen setIsLoading={setIsLoading} />
  ) : (
    <HomeScreen />
  );
}

export default App;
