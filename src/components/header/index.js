import React, { useContext } from 'react'
import { StyleSheet, Image, Text, View, TouchableOpacity, I18nManager } from 'react-native'
import { useTranslation } from 'react-i18next';

import { appIcons, colors, fontFamily, hp, wp } from '../../services'
import themeContext from '../../services/config/themeContext'

const Header = props => {
    const { t } = useTranslation();
    const theme = useContext(themeContext)
    const { leftIcon, title, titleStyle, onPress, shadow, rightIcon1, rightIconStyle, fontSize, onpressSearch, bold, searchbackgroundColor, onPressrightIcon2, rightIcon2 } = props

    return (
        <View style={{ backgroundColor: 'red' }}>
            <View style={[styles.container, shadow && styles.shadow, { backgroundColor: theme.background }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                        <TouchableOpacity onPress={onPress}>
                            {leftIcon &&
                                <Image style={[styles.iconStyle, { transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }]} source={leftIcon} />
                            }
                        </TouchableOpacity>
                        <View style={[styles.textViewStyle, { marginLeft: leftIcon ? 20 : 0 }]}>
                            <Text style={[titleStyle, styles.textStyle, { color: theme.color, fontSize: fontSize ? fontSize : 18, fontFamily: bold ? fontFamily.appTextBold : fontFamily.appTextSemiBold }]}>
                                {t(title)}
                            </Text>
                        </View>
                    </View>
                    <View style={[rightIconStyle, { flexDirection: 'row' }]}>
                        {rightIcon1 &&
                            <TouchableOpacity onPress={onpressSearch} style={[styles.rightIconView, { marginRight: hp(2), backgroundColor: theme.backgroundTwo }]} >
                                <Image style={[styles.rightIcon, { tintColor: theme.color, transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }]} source={appIcons.search} />
                            </TouchableOpacity>
                        }
                        {rightIcon2 &&
                            <TouchableOpacity onPress={onPressrightIcon2} style={[styles.rightIconView, { backgroundColor: searchbackgroundColor ? searchbackgroundColor : theme.backgroundTwo }]} >
                                <Image style={[styles.rightIcon, { tintColor: theme.color, transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }]} source={rightIcon2} />
                            </TouchableOpacity>
                        }
                    </View>

                </View>
            </View>
        </View>

    )
}

const styles = StyleSheet.create({

    rightIconView: {
        width: 35,
        height: 35,
        borderRadius: 20,
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textViewStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 0
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    container: {
        backgroundColor: colors.white,
        padding: 10,
        height: 60,
        width: wp(100),
        justifyContent: 'flex-end',
        paddingHorizontal: wp(5),

    },
    textStyle: {
        fontSize: 20,
        color: colors.black,
        fontFamily: fontFamily.appTextSemiBold
    },
    iconStyle: {
        width: 18,
        height: 18,
        resizeMode: 'contain',
    },
    rightIcon: {
        width: 18,
        height: 18,
        resizeMode: 'contain',
    },

})
export default Header
