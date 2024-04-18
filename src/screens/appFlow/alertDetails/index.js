import React, { useContext, useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator, PermissionsAndroid, Platform } from 'react-native';
import { Header } from '../../../components';
import { appIcons } from '../../../services';
import themeContext from '../../../services/config/themeContext';
import Video from 'react-native-video';
import RNFetchBlob from 'rn-fetch-blob';
import { Loader } from '../../../components/loader/index';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import ShowMessage from '../../../components/toasts/index';

const AlertDetailScreen = ({ route, navigation }) => {
    const { notification } = route.params;
    const theme = useContext(themeContext);
    const [videoLoading, setVideoLoading] = useState(true);
    const [hasStoragePermission, setHasStoragePermission] = useState(true);
    const [localVideoUri, setLocalVideoUri] = useState(null);
    const userId = auth().currentUser.uid; 

    useEffect(() => {
        handleDownload();
    }, []);

    

    const handleDownload = async () => {
        if (!hasStoragePermission) {
            console.log('Storage permission not granted. Requesting again...');
            
            return;
        }

        // Assuming notification.clip contains the base64 encoded video string
        const base64Video = notification.clip;
        const { config, fs } = RNFetchBlob;
        const DownloadDir = fs.dirs.DownloadDir;
        const localVideoPath = `${DownloadDir}/${notification.key}`;

        RNFetchBlob.fs.writeFile(localVideoPath, base64Video, 'base64')
            .then(() => {
                console.log('Video saved to:', localVideoPath);
                setLocalVideoUri(`file://${localVideoPath}`);
            })
            .catch((error) => {
                console.error('Error saving video:', error);
            });
    };

    const handleDelete = async () => {
      try {
           // Assuming you have the user ID
          const userRef = firestore().collection('User').doc(userId);
          const userDoc = await userRef.get();
          
          if (userDoc.exists) {
              const userData = userDoc.data();
              const updatedAlerts = userData.Alerts.filter(alert => alert.key !== notification.key);
              await userRef.update({ Alerts: updatedAlerts });
              console.log('Alert deleted successfully');
              ShowMessage("Clip Deleted Successfully.")
              navigation.goBack(); // Navigate back after deletion
          } else {
              console.error('User document not found');
          }
      } catch (error) {
          console.error('Error deleting alert:', error);
      }
  };

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <Header leftIcon={appIcons.backIcon} onPress={() => navigation.goBack()} title={'Alert Details'} />
            <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>
                <View style={{ alignItems: 'center', marginTop: 20, position: 'relative' }}>
                    {videoLoading && <ActivityIndicator size="large" color="gray" />}
                    {localVideoUri && (
                        <Video
                            source={{ uri: localVideoUri }}
                            style={{ width: '110%', aspectRatio: 16 / 11 }}
                            controls={true}
                            resizeMode="contain"
                            onError={(error) => console.error(error)}
                            onLoadStart={() => setVideoLoading(true)}
                            onLoad={() => setVideoLoading(false)}
                        />
                    )}
                </View>
                <View style={{ marginTop: 20, paddingHorizontal: 20 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 25 }}>
                        <Text style={{ fontSize: 16, color: 'gray' }}>{notification.time}</Text>
                    </View>
                    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginBottom: 25 }}>
                        <Text style={{ fontSize: 24, color: theme.color, fontWeight: 'bold', marginBottom: 15 }}>{notification.detectionType}</Text>
                        <Text style={{ fontSize: 16, color: theme.color }}>{notification.cameraName}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                    
                    <TouchableOpacity style={{ flexDirection: 'row', paddingVertical: 10, marginLeft:85,paddingHorizontal: 20, borderRadius: 5, alignItems: 'center', justifyContent: 'center', backgroundColor: 'red' }} onPress={handleDelete}>
                        <Image source={appIcons.delete} style={{ width: 20, height: 20, marginRight: 10 }} />
                        <Text style={{ color: 'white', fontSize: 16 }}>Delete</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default AlertDetailScreen;
