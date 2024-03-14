import React from 'react';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack'

import { routes } from '../../constants';
import * as Auth from '../../../screens/authFlow';

const AuthStack = createStackNavigator()

export const AuthNavigation = () => {
    return (
        <AuthStack.Navigator initialRouteName={routes.splash} screenOptions={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter }}>
            <AuthStack.Screen name={routes.splash} component={Auth.Splash} />
            <AuthStack.Screen name={routes.welcome} component={Auth.Welcome} />
            <AuthStack.Screen name={routes.login} component={Auth.Signin} />
            <AuthStack.Screen name={routes.signup} component={Auth.Signup} />
        </AuthStack.Navigator>
    )
}
