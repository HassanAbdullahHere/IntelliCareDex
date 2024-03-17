import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Button, StatusBar, Alert, Image, TouchableOpacity, Modal ,ScrollView} from 'react-native';

import { DrawerActions } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { userSave } from '../../../redux/Slices/splashSlice';
import { useDispatch } from 'react-redux';
import { EventRegister } from 'react-native-event-listeners';
import ToggleSwitch from 'toggle-switch-react-native';

import { Header } from '../../../components';
import themeContext from '../../../services/config/themeContext';
import { useSelector } from 'react-redux'; 
import ShowMessage from '../../../components/toasts/index';
import { colors, routes, wp, hp, appIcons } from '../../../services'; 

const Profile = ({ navigation }) => {
    const theme = useContext(themeContext);
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const userId = useSelector(state => state.splash.userID);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [avatarImages, setAvatarImages] = useState([]);
    const [selectedAvatar, setSelectedAvatar] = useState(0);
    const [selectedAvatarIndex, setSelectedAvatarIndex] = useState(0);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isAvatarModalVisible, setIsAvatarModalVisible] = useState(false);
    const [newUsername, setNewUsername] = useState('');

    const handleAvatarSelection = (avatarIndex) => {
        setSelectedAvatarIndex(avatarIndex);
    };

    useEffect(() => {
        if (userId) {
            const unsubscribe = firestore().collection('User').doc(userId)
                .onSnapshot((snapshot) => {
                    const userData = snapshot.data();
                    setName(userData.name || ''); 
                    setEmail(userData.email || '');
                    setUserEmail(userData.email || '');
                    setSelectedAvatar(userData.AvatarNumber || 0);
                });

            return () => unsubscribe();
        }
    }, [userId]);

    useEffect(() => {
        // Pre-stored image paths and associated avatar numbers
        const images = [
            { avatarNumber: 0, imagePath: require('../../../assets/Images/p0.png'), name: "default"},
            { avatarNumber: 1, imagePath: require('../../../assets/Images/p1.jpg'), name: "default" },
            { avatarNumber: 2, imagePath: require('../../../assets/Images/p2.jpg'), name: "default" },
            { avatarNumber: 3, imagePath: require('../../../assets/Images/p3.jpg'), name: "default" },
            { avatarNumber: 4, imagePath: require('../../../assets/Images/p4.jpg') , name: "default"},
            { avatarNumber: 5, imagePath: require('../../../assets/Images/p5.jpg') , name: "default"},
            { avatarNumber:6, imagePath: require('../../../assets/Images/p6.jpg') , name: "default"},
            { avatarNumber: 7, imagePath: require('../../../assets/Images/p7.jpg'), name: "default" },
            { avatarNumber: 8, imagePath: require('../../../assets/Images/p8.jpg'), name: "default" },
            { avatarNumber: 9, imagePath: require('../../../assets/Images/p9.jpg'), name: "default" },

            // Add more image paths as needed
        ];
        setAvatarImages(images);
    }, []);

    const handleSaveAvatar = () => {
        const selectedAvatarNumber = avatarImages[selectedAvatarIndex]?.avatarNumber || 0;
        firestore().collection('User').doc(userId).update({ AvatarNumber: selectedAvatarNumber })
            .then(() => {
                ShowMessage('Avatar updated successfully!');
                setIsAvatarModalVisible(false);
            })
            .catch(error => {
                Alert.alert('Error updating avatar:', error.message);
            });
    };

    const handleSaveChanges = () => {
        firestore().collection('User').doc(userId).update({ name: newUsername })
            .then(() => {
                ShowMessage('Username updated successfully!');
                setIsModalVisible(false);
            })
            .catch(error => {
                Alert.alert('Error updating username:', error.message);
            });
    };

    const handleLogout = () => {
        dispatch(userSave(null))
        navigation.replace(routes.auth)
    }

    const LogOutUser = () => {
        auth().signOut()
        .then(() => {
            ShowMessage('User signed out!');
            handleLogout();
        });
    }

    const handleResetPassword = () => {
        const user = auth().currentUser;
        if (user) {
            auth().sendPasswordResetEmail(user.email)
                .then(() => {
                    ShowMessage('Password reset email sent to your email address.');
                    LogOutUser();
                })
                .catch(error => {
                    //ShowMessage(error.message);
                });
        } else {
            console.error('User not signed in.');
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: colors.theme }}>
            {/* Green view taking 20% of the screen */}
            <View style={{ height: '20%', backgroundColor: colors.theme, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}></View>
            <View style={{flex: 1,
        alignItems: 'center',
        paddingHorizontal: wp(5),
        backgroundColor: theme.background,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,}}>
                {/* Profile image */}
                <Image
                    source={avatarImages.find(image => image.avatarNumber === selectedAvatar)?.imagePath || require('../../../assets/Images/p0.png')}
                    style={{ width: 130, height: 130, borderRadius: 65, borderWidth: 5, borderColor: 'green', marginTop: -60 }}
                />
                <Image
                    source={appIcons.verify}
                    style={{ width: 30, height: 30, position: 'absolute', top:45 , right: 115 }}
                />
                {/* Change Avatar button */}
                <TouchableOpacity style={{ flexDirection:"column",alignItems:'center',position:"absolute",right:15,top:25,backgroundColor: colors.greyLight, paddingHorizontal: 10, paddingVertical: 8, borderRadius: 10, marginTop: 10, alignSelf: 'center' }} onPress={() => setIsAvatarModalVisible(true)}>
                <Image source={appIcons.avatar} style={{ width: 20, height: 20, marginRight: 10 }} />
                    <Text style={{ color: colors.black, fontSize: 8, fontWeight: 'bold', marginRight: 5 }}>Change Avatar</Text>
                </TouchableOpacity>
                {/* Name */}
                <Text style={{ fontSize: 24, marginTop: 20, color: theme.color }}>{name}</Text>
                <View style={{ marginTop: 30, width: '100%' }}>
                    {/* Email */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20,borderRadius:30, backgroundColor: theme.notbackground,alignSelf:"center", paddingVertical: 10, paddingHorizontal: 20 }} onPress={() => {}}>
                        <Image source={appIcons.email} style={{ width: 20, height: 20, marginRight: 10 }} />
                        <Text style={{ fontSize: 15, color: colors.black }}>{userEmail}</Text>
                    </View>
                    {/* Reset Password */}
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, backgroundColor: theme.notbackground,alignSelf:"center",borderRadius:10, paddingVertical: 10, paddingHorizontal: 20 }} onPress={handleResetPassword}>
                        <Image source={appIcons.resetPassword} style={{ width: 20, height: 20, marginRight: 10 }} />
                        <Text style={{ fontSize: 15, color: colors.black}}>Change Password</Text>
                    </TouchableOpacity>
                    {/* Change Name */}
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, alignSelf: "center", borderRadius: 10, backgroundColor: theme.notbackground, paddingVertical: 10, paddingHorizontal: 20 }} onPress={() => setIsModalVisible(true)}>
                        <Image source={appIcons.edit} style={{ width: 20, height: 20, marginRight: 10 }} />
                        <Text style={{ fontSize: 15, color: colors.black }}>Change Name</Text>
                    </TouchableOpacity>
                    
                    {/* Dark Mode */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, backgroundColor: theme.notbackground,alignSelf:"center",borderRadius:30, paddingVertical: 10, paddingHorizontal: 20 }}>
                        <Text style={{ fontSize: 15, color: colors.black, marginRight:15 }}>Dark Mode</Text>
                        <ToggleSwitch
                            isOn={theme.theme === 'dark'}
                            onColor={colors.green}
                            offColor={colors.lightBlack}
                            labelStyle={{ display: 'none' }}
                            size='small'
                            onToggle={(value) => {
                                EventRegister.emit("changeTheme", value)
                            }}
                        />
                    </View>
                    {/* Logout Button */}
                    <TouchableOpacity style={{ flexDirection: "row",alignItems:'center', backgroundColor: colors.greyLight, paddingHorizontal: 15, paddingVertical: 10, borderRadius: 5, marginTop: 20, alignSelf: 'center' }} onPress={() => LogOutUser()}>
                    <Image source={appIcons.log_out} style={{ width: 30, height: 30, marginRight: 10 }} />
                        <Text style={{ color: 'red', fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>{t('Logout')}</Text>
                    </TouchableOpacity>

                    {/* Modal for changing username */}
                    <Modal visible={isModalVisible} animationType="slide" transparent={true}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                            <View style={{ backgroundColor: colors.white, padding: 20, borderRadius: 10, width: '80%' }}>
                                <Text style={{ fontSize: 20, marginBottom: 10, color: colors.black }}>Change Your Username</Text>
                                <TextInput
                                    style={{ borderWidth: 1, borderColor: colors.lightBlack, padding: 10, marginBottom: 10, color:colors.black }}
                                    placeholder="Enter your new username"
                                    value={newUsername}
                                    onChangeText={setNewUsername}
                                />
                                <TouchableOpacity style={{ backgroundColor: 'green', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 5, marginTop: 10,marginBottom: 10, alignSelf: 'center' }} onPress={() => handleSaveChanges()}>
                                    <Text style={{ color: colors.white, fontSize: 18, fontWeight: 'bold', textAlign: 'center', }}>{t('Save Change')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ backgroundColor: colors.textRed, paddingHorizontal: 15, paddingVertical: 10, borderRadius: 5, marginTop: 10,marginBottom: 10, alignSelf: 'center' }} onPress={() => setIsModalVisible(false)}>
                                    <Text style={{ color: colors.white, fontSize: 18, fontWeight: 'bold', textAlign: 'center', }}>{t('Cancel')}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

                    <Modal visible={isAvatarModalVisible} animationType="slide" transparent={true}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <View style={{ backgroundColor: colors.themeSecondary, padding: 20, borderRadius: 10, width: '80%', maxHeight: '80%' }}>
                        <Text style={{ fontSize: 20, marginBottom: 10, fontWeight: 900,color: colors.black }}>Change Avatar</Text>
                        {/* Avatar list */}
                        <ScrollView>
                            {avatarImages.map((avatar, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}
                                    onPress={() => handleAvatarSelection(index)}
                                >
                                    <Image
                                        source={avatar.imagePath}
                                        style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10, borderWidth: selectedAvatarIndex === index ? 3 : 0, borderColor: '#A2FF86' }}
                                    />
                                    <Text style={{ color: colors.black }}>{avatar.avatarNumber === 0 ? 'Default' : `Avatar ${avatar.avatarNumber}`}</Text>

                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        {/* Save and Cancel buttons */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                            <TouchableOpacity style={{ backgroundColor: 'green', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 5 }} onPress={handleSaveAvatar}>
                                <Text style={{ color: colors.white, fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>Save Change</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ backgroundColor: colors.textRed, paddingHorizontal: 15, paddingVertical: 10, borderRadius: 5 }} onPress={() => setIsAvatarModalVisible(false)}>
                                <Text style={{ color: colors.white, fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
                </View>
            </View>
        </View>
    );
};

export default Profile;