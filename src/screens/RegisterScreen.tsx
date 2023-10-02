import {
  Dimensions,
  Image,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Entypo';
import axios from 'axios';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {AccessToken, LoginManager, Profile} from 'react-native-fbsdk-next';

//files

import Spacing from '../components/constants/Spacing';
import FontSize from '../components/constants/FontSize';
import Colors from '../components/constants/Colors';
import Font from '../components/constants/Font';
import AppTextInput from '../components/Auth/AppTextInput';

type UserInfo = {
  email: string;
  password: string;
  username: string;
  confirmpassword: string;
};

const url = `http://localhost:3001/register`;

function RegisterScreen(): JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [apiError, setApiError] = React.useState('');
  const [userInfo, setUserInfo] = React.useState<UserInfo>({
    email: '',
    password: '',
    username: '',
    confirmpassword: '',
  });

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

  const [errors, setErrors] = React.useState({
    username: null,
    email: null,
    password: null,
    confirmpassword: null,
  });

  const validate = async () => {
    Keyboard.dismiss();

    let isValid = true;

    // Validate username
    if (!userInfo.username) {
      handleError('Please input a username', 'username');
      isValid = false;
    }

    // Validate email
    if (!userInfo.email) {
      handleError('Please input an email address', 'email');
      isValid = false;
    } else {
      // we can use a regular expression to check for a valid email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userInfo.email)) {
        handleError('Please enter a valid email address', 'email');
        isValid = false;
      }
    }

    // Validate password
    if (!userInfo.password) {
      handleError('Please input a password', 'password');
      isValid = false;
    } else if (userInfo.password.length < 6) {
      handleError('Password must be at least 6 characters long', 'password');
      isValid = false;
    }

    // Validate confirm password
    if (!userInfo.confirmpassword) {
      handleError('Please confirm your password', 'confirmpassword');
      isValid = false;
    } else if (userInfo.password !== userInfo.confirmpassword) {
      handleError('Passwords do not match', 'confirmpassword');
      isValid = false;
    }

    if (isValid) {
      registerUser();
    }
  };

  const handleError = (error: any, input: any) => {
    setApiError('');
    setErrors(prevState => ({...prevState, [input]: error}));
  };

  const registerUser = async () => {
    const {username, email, password} = userInfo;

    axios
      .post(url, {username, email, password})
      .then(response => {
        console.log(response);
        setUserInfo({
          username: '',
          email: '',
          password: '',
          confirmpassword: '',
        });
        navigation.navigate('Home');
      })
      .catch(error => {
        console.log(error);
        handleError('This email is already present', 'email');
      });
  };

  React.useEffect(() => {
    GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
      webClientId:
        '872044783302-9a5uuhc1o3r7oe04pnnfe3v8k4itgvv9.apps.googleusercontent.com',
      iosClientId:
        '872044783302-4ac4tsoq3rk70ek9t5vn8k1bqt3q1p1t.apps.googleusercontent.com',
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    });
  }, []);

  const signUpWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userData = await GoogleSignin.signIn();

      const {name, email, id, photo} = userData.user;

      axios
        .post(url, {username: name, email, password: id, image: photo})
        .then(response => {
          console.log(response);
          setApiError('');
          navigation.navigate('Home');
        })
        .catch(error => {
          console.log(error);
          setApiError('This email is already present');
        });
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
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
            Create an account so you can explore all the world
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
            error={errors.username}
            onFocus={() => handleError(null, 'username')}
            onChangeText={(e): void => setUserInfo({...userInfo, username: e})}
          />
          <AppTextInput
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={userInfo.email}
            error={errors.email}
            onFocus={() => handleError(null, 'email')}
            onChangeText={(e): void => setUserInfo({...userInfo, email: e})}
          />
          <View>
            <AppTextInput
              placeholder="Password"
              secureTextEntry={!showPassword}
              value={userInfo.password}
              error={errors.password}
              onFocus={() => handleError(null, 'password')}
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
              value={userInfo.confirmpassword}
              error={errors.confirmpassword}
              onFocus={() => handleError(null, 'confirmpassword')}
              onChangeText={(e): void =>
                setUserInfo({...userInfo, confirmpassword: e})
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

        {apiError && (
          <Text
            style={{
              marginTop: -18,
              marginBottom: 10,
              color: Colors.red,
              fontSize: 12,
            }}>
            {apiError}
          </Text>
        )}

        <TouchableOpacity
          onPress={validate}
          style={{
            padding: Spacing * 2,
            backgroundColor: Colors.primary,
            marginBottom: Spacing * 2,
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
              color: Colors.primary,
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
              color: Colors.text,
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
              onPress={() => signUpWithGoogle()}
              style={{
                padding: Spacing,
                borderRadius: Spacing / 2,
                marginHorizontal: Spacing,
              }}>
              <Image
                source={require('../../assets/Auth/google.png')}
                width={24}
                height={24}
                style={{width: 24, height: 24}}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                LoginManager.logInWithPermissions([
                  'public_profile',
                  'email',
                ]).then(
                  function (result) {
                    if (result.isCancelled) {
                      console.log('Login Cancelled ' + JSON.stringify(result));
                    } else {
                      console.log(
                        'Login success with  permisssions: ' +
                          JSON.stringify(result),
                      );
                      console.log('Login Success ' + JSON.stringify(result));
                      Profile.getCurrentProfile().then(function (
                        currentProfile,
                      ) {
                        if (currentProfile) {
                          console.log(currentProfile);
                          console.log(
                            'The current logged user is: ' +
                              currentProfile.name +
                              '. His profile id is: ' +
                              currentProfile.userID,
                          );

                          axios
                            .post(url, {
                              username: currentProfile.name,
                              email: currentProfile.email,
                              password: currentProfile.userID,
                              image: currentProfile.imageURL,
                            })
                            .then(response => {
                              console.log(response);
                              setApiError('');
                              navigation.navigate('Home');
                            })
                            .catch(error => {
                              console.log(error);
                              setApiError('This email is already present');
                            });
                        }
                      });

                      AccessToken.getCurrentAccessToken().then(data => {
                        console.log(data);
                      });
                    }
                  },
                  function (error) {
                    console.log('Login failed with error: ' + error);
                  },
                );
              }}
              style={{
                padding: Spacing,
                borderRadius: Spacing / 2,
                marginHorizontal: Spacing,
              }}>
              <Image
                source={require('../../assets/Auth/facebook.png')}
                width={24}
                height={24}
                style={{width: 24, height: 24}}
              />
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
