import AsyncStorage from '@react-native-async-storage/async-storage';
import * as React from 'react';
import {Text, View} from 'react-native';

function HomeScreen(): JSX.Element {
  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('User');
      console.log('Asysc Storage', value);
      if (value !== null) {
        // value previously stored
      }
    } catch (e) {
      // error reading value
    }
  };
  getData();

  return (
    <View>
      <Text>Home</Text>
    </View>
  );
}

export default HomeScreen;
