import React, { useContext } from 'react';
import ToggleSwitch from 'toggle-switch-react-native';
import { Text, TouchableOpacity, Image, View, I18nManager } from 'react-native';
import { DrawerActions } from '@react-navigation/native'
import { EventRegister } from 'react-native-event-listeners';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import RNRestart from 'react-native-restart'
import auth from '@react-native-firebase/auth'
import ShowMessage from '../../../components/toasts/index';

import { appIcons, colors, hp, routes, wp } from '../../../services';
import { userSave } from '../../../redux/Slices/splashSlice';
import themeContext from '../../../services/config/themeContext';




const DrawerScreen = ({ navigation }) => {
    const theme = useContext(themeContext)
    const dispatch = useDispatch()
    const { t, i18n } = useTranslation();

    const handleLogout = async () => {
        dispatch(userSave(null))
        navigation.replace(routes.auth)
    }
    const LogOutUser = () => {
        auth()
        .signOut()
        handleLogout()
        .then(() => ShowMessage('User signed out!'));
    }

    const changeLang = () => {
        i18n.changeLanguage(i18n.language === 'en' ? 'ur' : 'en').then(() => {
            RNRestart.Restart()
            I18nManager.forceRTL(i18n.language === 'ur')
        })
    }

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <View style={{ flex: 1, backgroundColor: theme.background, padding: wp(5) }}>
                <TouchableOpacity  onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
                    <Image source={appIcons.cross} style={{ height: 19, width: 19, tintColor: theme.theme === 'dark' ? colors.white : colors.black }} resizeMode={"contain"} />
                </TouchableOpacity>
                <View style={{ paddingTop: hp(10), flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ color: theme.color, fontSize: 16 }}>{t('Dark Mode')}</Text>
                    <ToggleSwitch
                        isOn={theme.theme === 'dark'}
                        onColor={colors.green}
                        offColor={colors.lightBlack}
                        labelStyle={{ display: 'none' }}
                        size='small'
                        onToggle={(value) => {
                            EventRegister.emit("changeTheme", value)
                        }
                        }
                    />
                </View>
                
                <TouchableOpacity onPress={() => LogOutUser()} style={{ paddingTop: hp(5) }}>
                    <Text style={{ color: theme.color, fontSize: 16 }}>{t('Logout')}</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}


export default DrawerScreen;


