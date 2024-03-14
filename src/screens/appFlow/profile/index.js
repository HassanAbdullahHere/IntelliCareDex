import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Button, StatusBar, Alert } from 'react-native';
import { DrawerActions } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { styles } from './styles';
import { appIcons, colors, hp, routes, wp } from '../../../services';
import { userSave } from '../../../redux/Slices/splashSlice';
import { useDispatch } from 'react-redux';

import { Header } from '../../../components';
import themeContext from '../../../services/config/themeContext';
import { useSelector } from 'react-redux'; // Import useSelector to access Redux store state
import ShowMessage from '../../../components/toasts/index';

const Profile = ({ navigation }) => {
    const theme = useContext(themeContext);
    const { t } = useTranslation();
    const dispatch = useDispatch()
    const userId = useSelector(state => state.splash.userID); // Get user ID from Redux store

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        if (userId) {
            // Fetch user data from Firestore
            const unsubscribe = firestore().collection('User').doc(userId)
                .onSnapshot((snapshot) => {
                    const userData = snapshot.data();
                    setName(userData.name || ''); 
                    setEmail(userData.email || '');
                    setUserEmail(userData.email || '');
                });

            return () => unsubscribe();
        }
    }, [userId]);

    const handleChangeName = () => {
        // Update name in Firestore
        firestore().collection('User').doc(userId).update({ name })
            .then(() => {
                ShowMessage('Name updated successfully!');
            })
            .catch(error => {
                Alert.alert('Error updating name:', error.message);
            });
    };

    const handleLogout = () => {
        dispatch(userSave(null))
        navigation.replace(routes.auth)
    }

    const LogOutUser = () => {
        auth()
        .signOut()
        handleLogout()
        .then(() => ShowMessage('User signed out!'));
    }

    const handleResetPassword = () => {
        const user = auth().currentUser;
        if (user) {
            auth().sendPasswordResetEmail(user.email)
                .then(() => {
                    ShowMessage('Password reset email sent to your email address.');
                    LogOutUser()
                })
                .catch(error => {
                    //ShowMessage(error.message);
                });
        } else {
            console.error('User not signed in.');
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <StatusBar backgroundColor={theme.background} barStyle={theme.theme === 'dark' ? 'light-content' : 'dark-content'} />
            <Header leftIcon={appIcons.drawer} onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())} title={'Profile'} />
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: theme.color, fontSize: 20 }}>{t('Profile')}</Text>
                <Text style={{ color: theme.color, fontSize: 16, marginTop: 20 }}>Email: {userEmail}</Text>
                <TextInput
                    style={{ width: '80%', padding: 10, marginVertical: 10, borderColor: theme.color, borderWidth: 1, borderRadius: 5, color: theme.color }}
                    value={name}
                    onChangeText={setName}
                    placeholder="Name"
                    placeholderTextColor={theme.placeholderColor}
                />
                <Button title="Change Name" onPress={handleChangeName} />
                <Button title="Reset Password" onPress={handleResetPassword} />
            </View>
        </View>
    );
};

export default Profile;
