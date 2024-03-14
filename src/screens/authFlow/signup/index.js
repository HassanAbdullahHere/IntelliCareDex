import React, { useContext, useState } from 'react';
import { View, Text, StatusBar, TextInput, TouchableOpacity, Image, StyleSheet, ImageBackground } from 'react-native';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { colors } from '../../../services';
import { appIcons } from '../../../services'
import auth from '@react-native-firebase/auth';

import { routes } from '../../../services';
import { Header } from '../../../components';
import { userSave, saveUserID } from '../../../redux/Slices/splashSlice';
import themeContext from '../../../services/config/themeContext';
import { styles } from './styles';
import ShowMessage from '../../../components/toasts/index';
import firestore from '@react-native-firebase/firestore';

const SignupScreen = ({ navigation }) => {
  const theme = useContext(themeContext);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [showPassword, setShowPassword] = useState(false); 
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail]= useState('');

  const createUser = () => {
    if (!name || !email || !password) {
        ShowMessage("Please Enter Details First");
        return;
    }

    auth()
        .createUserWithEmailAndPassword(email, password)
        .then(async (userCredential) => {
            // User signed up successfully
            ShowMessage('User account created.');
            const { user } = userCredential;

            await auth().currentUser.sendEmailVerification();
            navigation.navigate(routes.login)
            dispatch(saveUserID(user.uid));
            ShowMessage("Verify your Email, Check your Email Inbox")
            // Call function to create user in Firestore with user UID, name, and email
            createUserInFirestore(user.uid);
            //onPressSignup();
        })
        .catch(error => {
            // Handle errors
            if (error.code === 'auth/email-already-in-use') {
                ShowMessage('That email address is already in use!');
            } else if (error.code === 'auth/invalid-email') {
                ShowMessage('That email address is invalid!');
            } else {
                ShowMessage(String(error.message));
            }
        });
};

const createUserInFirestore = async (userId) => {
    console.log("Creating user in Firestore...");
    try {
        await firestore().collection('User').doc(userId).set({
            name: name,
            email: email,
        });
        console.log('User added to Firestore successfully!');
    } catch (error) {
        console.error('Error adding user to Firestore:', error);
    }
};
  

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onPressSignup = () => {
    dispatch(userSave(true)); 
    navigation.replace(routes.drawer);
    
  };

  return (
    <ImageBackground source={require('../../../assets/Images/bg.png')} resizeMode="cover" style={styles.backgroundImage}>
      <StatusBar translucent backgroundColor="transparent" barStyle={theme.theme === 'dark' ? 'light-content' : 'dark-content'} />
      <View style={styles.container}>
        <Header title={'Signup'} />
        <View style={[styles.wrapper]}>
          <View style={styles.card}>
            <Image source={require('../../../assets/Images/logo.png')} style={styles.logo} />
            <Text style={{ color: colors.lightBlack, fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>{t('Get Started!')}</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.black, color: colors.black }]}
              placeholder={t('Username')}
              placeholderTextColor={colors.lightBlack}
              value={name}
              onChangeText={text=>{setName(text)}}
              
            />
            <TextInput
              style={[styles.input, { borderColor: colors.black, color: colors.black }]}
              placeholder={t('Email-Address')}
              placeholderTextColor={colors.lightBlack}
              keyboardType={"email-address"}
              value={email}
              onChangeText={text=>{setEmail(text)}}
            />
            <View style={styles.passwordInput}>
              <TextInput
                style={[styles.input, { borderColor: colors.black, color: colors.black, flex: 1 }]}
                placeholder={t('Password')}
                placeholderTextColor={colors.lightBlack}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={text=>{setPassword(text)}}
                keyboardType={"default"}

              />
              <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
                <Image source={showPassword ? appIcons.view : appIcons.hide} style={styles.eyeIconImage} />

              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => createUser()} style={[styles.button, { backgroundColor: colors.theme }]}>
              <Text style={styles.buttonText}>{t('Signup')}</Text>
            </TouchableOpacity>
            <View style={styles.BottomText}>
              <Text style={[styles.text, { color: colors.lightBlack}]}>{t('Already have an account?')}</Text>
              <TouchableOpacity onPress={() => navigation.navigate(routes.login)}>
                <Text style={[styles.text, { color: colors.theme}]}>{t('Login')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

export default SignupScreen;
