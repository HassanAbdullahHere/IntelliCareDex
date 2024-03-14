import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { I18nManager } from "react-native";

const resources = {
    en: {
        translation: {
            "Splash screen": "Splash screen",
            "Login": "Login",
            "Login Screen": "Login Screen",
            "Signup": "Signup",
            "Signup Screen": "Signup Screen",
            "Dashboard": "Dashboard",
            "Favorite": "Favorite",
            "Profile": 'Profile',
            "Profile Screen": 'Profile Screen',
            "Dashboard Screen": 'Dashboard Screen',
            "Favorite Screen": 'Favorite Screen',
            "Dark Mode": 'Dark Mode',
            "Logout": "Logout",
            "Urdu": "Urdu"
        }
    },
    ur: {
        translation: {
            "Splash screen": "سپلیش اسکرین",
            "Login": "لاگ ان",
            "Login Screen": "لاگ ان اسکرین",
            "Signup": "سائن اپ",
            "Signup Screen": "سائن اپ اسکرین",
            "Dashboard": "ڈیش بورڈ",
            "Favorite": "پسندیدہ",
            "Profile": 'پروفائل',
            "Profile Screen": 'پروفائل اسکرین',
            "Dashboard Screen": 'ڈیش بورڈ اسکرین',
            "Favorite Screen": 'پسندیدہ اسکرین',
            "Dark Mode": 'ڈارک موڈ',
            "Logout": "لاگ آوٹ",
            "Urdu": "اردو"
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        compatibilityJSON: 'v3',
        lng: I18nManager.isRTL ? "ur" : "en",
        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });

export default i18n;