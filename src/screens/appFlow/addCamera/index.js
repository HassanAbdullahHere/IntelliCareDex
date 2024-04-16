import React, { useContext, useState,useEffect } from 'react';
import { View, Text, StatusBar, TextInput, TouchableOpacity, Image, StyleSheet, ImageBackground, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { colors } from '../../../services';
import { appIcons } from '../../../services';
import firestore from '@react-native-firebase/firestore';
import ShowMessage from '../../../components/toasts/index';
import { Loader } from '../../../components/index';

import { routes } from '../../../services';
import { Header } from '../../../components';
import { userSave, setDevice } from '../../../redux/Slices/splashSlice';
import themeContext from '../../../services/config/themeContext';
import theme from '../../../services/config/theme';
import { Dashboard } from '../index';

const AddCamera = ({ navigation }) => {
  const theme = useContext(themeContext);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const userId = useSelector(state => state.splash.userID);
  const newAlert = useSelector(state => state.splash.newAlert) 

  const [cameraName, setCameraName] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {console.log(newAlert)},[])

  
  const validateIpAddress = (ip) => {
    // Simple IP address validation
    const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
    return ipRegex.test(ip);
  };

  const addCamera = async () => {
    if (!validateIpAddress(ipAddress)) {
        ShowMessage('Invalid IP Address');
        return;
    }

    setLoading(true);

    try {
        // Get CloudServerIP from Firestore
        const userRef = firestore().collection('User').doc(userId);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            ShowMessage('User does not exist');
            return;
        }

        const userData = userDoc.data();
        const cloudServerIP = userData.CloudServerIP;

        // Check if camera IP already exists in Firestore
        const existingCameras = userData.Cameras || [];
        const existingCamera = existingCameras.find(camera => camera.ipAddress === ipAddress);

        if (existingCamera) {
            ShowMessage('IP Address already exists');
            return;
        }

        // Send request to validate camera IP and receive stream URL from server
        const response = await fetch(`https://87f8-39-46-133-144.ngrok-free.app/validate_camera`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                camera_ip: ipAddress,
                camera_name: cameraName
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to validate camera IP');
        }

        const responseData = await response.json();
        
        // Check if the response is negative
        if (responseData.status !== 'success') {
            ShowMessage('Failed to validate camera IP');
            return;
        }

        // Extract stream URL and camera name from the response
        const { stream_url, camera_name } = responseData;

        // Prepare updated cameras array
        let updatedCameras = [];

        if (!userData.Cameras || !Array.isArray(userData.Cameras)) {
            updatedCameras = [{ cameraName, ipAddress, streamUrl: stream_url, live: true }]; 
            await userRef.set({ Cameras: updatedCameras }, { merge: true });
        } else {
            const existingCameras = userData.Cameras;
            updatedCameras = [...existingCameras, { cameraName, ipAddress, streamUrl: stream_url, live: true }];
            await userRef.update({ Cameras: updatedCameras });
        }

        ShowMessage('Camera added successfully');
        navigation.navigate('dashboard');
         // Notify server to start detection
         await fetch(`https://87f8-39-46-133-144.ngrok-free.app/start_detection`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              camera_ip: ipAddress,
          }),
          });


        
    } catch (error) {
        ShowMessage('Error adding camera: ' + error.message);
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
          <Image source={appIcons.cctv} style={styles.Icon} />
            <Text style={styles.heading}>{t('Add a Camera')}</Text>
            <TextInput
              style={styles.input}
              placeholder={t('Camera Name')}
              placeholderTextColor={colors.lightBlack}
              value={cameraName}
              onChangeText={setCameraName}
            />
            <TextInput
              style={styles.input}
              placeholder={t('IP Address')}
              placeholderTextColor={colors.lightBlack}
              value={ipAddress}
              onChangeText={setIpAddress}
            />
            <TouchableOpacity onPress={addCamera} style={[styles.button, { backgroundColor: colors.theme }]}>
              {loading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.buttonText}>{t('Add Camera')}</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('dashboard')} style={[styles.button, { backgroundColor: colors.lightBlack }]}>
              <Text style={styles.buttonText}>{t('Cancel')}</Text>
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
  Icon: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  heading: {
    color: colors.black,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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
});

export default AddCamera;
