import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";

import { routes } from "../../constants";
import { TabNavigator } from "../tabFlow";
import { DrawerScreen } from "../../../screens/appFlow";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
    return (
        <Drawer.Navigator
            drawerContent={(props) => <DrawerScreen {...props} />}
            screenOptions={{ gestureEnabled: true, headerShown: false, }}>
            <Drawer.Screen name={routes.tab} component={TabNavigator} />
        </Drawer.Navigator>
    );
}

export default DrawerNavigator;