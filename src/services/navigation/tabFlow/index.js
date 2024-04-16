import React, { useEffect } from 'react'
import { StyleSheet, Image, View, TouchableOpacity, Platform, I18nManager } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useDispatch, useSelector } from 'react-redux'
import { userSave, setDevice,  setNewAlert } from '../../../redux/Slices/splashSlice';
import { DashboardStack } from '../appFlow/dashboardStack'
import { AlertStack } from '../appFlow/AlertStack'
import { ProfileStack } from '../appFlow/profileStack'
import { appIcons, colors } from '../../utilities'
import firestore from '@react-native-firebase/firestore';
import { hp } from '../../constants'
import auth from '@react-native-firebase/auth';

const Tab = createBottomTabNavigator()

const tabArray = [
    { route: 'Dashboard', icon: appIcons.dashboardTab, component: DashboardStack, color: colors.theme },
    { route: 'Alert', icon: appIcons.bellTab, component: AlertStack, color: colors.theme },
    { route: 'Profile', icon: appIcons.profileTab, component: ProfileStack, color: colors.theme },
]

const TabButton = (props) => {
    const { item, onPress, accessibilityState } = props
    const focused = accessibilityState.selected
    const newAlert = useSelector(state => state.splash.newAlert) 
    

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={1}
            style={[styles.container]}>
            <View style={[styles.btn]}>
                <View style={{ alignItems: 'center' }}>
                    {item.route === 'Alert' && newAlert &&
                        <View style={styles.dotStyle} />
                        
                    }
                    <Image source={item.icon} style={[styles.tabIcon, { tintColor: focused ? colors.theme : colors.grey, transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }]} />
                </View>
            </View>
        </TouchableOpacity>
    )
}

export function TabNavigator() {
    const dispatch = useDispatch();

    useEffect(() => {
        const userId = auth().currentUser.uid;
        const userRef = firestore().collection('User').doc(userId);
    
        const unsubscribe = userRef.onSnapshot((snapshot) => {
            const userData = snapshot.data();
            if (userData && Array.isArray(userData.Alerts)) {
                // Compare previous and current length of the Alerts array
                const previousLength = (snapshot.metadata.hasPendingWrites) ? userData.Alerts.length : 0;
                const currentLength = userData.Alerts.length;
    
                // Check if there's any change in the length of the Alerts array
                if (currentLength !== previousLength) {
                    dispatch(setNewAlert(true)); // Dispatch action to set newAlert to true
                } else {
                    dispatch(setNewAlert(false)); // Dispatch action to set newAlert to false
                }
            }
        });
    
        return () => unsubscribe(); // Unsubscribe when component unmounts
    }, []);
    
    

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: styles.barStyle
            }}>
            {tabArray.map((item, index) => {
                return (
                    <Tab.Screen key={index} name={item.route} component={item.component}
                        options={{
                            tabBarShowLabel: false,
                            tabBarButton: (props) => <TabButton {...props} item={item} />
                        }}
                    />
                )
            })}
        </Tab.Navigator>
    )
}

const styles = StyleSheet.create({
    barStyle: {
        backgroundColor: colors.white,
        height: hp(10),
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
        paddingTop: Platform.OS == 'ios' ? 10 : 5
    },
    tabIcon: {
        width: 25,
        height: 25,
        resizeMode: 'contain'
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

    },
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
    },
    dotStyle: {
        width: 5,
        position: 'absolute',
        height: 5,
        borderRadius: 5,
        top: -18,
        backgroundColor: 'red'
    }
})
