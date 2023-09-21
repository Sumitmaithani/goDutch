import * as React from 'react';
import {Platform} from 'react-native';
import SplashScreen from './src/screens/SplashScreen';
import HomeScreen from './src/screens/HomeScreen';

import SplashScreens from 'react-native-splash-screen';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import OnboardingScreen from './src/screens/OnboardingScreen';

const Stack = createNativeStackNavigator();

function App(): JSX.Element {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    if (Platform.OS === 'android') SplashScreens.hide();
  }, []);

  return isLoading ? (
    <SplashScreen setIsLoading={setIsLoading} />
  ) : (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="onboarding">
        <Stack.Screen
          name="onboarding"
          component={OnboardingScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
