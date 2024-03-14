import React, { Component } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { routes } from '../../constants'
import * as App from '../../../screens/appFlow';

const MyStack = createStackNavigator()
export class AlertStack extends Component {
    render() {
        return (
            <MyStack.Navigator initialRouteName={routes.alert} screenOptions={{ headerShown: false }}>
                <MyStack.Screen name={routes.alert} component={App.Alert} />
            </MyStack.Navigator>
        )
    }
}
