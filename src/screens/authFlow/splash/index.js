import React, { useContext } from 'react'
import { View, Text, StatusBar,Image } from 'react-native'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next';
import messaging from '@react-native-firebase/messaging';
import {PermissionsAndroid} from 'react-native';
import { routes } from '../../../services'
import { styles } from './styles'
import themeContext from '../../../services/config/themeContext'


const Splash = ({ navigation }) => {
  const theme = useContext(themeContext)
  const user = useSelector((state) => state.splash.value)
  const { t } = useTranslation();

  React.useEffect(() => {
    const requestPermissions = async () => {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);

      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization status:', authStatus);
        const token = await messaging().getToken();
        //console.log('FCM TOKEN: ', token)
      }
    };
    requestPermissions();
  },[])


  React.useEffect(() => {
    performTimeConsumingTask()
  }, [])

  const performTimeConsumingTask = async () => {
    return new Promise(resolve =>
      setTimeout(() => {
        navigation.replace(user == null ? routes.welcome : routes.drawer)
      }, 3000),
    )
  }
  return (
    <View style={[styles.container, { backgroundColor: "#83c9e3" }]}>
      <StatusBar backgroundColor={theme.background} barStyle={theme.theme === 'dark' ? 'light-content' : 'dark-content'} />
      <View style={styles.wrapper}>
      <Image
          source={require('../../../assets/Images/logo.png')}
          style={{ width: 250, height: 250, resizeMode: 'contain' }}
        />
      </View>
    </View>
  )
}

export default Splash

