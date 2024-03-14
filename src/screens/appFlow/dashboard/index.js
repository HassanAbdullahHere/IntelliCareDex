import React, { useContext } from 'react'
import { View, Text, StatusBar } from 'react-native'
import { DrawerActions } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { appIcons } from '../../../services'
import { Header } from '../../../components';
import { styles } from './styles';
import themeContext from '../../../services/config/themeContext';

const Dashboard = ({ navigation }) => {
  const theme = useContext(themeContext)
  const { t } = useTranslation();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]} >
      <StatusBar backgroundColor={theme.background} barStyle={theme.theme === 'dark' ? 'light-content' : 'dark-content'} />
      <Header leftIcon={appIcons.drawer} onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())} title={'Dashboard'} />
      <View style={[styles.wrapper, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.color, fontSize: 20 }}>{t('Dashboard reen')}</Text>
      </View>
    </View>
  )
}

export default Dashboard