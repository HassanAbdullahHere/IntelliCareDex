import React, { useContext, useState } from 'react';
import { View, Text, StatusBar, TextInput, TouchableOpacity, Image, StyleSheet, ImageBackground, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { colors } from '../../../services';
import { appIcons } from '../../../services';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import ShowMessage from '../../../components/toasts/index';
import { Loader } from '../../../components/index';

import { routes } from '../../../services';
import { Header } from '../../../components';
import { userSave,setDevice } from '../../../redux/Slices/splashSlice';
import themeContext from '../../../services/config/themeContext';
import theme from '../../../services/config/theme';

const DeviceConfig = ({ navigation }) => {
  const theme = useContext(themeContext);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const userId = useSelector(state => state.splash.userID);

  const [deviceID, setDeviceID] = useState('');
  const [devicePassword, setDevicePassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const renderRaspberryPiIcon = () => (
    <Image source={appIcons.raspberry} style={styles.raspberryPiIcon} />
  );

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const verifyAndContinue = async () => {
    setLoading(true);

    try {
      const userSnapshot = await firestore().collection('User').where('DeviceID', '==', deviceID).get();
      
      if (!userSnapshot.empty) {
        ShowMessage('Device already registered');
      } else {
        
        await firestore().collection('User').doc(userId).update({ DeviceID: deviceID });
        ShowMessage('Device verified.');
        dispatch(setDevice(true));
        dispatch(userSave(true)); 
        
        navigation.replace(routes.drawer);

      }
    } catch (error) {
      ShowMessage('Error verifying device: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground source={require('../../../assets/Images/bg.png')} resizeMode="cover" style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor="transparent" barStyle={theme.theme === 'dark' ? 'light-content' : 'dark-content'} />
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <View style={styles.card}>
            {renderRaspberryPiIcon()}
            <Text style={styles.heading}>{t('Add your Device')}</Text>
            <Text style={styles.note}>{t('Enter the Device ID and password of your Raspberry Pi Device ')}</Text>
            <TextInput
              style={styles.input}
              placeholder={t('Device ID')}
              placeholderTextColor={colors.lightBlack}
              value={deviceID}
              onChangeText={setDeviceID}
            />
            <View style={styles.passwordInput}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder={t('Password')}
                placeholderTextColor={colors.lightBlack}
                secureTextEntry={!showPassword}
                value={devicePassword}
                onChangeText={setDevicePassword}
              />
              <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
                <Image source={showPassword ? appIcons.view : appIcons.hide} style={styles.eyeIconImage} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={verifyAndContinue} style={[styles.button, { backgroundColor: colors.theme }]}>
              {loading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.buttonText}>{t('Verify and Continue')}</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate(routes.login)} style={[styles.button, { backgroundColor: colors.lightBlack }]}>
              <Text style={styles.buttonText}>{t('Return to Login')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    width: '100%',
  },
  heading: {
    color: colors.black,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  note: {
    color: colors.lightBlack,
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 40,
    color:colors.black,
    borderColor: colors.black,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  passwordInput: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  button: {
    width: '100%',
    height: 40,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  raspberryPiIcon: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    top:10
  },
  eyeIconImage: {
    width: 20,
    height: 20,
  },
});

export default DeviceConfig;
