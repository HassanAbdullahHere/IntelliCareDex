import React from 'react'
import { StyleSheet, Image, View, TouchableOpacity, Platform, I18nManager } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import { DashboardStack } from '../appFlow/dashboardStack'
import { AlertStack } from '../appFlow/AlertStack'
import { ProfileStack } from '../appFlow/profileStack'
import { appIcons, colors } from '../../utilities'
import { hp } from '../../constants'

const Tab = createBottomTabNavigator()

const tabArray = [
    { route: 'Dashboard', icon: appIcons.dashboardTab, component: DashboardStack, color: colors.theme },
    { route: 'Alert', icon: appIcons.bellTab, component: AlertStack, color: colors.theme },
    { route: 'Profile', icon: appIcons.profileTab, component: ProfileStack, color: colors.theme },
]

const TabButton = (props) => {
    const { item, onPress, accessibilityState } = props
    const focused = accessibilityState.selected
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={1}
            style={[styles.container]}>
            <View style={[styles.btn]}>
                <View style={{ alignItems: 'center' }}>
                    {focused &&
                        <View style={styles.dotStyle} />
                    }
                    <Image source={item.icon} style={[styles.tabIcon, { tintColor: focused ? colors.theme : colors.grey, transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }]} />
                </View>
            </View>
        </TouchableOpacity>
    )
}

export function TabNavigator() {
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
        backgroundColor: colors.theme
    }
})

