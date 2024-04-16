import React, { useContext, useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator, TextInput, Modal, TouchableWithoutFeedback } from 'react-native';
import { Header } from '../../../components';
import { appIcons } from '../../../services';
import Video from 'react-native-video';
import firestore from '@react-native-firebase/firestore';
import ShowMessage from '../../../components/toasts/index';
import theme from '../../../services/config/theme';
import themeContext from '../../../services/config/themeContext';
import { colors } from '../../../services/utilities/colors/index';

const CameraDetails = ({ route, navigation }) => {
  const { camera, userId } = route.params;
  const [editing, setEditing] = useState(false);
  const theme = useContext(themeContext);
  const [newCameraName, setNewCameraName] = useState(camera.cameraName);
  const [videoLoading, setVideoLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {console.log(userId)},[])

  const updateCameraName = async () => {
    // Update camera name in Firestore
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
        navigation.navigate('dashboard');

        // Send request to server to update camera name
        const response = await fetch(`https://87f8-39-46-133-144.ngrok-free.app/update_camera_name`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                camera_ip: camera.ipAddress,
                camera_name: newCameraName,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to update camera name on the server');
        }

        const responseData = await response.json();
        if (responseData.success !== true) {
            throw new Error(responseData.message || 'Failed to update camera name on the server');
        }

        console.log('Camera name updated successfully on the server');
    } catch (error) {
        console.error('Error updating camera name:', error);
    }
  };

  const removeCamera = async () => {
    setLoading(true);
    // Remove camera from Firestore and end detection on the server
    try {
        const userRef = firestore().collection('User').doc(userId);
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            console.error('User document does not exist');
            return;
        }
        const userData = userDoc.data();
        const updatedCameras = userData.Cameras.filter(cam => cam.ipAddress !== camera.ipAddress);
        await userRef.update({ Cameras: updatedCameras });

        // Send request to server to end detection for this camera
        const response = await fetch(`https://87f8-39-46-133-144.ngrok-free.app/end_detection`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                camera_ip: camera.ipAddress,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to end detection for the camera on the server');
        }

        const responseData = await response.json();
        if (responseData.success !== true) {
            throw new Error(responseData.message || 'Failed to end detection for the camera on the server');
        }

        console.log('Detection ended successfully for the camera on the server');
        ShowMessage("Camera Removed Successfully")
        navigation.navigate('dashboard');
    } catch (error) {
        console.error('Error removing camera:', error);
    }finally{
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <Header leftIcon={appIcons.backIcon} onPress={() => navigation.goBack()} title={camera.cameraName} />
      <View style={{ flex: 1, marginTop: 40 }}>
        {videoLoading && <ActivityIndicator size="large" color="gray" />}
        <Video
         source={{ uri: "https://videos.pexels.com/video-files/19757074/19757074-sd_640_360_30fps.mp4" }}
          style={{ width: '100%', aspectRatio: 16/ 9 }}
          controls={false}
          resizeMode="contain"
          onError={(error) => console.error(error)}
          onLoadStart={() => setVideoLoading(true)}
          onLoad={() => setVideoLoading(false)}
        />
      </View>
      <View style={{ marginBottom:70,flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: 'lightgray' }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: theme.color }}>{editing ? 'Edit Camera Name' : camera.cameraName}</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Image source={appIcons.edit} style={{ width: 20, height: 20, marginLeft: 10 }} />
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: colors.themeSecondary, padding: 20, borderRadius: 10, width: '80%' }}>
              <Text style={{ color:theme.color, fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Edit Camera Name</Text>
              <TextInput
                style={{ borderWidth: 1, borderColor: 'gray', borderRadius: 5, padding: 10, marginBottom: 10 }}
                value={newCameraName}
                onChangeText={setNewCameraName}
                placeholder="Enter new camera name"
              />
              <TouchableOpacity onPress={updateCameraName}>
                <Text style={{ fontSize: 16, color: 'green', textAlign: 'center' }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <TouchableOpacity onPress={removeCamera} style={{ marginBottom:140,backgroundColor: 'red', paddingVertical: 12, alignItems: 'center', marginHorizontal: 16, borderRadius: 5, marginTop: 20 }}>
      {loading ? (
        <ActivityIndicator size="small" color="white" /> 
      ) : (
        <Text style={{ fontSize: 16, color: 'white', fontWeight: 'bold' }}>Remove Camera</Text> 
      )}
    </TouchableOpacity>
    </View>
  );
};

export default CameraDetails;
