import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StatusBar, TouchableOpacity, FlatList, Image } from 'react-native';
import { DrawerActions } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import firestore from '@react-native-firebase/firestore';

import { appIcons } from '../../../services';
import { Header } from '../../../components';
import { styles } from './styles';
import themeContext from '../../../services/config/themeContext';

const Dashboard = ({ navigation }) => {
  const theme = useContext(themeContext);
  const { t } = useTranslation();
  const userId = useSelector(state => state.splash.userID); 
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (userId) {
      const unsubscribe = firestore().collection('User').doc(userId)
        .onSnapshot((snapshot) => {
          const userData = snapshot.data();
          setUserName(userData.name || ''); 
        });

      return () => unsubscribe();
    }
  }, [userId]);

  const cameraData = [
    { name: 'Camera 1', live: true },
    { name: 'Camera 2', live: false },
    { name: 'Camera 3', live: true },
  ];

  const imageArray = [
    { uri: require('../../../assets/Images/image1.jpg'), cameraIndex: 0 },
    { uri: require('../../../assets/Images/image2.jpg'), cameraIndex: 1 },
    { uri: require('../../../assets/Images/image3.jpg'), cameraIndex: 2 },
  ];

  const renderImageItem = ({ item, index }) => (
    <TouchableOpacity style={styles.imageContainer}>
      <Image source={item.uri} style={styles.image} />
      <View style={styles.cameraBadge}>
        <View style={[styles.dot, { backgroundColor: cameraData[item.cameraIndex].live ? 'red' : 'transparent' }]} />
        <Text style={styles.cameraName}>{cameraData[item.cameraIndex].name}</Text>
      </View>
    </TouchableOpacity>
  );

  const addCamera = () => {
    // Logic to add camera functionality
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
        <Text style={{ color: theme.color, fontSize: 20, fontWeight: 800 }}>{t('Welcome!')} </Text>
        <Text style={{color: theme.notbackground, fontSize:15}}>{userName}</Text>
        <TouchableOpacity onPress={addCamera} style={styles.cameraButton}>
        <Image source={appIcons.addCamera} style={{ width: 20, height: 20, marginRight: 10 }} />
          <Text style={[styles.cameraText, {color: theme.color}]}>Add Camera</Text>
          
        </TouchableOpacity>
        <FlatList
          data={imageArray}
          renderItem={renderImageItem}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.imageList}
        />
      </View>
    </View>
  );
};

export default Dashboard;
