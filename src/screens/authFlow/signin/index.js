import React, { useContext, useState, useEffect, useCallback } from 'react';
import { View, Text, StatusBar, TextInput, TouchableOpacity, Image, StyleSheet, ImageBackground, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { colors } from '../../../services';
import { styles } from './styles';
import { appIcons } from '../../../services'
import auth from '@react-native-firebase/auth';
import ShowMessage from '../../../components/toasts/index';
import firestore from '@react-native-firebase/firestore';
import { useFocusEffect } from '@react-navigation/native'; 

import { routes } from '../../../services';
import { Header } from '../../../components';
import { userSave, saveUserID, setDevice } from '../../../redux/Slices/splashSlice';
import themeContext from '../../../services/config/themeContext';
import theme from '../../../services/config/theme';

const LoginScreen = ({ navigation }) => {
  const theme = useContext(themeContext);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [deviceConfigCompleted, setDeviceConfigCompleted] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (deviceConfigCompleted !== null) {
      onPressSignup()
    }
  }, [deviceConfigCompleted]);
  

  const checkDeviceConfigStatus = async () => {
    try {
      const userQuerySnapshot = await firestore()
        .collection('User')
        .where('email', '==', email)
        .limit(1)
        .get();
        
      if (!userQuerySnapshot.empty) {
        const userData = userQuerySnapshot.docs[0].data();
        console.log("User data:", userData);
        console.log("DeviceIP:", userData.DeviceIP);
  
        if (userData.DeviceIP !== "") {
          setDeviceConfigCompleted(true);
          console.log("State set to true");
        } else {
          setDeviceConfigCompleted(false);
          console.log("State set to false");
        }
      } else {
        setDeviceConfigCompleted(false);
        console.log("No user found with the provided email");
      }
    } catch (error) {
      console.error('Error checking device configuration status:', error);
      setDeviceConfigCompleted(false);
      console.log("Error occurred while checking device configuration");
    }
  };
  
  
  

  const authenticateUser = async () => {
    if (!email || !password) {
      ShowMessage("Please enter email and password properly");
      return;
    }
    setLoading(true);
  
    try {
      const { user } = await auth().signInWithEmailAndPassword(email, password);
      if (user.emailVerified) {
        await checkDeviceConfigStatus(); 
        console.log("State: ",deviceConfigCompleted)
        dispatch(saveUserID(user.uid));
        // Introduce a 2-second delay
        // setTimeout(() => {
        //   onPressSignup();
        // }, 2000);
      } else {
        ShowMessage("Verify Your Email First");
      }
    } catch (error) {
      ShowMessage(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  

  const resetPassword = async () => {
    if (!email) {
      ShowMessage("Please enter your email address");
      return;
    }

    try {
      await auth().sendPasswordResetEmail(email);
      ShowMessage("Password reset email sent to your email address.");
    } catch (error) {
      ShowMessage("Error sending password reset email:", error.message);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onPressSignup = () => {
    console.log("onPressSignup called");
    if (deviceConfigCompleted) {
      console.log("Navigating to drawer");
      navigation.replace(routes.drawer);
      dispatch(userSave(true)); 
      ShowMessage("Logged in Successfully");
    } else {
      console.log("Navigating to deviceConfig");
      navigation.navigate(routes.deviceConfig);
    }
  };
  
  

  return (
    <ImageBackground source={require('../../../assets/Images/bg.png')} resizeMode={"cover"} style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor="transparent" barStyle={theme.theme === 'dark' ? 'light-content' : 'dark-content'} />
      <View style={styles.container}>

        <View style={[styles.wrapper]}>
          <View style={styles.card}>
            <Image source={require('../../../assets/Images/logo.png')} style={styles.logo} />
            <Text style={{ color: colors.lightBlack, fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Welcome back!</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.black, color: colors.black }]}
              placeholder={t('Email')}
              placeholderTextColor={colors.lightBlack}
              keyboardType={"email-address"}
              value={email}
              onChangeText={text => { setEmail(text) }}
            />
            <View style={styles.passwordInput}>
              <TextInput
                style={[styles.input, { borderColor: colors.black, color: colors.black, flex: 1 }]}
                placeholder={t('Password')}
                placeholderTextColor={colors.lightBlack}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={text => { setPassword(text) }}
                keyboardType={"default"}
              />
              <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
                <Image source={showPassword ? appIcons.view : appIcons.hide} style={styles.eyeIconImage} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={resetPassword} style={styles.resetPasswordButton}>
              <Text style={styles.resetPasswordText}>{t('Forgot Password?')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => authenticateUser()} style={[styles.button, { backgroundColor: colors.theme }]}>
              {loading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.buttonText}>{t('Login')}</Text>
              )}
            </TouchableOpacity>
            <View style={styles.BottomText}>
              <Text style={[styles.text, { color: colors.lightBlack }]}>{t('Don\'t have an account?')}</Text>
              <TouchableOpacity onPress={() => navigation.navigate(routes.signup)}>
                <Text style={[styles.text, { color: colors.theme }]}>{t('Sign up')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

export default LoginScreen;
