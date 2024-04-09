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
import axios from 'axios';

import { routes } from '../../../services';
import { Header } from '../../../components';
import { userSave,setDevice } from '../../../redux/Slices/splashSlice';
import themeContext from '../../../services/config/themeContext';
import theme from '../../../services/config/theme';
import { get } from '../../../../node_modules/react-native/Libraries/TurboModule/TurboModuleRegistry';
import { fetchData } from '../../../network/NetworkManger';

const DeviceConfig = ({ navigation }) => {
  const theme = useContext(themeContext);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const userId = useSelector(state => state.splash.userID);

  const [cloudServerIP, setCloudServerIP] = useState('');
  const [deviceIP, setDeviceIP] = useState('');
  const [devicePassword, setDevicePassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const renderRaspberryPiIcon = () => (
    <Image source={appIcons.raspberry} style={styles.raspberryPiIcon} />
  );

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const verifyAndContinue = () => {
    setLoading(true);

    // Validate IP format
    const ipRegex = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
    const ipPortRegex = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d{1,5}$/;

    if (!ipPortRegex.test(cloudServerIP) || !ipRegex.test(deviceIP)) {
        setLoading(false);
        ShowMessage('Invalid IP format.');
        return;
    }

    // Check if there are any users in Firestore
    firestore().collection('User').get()
        .then(snapshot => {
            if (snapshot.empty) {
                // No users exist, proceed directly with the request
                return sendRequest();
            } else {
                // Users exist, further check if the device IP already exists
                return firestore().collection('User').where('DeviceIP', '==', deviceIP).get()
                    .then(deviceSnapshot => {
                        if (!deviceSnapshot.empty) {
                            // Device IP already in use
                            setLoading(false);
                            ShowMessage('Device IP already in use.');
                        } else {
                            // Device IP not in use, proceed with verification
                            return sendRequest();
                        }
                    });
            }
        })
        .catch(error => {
            ShowMessage('Error checking users: ' + error.message);
            setLoading(false);
        });
};

const sendRequest = () => {
    // Proceed with verification
    fetch(`https://5683-182-178-133-244.ngrok-free.app/check_raspberry_pi_ip`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            raspberry_pi_ip: deviceIP,
            user_id: userId,
        }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to check Raspberry Pi IP.');
            }
            return response.json();
        })
        .then(json => {
            if (json.status === 'success') {
                // Raspberry Pi IP is available, proceed to save both IPs
                firestore().collection('User').doc(userId).update({
                    DeviceIP: deviceIP,
                });
                ShowMessage('Device verified.');
                dispatch(setDevice(true));
                dispatch(userSave(true));
                navigation.replace(routes.drawer);
            } else {
                ShowMessage('Raspberry Pi IP did not match.');
            }
        })
        .catch(error => {
            ShowMessage('Error verifying device: ' + error.message);
        })
        .finally(() => {
            setLoading(false);
        });
};

  
  return (
    <ImageBackground source={require('../../../assets/Images/bg.png')} resizeMode="cover" style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor="transparent" barStyle={theme.theme === 'dark' ? 'light-content' : 'dark-content'} />
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <View style={styles.card}>
            {renderRaspberryPiIcon()}
            <Text style={styles.heading}>{t('Add your Device')}</Text>
            <Text style={styles.note}>{t('Enter the Device IP and password of your Raspberry Pi Device ')}</Text>
            <TextInput
              style={styles.input}
              placeholder={t('Cloud Server IP:Port')}
              placeholderTextColor={colors.lightBlack}
              value={cloudServerIP}
              onChangeText={setCloudServerIP}
            />
            <TextInput
              style={styles.input}
              placeholder={t('Device IP')}
              placeholderTextColor={colors.lightBlack}
              value={deviceIP}
              onChangeText={setDeviceIP}
            />
            
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
