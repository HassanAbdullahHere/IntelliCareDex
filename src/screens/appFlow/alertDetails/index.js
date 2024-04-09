import React, { useContext, useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator, PermissionsAndroid, Platform } from 'react-native';
import { Header } from '../../../components';
import { appIcons } from '../../../services';
import themeContext from '../../../services/config/themeContext';
import Video from 'react-native-video';
import RNFetchBlob from 'rn-fetch-blob';
import { Loader } from '../../../components/loader/index';

const AlertDetailScreen = ({ route, navigation }) => {
    const { notification } = route.params;
    const theme = useContext(themeContext);
    const [videoLoading, setVideoLoading] = useState(true);
    const [hasStoragePermission, setHasStoragePermission] = useState(false);
  
    useEffect(() => {
      checkStoragePermission();
    }, []);
  
    const checkStoragePermission = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
              title: 'Storage Permission Required',
              message: 'This app needs access to your storage to download files.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );
          setHasStoragePermission(granted === PermissionsAndroid.RESULTS.GRANTED);
        } catch (err) {
          console.error('Error requesting storage permission:', err);
        }
      } else {
        setHasStoragePermission(true); 
      }
    };
  
    const handleDownload = async () => {
      if (!hasStoragePermission) {
        console.log('Storage permission not granted. Requesting again...');
        await checkStoragePermission();
        return;
      }
  
      const { config, fs } = RNFetchBlob;
      const DownloadDir = fs.dirs.DownloadDir;
      const options = {
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: `<span class="math-inline">\{DownloadDir\}/</span>{notification.fileName}`,
          description: 'Downloading file.',
        },
      };
      config(options)
        .fetch('GET', notification.videoUrl)
        .then((res) => {
          console.log('File Downloaded Successfully');
        })
        .catch((error) => {
          console.error(error);
        });
    };
  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <Header leftIcon={appIcons.backIcon} onPress={() => navigation.goBack()} title={'Alert Details'} />
      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>
        <View style={{ alignItems: 'center', marginTop: 20, position: 'relative' }}>
          {videoLoading && <ActivityIndicator size="large" color="gray" />}
          <Video
            source={{ uri: 'https://vod-progressive.akamaized.net/exp=1711461555~acl=%2Fvimeo-prod-skyfire-std-us%2F01%2F4467%2F14%2F372335193%2F1547101002.mp4~hmac=7ba186474ffa748c6ea94636d5e450347c0f2a2875cefaf7cd9e16130add30b6/vimeo-prod-skyfire-std-us/01/4467/14/372335193/1547101002.mp4?filename=file.mp4' }}
            style={{ width: '110%', aspectRatio: 16 / 11 }}
            controls={true}
            resizeMode="contain"
            onError={(error) => console.error(error)}
            onLoadStart={() => setVideoLoading(true)}
            onLoad={() => setVideoLoading(false)}
          />
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
          <TouchableOpacity style={{ flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5, alignItems: 'center', justifyContent: 'center', backgroundColor: 'green' }} onPress={handleDownload}>
            <Image source={appIcons.download} style={{ width: 20, height: 20, marginRight: 10 }} />
            <Text style={{ color: 'white', fontSize: 16 }}>Download</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5, alignItems: 'center', justifyContent: 'center', backgroundColor: 'red' }}>
            <Image source={appIcons.delete} style={{ width: 20, height: 20, marginRight: 10 }} />
            <Text style={{ color: 'white', fontSize: 16 }}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default AlertDetailScreen;
