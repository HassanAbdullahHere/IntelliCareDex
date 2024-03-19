import React, { useContext, useState } from 'react';
import { View, Text, FlatList, StatusBar, Image, TouchableOpacity } from 'react-native';
import { DrawerActions } from '@react-navigation/native';
import { Header } from '../../../components';
import { styles } from './styles';
import themeContext from '../../../services/config/themeContext';
import { appIcons } from '../../../services';
import { colors } from '../../../services/utilities/colors/index';
import { Picker } from '@react-native-picker/picker';

const notifications = [
    { date: '2024-02-15', day: 'Tuesday', time: '15:45', cameraName: 'Camera 2', detectionType: 'Anomaly detected' },
    { date: '2024-03-15', day: 'Wednesday', time: '14:30', cameraName: 'Camera 1', detectionType: 'Fall detected' },
    { date: '2024-03-15', day: 'Wednesday', time: '15:45', cameraName: 'Camera 2', detectionType: 'Anomaly detected' },
    { date: '2024-05-15', day: 'Friday', time: '15:45', cameraName: 'Camera 2', detectionType: 'Anomaly detected' },
    { date: '2024-05-15', day: 'Friday', time: '18:45', cameraName: 'Camera 2', detectionType: 'Fall detected' },
    { date: '2024-05-16', day: 'Sunday', time: '15:45', cameraName: 'Camera 3', detectionType: 'Anomaly detected' },
    { date: '2024-05-15', day: 'Friday', time: '15:45', cameraName: 'Camera 2', detectionType: 'Anomaly detected' },
    { date: '2024-05-15', day: 'Friday', time: '15:45', cameraName: 'Camera 2', detectionType: 'Anomaly detected' },
];

const NotificationScreen = ({ navigation }) => {
    const theme = useContext(themeContext);
    const [filter, setFilter] = useState('All');

    const groupedNotifications = notifications.reduce((acc, notification) => {
        const { date, day, ...rest } = notification;
        if (!acc[date]) {
            acc[date] = { date, day, notifications: [rest] };
        } else {
            acc[date].notifications.push(rest);
        }
        return acc;
    }, {});

    const renderNotificationCard = ({ item }) => (
        <TouchableOpacity style={{ marginVertical: 11, paddingHorizontal: 20, paddingVertical: 15, backgroundColor: theme.background, borderRadius: 10, shadowColor: theme.color, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5, borderColor: theme.color, borderWidth: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {/* Icon */}
                <Image source={appIcons.alert} style={{ width: 30, height: 30, marginRight: 15 }} />

                {/* Detection Type and Camera */}
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.color }}>{item.detectionType}</Text>
                    <Text style={{ fontSize: 12, color: theme.color }}>{`${item.cameraName}`}</Text>
                </View>

                {/* Time */}
                <Text style={{ fontSize: 11, color: theme.color}}>{` ${item.time}`}</Text>
            </View>
        </TouchableOpacity>
    );

    const renderNotificationsForDay = ({ item }) => {
        const filteredNotifications = item.notifications.filter(notification => filter === 'All' || notification.detectionType === filter);
        if (filteredNotifications.length === 0) return null;
    
        return (
            <View style={{ marginBottom: 15 }}>
                <Text style={{ fontSize: 12, fontWeight: 'bold', paddingHorizontal: 7, color: theme.color }}>{`${item.day}, ${item.date}`}</Text>
                {filteredNotifications.length > 0 ? (
                    <FlatList
                        data={filteredNotifications}
                        renderItem={renderNotificationCard}
                        keyExtractor={(notification, index) => index.toString()}
                        nestedScrollEnabled={false}
                    />
                ) : null}
            </View>
        );
    };

    if (notifications.length === 0) {
        return (
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <StatusBar backgroundColor={theme.background} barStyle={theme.theme === 'dark' ? 'light-content' : 'dark-content'} />
                <Header leftIcon={appIcons.drawer} onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())} title={'Notifications'} />
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={appIcons.empty} style={{ width: 80, height: 80 }} />
                    <Text style={{ fontSize: 16, paddingHorizontal: 20, color: theme.color, marginTop: 10 }}>No Notifications</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <StatusBar backgroundColor={theme.background} barStyle={theme.theme === 'dark' ? 'light-content' : 'dark-content'} />
            <Header leftIcon={appIcons.drawer} onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())} title={'Notifications'} />
            <View style={{ flex: 1, paddingHorizontal: 12, paddingTop: 20 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 30, borderColor: theme.color, borderWidth: 1, borderRadius: 10, width:"45%" }}>

                <Picker
                    selectedValue={filter}
                    style={{ height: 50, width: 140, color: theme.color }}
                    itemStyle={{ fontSize: 8 }}
                    onValueChange={(itemValue, itemIndex) =>
                        setFilter(itemValue)
                    }>
                    <Picker.Item label="All" value="All" />
                    <Picker.Item label="Anomaly" value="Anomaly detected" />
                    <Picker.Item label="Fall" value="Fall detected" />
                </Picker>

                </View>
                <FlatList
                    data={Object.values(groupedNotifications)}
                    renderItem={renderNotificationsForDay}
                    keyExtractor={(item) => item.date}
                />
            </View>
        </View>
    );
};

export default NotificationScreen;
