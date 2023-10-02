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

// files
import Spacing from '../components/constants/Spacing';
import FontSize from '../components/constants/FontSize';
import Colors from '../components/constants/Colors';
import Font from '../components/constants/Font';
import AppTextInput from '../components/Auth/AppTextInput';

const url = `http://localhost:3001/login`;

function LoginScreen(): JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [apiError, setApiError] = React.useState('');
  const [userInfo, setUserInfo] = React.useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = React.useState({
    email: null,
    password: null,
  });

  const validate = async () => {
    Keyboard.dismiss();
    let isValid = true;
    if (!userInfo.email) {
      handleError('Please input email', 'email');
      isValid = false;
    }
    if (!userInfo.password) {
      handleError('Please input password', 'password');
      isValid = false;
    }
    if (isValid) {
      loginUser();
    }
  };

  const handleError = (error: any, input: any) => {
    setApiError('');
    setErrors(prevState => ({...prevState, [input]: error}));
  };

  // State variable to track password visibility
  const [showPassword, setShowPassword] = React.useState(false);

  // Function to toggle the password visibility state
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const loginUser = async () => {
    const {email, password} = userInfo;

    axios
      .post(url, {email, password})
      .then(response => {
        console.log(response);
        setUserInfo({
          email: '',
          password: '',
        });
        handleError(null, 'email');
        handleError(null, 'password');
        navigation.navigate('Home');
      })
      .catch(error => {
        console.log(error);
        handleError(' ', 'email');
        handleError('Incorrect email or password', 'password');
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

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userData = await GoogleSignin.signIn();

      const {email, id} = userData.user;

      axios
        .post(url, {email, password: id})
        .then(response => {
          console.log(response);
          setApiError('');
          navigation.navigate('Home');
        })
        .catch(error => {
          console.log(error);
          setApiError(
            'This account does not exist. Please create an account to sign in.',
          );
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
            Login here
          </Text>
          <Text
            style={{
              fontFamily: Font['poppins-regular'],
              fontSize: FontSize.small,
              maxWidth: '60%',
              textAlign: 'center',
            }}>
            Welcome back you've been missed!
          </Text>
        </View>
        <View
          style={{
            marginVertical: Spacing * 3,
          }}>
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
        </View>

        <View>
          <Text
            style={{
              fontFamily: Font['poppins-semiBold'],
              fontSize: FontSize.small,
              color: Colors.primary,
              alignSelf: 'flex-end',
            }}>
            Forgot your password ?
          </Text>
        </View>

        {apiError && (
          <Text
            style={{
              marginTop: 12,
              marginBottom: -18,
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
            Sign in
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Register')}
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
            Create new account
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
              onPress={() => signInWithGoogle()}
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
                              email: currentProfile.email,
                              password: currentProfile.userID,
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

export default LoginScreen;

const styles = StyleSheet.create({
  icon: {
    position: 'absolute',
    right: 0,
    top: 30,
    left: Dimensions.get('window').width - 80,
  },
});
