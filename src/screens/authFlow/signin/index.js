import React, { useContext, useState } from 'react';
import { View, Text, StatusBar, TextInput, TouchableOpacity, Image, StyleSheet, ImageBackground } from 'react-native';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { colors } from '../../../services';
import { styles } from './styles';
import { appIcons } from '../../../services'
import auth from '@react-native-firebase/auth';
import ShowMessage from '../../../components/toasts/index';

import { routes } from '../../../services';
import { Header } from '../../../components';
import { userSave } from '../../../redux/Slices/splashSlice';
import themeContext from '../../../services/config/themeContext';
import theme from '../../../services/config/theme';


const LoginScreen = ({ navigation }) => {
  const theme = useContext(themeContext);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const authenticateUser = async () => {
    if (!email || !password) {
      ShowMessage("Please enter email and password properly");
      return;
    }

    const user = await auth()
      .signInWithEmailAndPassword(email, password)
      .then((data) => {
        if (data.user.emailVerified) {
          ShowMessage("Logged in Successfully")
          onPressLogin()
        } else {
          ShowMessage("Verify Your Email First")
        }
      })
      .catch(error => {
        ShowMessage(error.message);
      });
  }

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

  const onPressLogin = () => {
    dispatch(userSave(true));
    navigation.replace(routes.drawer);
  };

  return (
    <ImageBackground source={require('../../../assets/Images/bg.png')} resizeMode={"cover"} style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor="transparent" barStyle={theme.theme === 'dark' ? 'light-content' : 'dark-content'} />
      <View style={styles.container}>
        <Header title={'Login'} />
        <View style={[styles.wrapper]}>
          <View style={styles.card}>
            <Image source={require('../../../assets/Images/logo.png')} style={styles.logo} />
            <Text style={{ color: colors.lightBlack, fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>{t('Welcome back!')}</Text>
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
              <Text style={styles.resetPasswordText}>{t('Reset Password')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => authenticateUser()} style={[styles.button, { backgroundColor: colors.theme }]}>
              <Text style={styles.buttonText}>{t('Login')}</Text>
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
