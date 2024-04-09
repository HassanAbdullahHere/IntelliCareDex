import React, { useContext, useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Switch, ActivityIndicator, TextInput, Modal, TouchableWithoutFeedback } from 'react-native';
import { Header } from '../../../components';
import { appIcons } from '../../../services';
import themeContext from '../../../services/config/themeContext';
import Video from 'react-native-video';
import firestore from '@react-native-firebase/firestore';

const CameraDetails = ({ route, navigation }) => {
  const { camera, userId } = route.params;
  const [editing, setEditing] = useState(false);
  const [newCameraName, setNewCameraName] = useState(camera.name);
  const [liveStream, setLiveStream] = useState(camera.live);
  const [videoLoading, setVideoLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const theme = useContext(themeContext);

  useEffect(() => {console.log(userId)},[])

  const updateCameraName = async () => {
    try {
      const userRef = firestore().collection('User').doc(userId);
      const userDoc = await userRef.get();
      if (!userDoc.exists) {
        console.error('User document does not exist');
        return;
      }
      const userData = userDoc.data();
      const updatedCameras = userData.Cameras.map(cam => {
        if (cam.ipAddress === camera.ipAddress) {
          return { ...cam, cameraName: newCameraName };
        }
        return cam;
      });
      await userRef.update({ Cameras: updatedCameras });
      setEditing(false);
      navigation.navigate('dashboard')
    } catch (error) {
      console.error('Error updating camera name:', error);
    }
  };
  
  const toggleLiveStream = async (value) => {
    try {
      const userRef = firestore().collection('User').doc(userId);
      const userDoc = await userRef.get();
      if (!userDoc.exists) {
        console.error('User document does not exist');
        return;
      }
      const userData = userDoc.data();
      const updatedCameras = userData.Cameras.map(cam => {
        if (cam.ipAddress === camera.ipAddress) {
          return { ...cam, live: value };
        }
        return cam;
      });
      await userRef.update({ Cameras: updatedCameras });
      setLiveStream(value);
    } catch (error) {
      console.error('Error toggling live stream:', error);
    }
  };
  

  return (
    <View style={styles.container}>
      <Header leftIcon={appIcons.backIcon} onPress={() => navigation.goBack()} title={camera.cameraName} />
      <View style={styles.videoContainer}>
        {videoLoading && <ActivityIndicator size="large" color="gray" />}
        <Video
          source={{ uri: 'https://vod-progressive.akamaized.net/exp=1711461555~acl=%2Fvimeo-prod-skyfire-std-us%2F01%2F4467%2F14%2F372335193%2F1547101002.mp4~hmac=7ba186474ffa748c6ea94636d5e450347c0f2a2875cefaf7cd9e16130add30b6/vimeo-prod-skyfire-std-us/01/4467/14/372335193/1547101002.mp4?filename=file.mp4' }}
          style={{ width: '100%', aspectRatio: 16/ 9 }}
          controls={true}
          resizeMode="contain"
          onError={(error) => console.error(error)}
          onLoadStart={() => setVideoLoading(true)}
          onLoad={() => setVideoLoading(false)}
        />
      </View>
      <View style={styles.cameraNameContainer}>
        <Text style={styles.cameraName}>{editing ? 'Edit Camera Name' : camera.cameraName}</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Image source={appIcons.edit} style={styles.editIcon} />
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Edit Camera Name</Text>
              <TextInput
                style={styles.modalInput}
                value={newCameraName}
                onChangeText={setNewCameraName}
                placeholder="Enter new camera name"
              />
              <TouchableOpacity onPress={updateCameraName}>
                <Text style={styles.saveButton}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <View style={styles.liveStreamContainer}>
        <Text style={{color: "black"}}>Live Stream</Text>
        <Switch value={liveStream} onValueChange={toggleLiveStream} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  videoContainer: {
    flex: 1,
   marginTop:40 
   
  },
  cameraNameContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
  cameraName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  editIcon: {
    width: 20,
    height: 20,
    marginLeft: 10,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  saveButton: {
    fontSize: 16,
    color: 'blue',
    textAlign: 'center',
  },
  liveStreamContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});

export default CameraDetails;
