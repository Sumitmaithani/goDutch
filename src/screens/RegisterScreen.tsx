import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {useMutation} from '@apollo/client';
import Icon from 'react-native-vector-icons/Entypo';

//files

import Spacing from '../components/constants/Spacing';
import FontSize from '../components/constants/FontSize';
import Colors from '../components/constants/Colors';
import Font from '../components/constants/Font';
import AppTextInput from '../components/Auth/AppTextInput';
import {REGISTER_USER} from '../../GraphQL/Mutations/mutations';

function RegisterScreen(): JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [userInfo, setUserInfo] = React.useState({
    email: '',
    password: '',
    username: '',
    conformpassword: '',
  });

  const [register] = useMutation(REGISTER_USER);

  // State variable to track password visibility
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  // Function to toggle the password visibility state
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmShowPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const registerUser = async (e: any) => {
    e.preventDefault();
    const {username, email, password} = userInfo;

    try {
      const registerUserData = await register({
        variables: {
          registerInput: {
            username: username,
            email: email,
            password: password,
          },
        },
      });

      if (registerUserData.data && registerUserData.data.registerUser) {
        console.log(
          'Successfully Registered. Please wait until you will be approved.',
        );

        setUserInfo({
          username: '',
          email: '',
          password: '',
          conformpassword: '',
        });
      } else {
        console.log('Registration failed or user already exists.');
      }
    } catch (error: any) {
      console.log('Error while registering:', error);
    }
  };

  return (
    <SafeAreaView>
      <View
        style={{
          padding: Spacing * 2,
        }}>
        <View
          style={{
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: FontSize.xLarge,
              color: Colors.primary,
              fontFamily: Font['poppins-bold'],
              marginVertical: Spacing * 3,
            }}>
            Create account
          </Text>
          <Text
            style={{
              fontFamily: Font['poppins-regular'],
              fontSize: FontSize.small,
              maxWidth: '80%',
              textAlign: 'center',
            }}>
            Create an account so you can explore all the existing jobs
          </Text>
        </View>
        <View
          style={{
            marginVertical: Spacing * 3,
          }}>
          <AppTextInput
            placeholder="Username"
            autoCapitalize="none"
            autoCorrect={false}
            value={userInfo.username}
            onChangeText={(e): void => setUserInfo({...userInfo, username: e})}
          />
          <AppTextInput
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={userInfo.email}
            onChangeText={(e): void => setUserInfo({...userInfo, email: e})}
          />
          <View>
            <AppTextInput
              placeholder="Password"
              secureTextEntry={!showPassword}
              value={userInfo.password}
              onChangeText={(e): void =>
                setUserInfo({...userInfo, password: e})
              }
            />
            <Icon
              name={showPassword ? 'eye-with-line' : 'eye'}
              size={24}
              color="#aaa"
              style={styles.icon}
              onPress={toggleShowPassword}
            />
          </View>
          <View>
            <AppTextInput
              placeholder="Confirm Password"
              secureTextEntry={!showConfirmPassword}
              value={userInfo.conformpassword}
              onChangeText={(e): void =>
                setUserInfo({...userInfo, conformpassword: e})
              }
            />
            <Icon
              name={showConfirmPassword ? 'eye-with-line' : 'eye'}
              size={24}
              color="#aaa"
              style={styles.icon}
              onPress={toggleConfirmShowPassword}
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={registerUser}
          style={{
            padding: Spacing * 2,
            backgroundColor: Colors.primary,
            marginVertical: Spacing * 3,
            borderRadius: Spacing,
            shadowColor: Colors.primary,
            shadowOffset: {
              width: 0,
              height: Spacing,
            },
            shadowOpacity: 0.3,
            shadowRadius: Spacing,
          }}>
          <Text
            style={{
              fontFamily: Font['poppins-bold'],
              color: Colors.onPrimary,
              textAlign: 'center',
              fontSize: FontSize.large,
            }}>
            Sign up
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          style={{
            padding: Spacing,
          }}>
          <Text
            style={{
              fontFamily: Font['poppins-semiBold'],
              color: Colors.text,
              textAlign: 'center',
              fontSize: FontSize.small,
            }}>
            Already have an account
          </Text>
        </TouchableOpacity>

        <View
          style={{
            marginVertical: Spacing * 3,
          }}>
          <Text
            style={{
              fontFamily: Font['poppins-semiBold'],
              color: Colors.primary,
              textAlign: 'center',
              fontSize: FontSize.small,
            }}>
            Or continue with
          </Text>

          <View
            style={{
              marginTop: Spacing,
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              style={{
                padding: Spacing,
                backgroundColor: Colors.gray,
                borderRadius: Spacing / 2,
                marginHorizontal: Spacing,
              }}>
              {/* <Ionicons
                name="logo-google"
                color={Colors.text}
                size={Spacing * 2}
              /> */}
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                padding: Spacing,
                backgroundColor: Colors.gray,
                borderRadius: Spacing / 2,
                marginHorizontal: Spacing,
              }}>
              {/* <Ionicons
                name="logo-apple"
                color={Colors.text}
                size={Spacing * 2}
              /> */}
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                padding: Spacing,
                backgroundColor: Colors.gray,
                borderRadius: Spacing / 2,
                marginHorizontal: Spacing,
              }}>
              {/* <Ionicons
                name="logo-facebook"
                color={Colors.text}
                size={Spacing * 2}
              /> */}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default RegisterScreen;

const styles = StyleSheet.create({
  icon: {
    position: 'absolute',
    right: 0,
    top: 30,
    left: Dimensions.get('window').width - 80,
  },
});
