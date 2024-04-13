import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StatusBar, TouchableOpacity, FlatList, Image, StyleSheet } from 'react-native';
import { DrawerActions } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import { Loader } from '../../../components/loader/index';
import { appIcons } from '../../../services';
import { Header } from '../../../components';
import { styles } from './styles';
import themeContext from '../../../services/config/themeContext';

const Dashboard = ({ navigation }) => {
  const theme = useContext(themeContext);
  const { t } = useTranslation();
  const userId = useSelector(state => state.splash.userID); 
  const [userName, setUserName] = useState('');
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true); // State to manage loader visibility



  
  async function saveTokenToDatabase(token) {
    
    // Add the token to the users datastore
    await firestore()
      .collection('User')
      .doc(userId)
      .update({
        token: token,
      });
  }
  
  useEffect(() => {
    // Get the device token
    messaging()
      .getToken()
      .then(token => {
        return saveTokenToDatabase(token);
      });

    return messaging().onTokenRefresh(token => {
      saveTokenToDatabase(token);
      console.log("Token: ",token)
    });
  }, []);

  useEffect(() => {
    if (userId) {
      const unsubscribe = firestore().collection('User').doc(userId)
        .onSnapshot((snapshot) => {
          const userData = snapshot.data();
          setUserName(userData.name || ''); 
          setCameras(userData.Cameras || []);
          setLoading(false); // Hide loader when cameras are fetched
        });

      return () => unsubscribe();
    }
  }, [userId]);

  const addCamera = () => {
    navigation.navigate(addCamera); 
  };

  const navigateToCameraDetails = (camera) => {
    navigation.navigate('cameraDetails', { camera, userId }); 
    console.log(camera)
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        backgroundColor={theme.background}
        barStyle={theme.theme === 'dark' ? 'light-content' : 'dark-content'}
      />
      <Header
        leftIcon={appIcons.drawer}
        onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
        title={'Dashboard'}
      />
      <View style={[styles.wrapper, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.color, fontSize: 20, fontWeight: 'bold' }}>{t('Welcome!')} </Text>
        <Text style={{color: theme.color, fontSize:15}}>{userName}</Text>
        <TouchableOpacity onPress={addCamera} style={styles.cameraButton}>
          <Image source={appIcons.addCamera} style={{ width: 20, height: 20, marginRight: 10 }} />
          <Text style={[styles.cameraText, {color: theme.color}]}>Add Camera</Text>
        </TouchableOpacity>
        {loading ? (
          <Loader true/>
        ) : (
          cameras.length > 0 ? (
            <FlatList
              data={cameras}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.imageContainer} onPress={() => navigateToCameraDetails(item)}>
                  <Image source={require('../../../assets/Images/image1.jpg')} style={styles.image} />
                  <View style={styles.cameraBadge}>
                    <View style={[styles.dot, { backgroundColor: item.live ? 'red' : 'transparent' }]} />
                    <Text style={styles.cameraName}>{item.cameraName}</Text>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.imageList}
            />
          ) : (
            <Text style={[styles.noCamerasText, { color: theme.color }]}>No Cameras added yet</Text>
          )
        )}
      </View>
    </View>
  );
};

export default Dashboard;
