import React, { useContext } from 'react'
import { View, Text, StatusBar,Image } from 'react-native'
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { routes } from '../../../services'
import { Header } from '../../../components';
import { styles } from './styles';
import { userSave } from '../../../redux/Slices/splashSlice';
import themeContext from '../../../services/config/themeContext';
import Button from '../../../components/button';

const WelcomeScreen = ({ navigation }) => {
  const theme = useContext(themeContext)
  const dispatch = useDispatch()
  const { t } = useTranslation();

  

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar backgroundColor={theme.background} barStyle={theme.theme === 'dark' ? 'light-content' : 'dark-content'} />
      <Header title={'Welcome'} />
      <View style={[styles.wrapper, { backgroundColor: theme.background }]}>
        {/* First Image */}
        <Image source={require('../../../assets/Images/welcome_1.png')} style={[styles.image1, styles.topMid]} />

        
        
        {/* Second Image */}
        <Image source={require('../../../assets/Images/welcome_2.png')} style={[styles.image2, styles.littleRightAndBelow]} />

        {/* Third Image */}
        <Image source={require('../../../assets/Images/welcome_3.png')} style={[styles.image3, styles.belowMid]} />
        <View style={styles.TextContainer}>
        <Text style={{ color: theme.color, fontSize: 25, fontWeight:"bold"}}>Welcome to IntelliCareDex</Text>
        <Text style={{ color: theme.color }}>Where security meets Intelligence.</Text>
        </View>
        <View style={styles.buttonsContainer}>
          <Button style={[styles.button, { backgroundColor: '#000' }]} onPress={() => navigation.navigate(routes.login)}>
            {t('Login')}
          </Button>
          <Button style={[styles.button, { backgroundColor: '#fff' }]} onPress={() => navigation.navigate(routes.signup)}>
            {t('Register')}
          </Button>
        </View>
      </View>
    </View>
  )
}

export default WelcomeScreen