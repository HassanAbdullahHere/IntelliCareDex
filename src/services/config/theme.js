import { colors } from "../utilities";

const theme = {
    light: {
        theme: 'light',
        color: colors.black,
        background: colors.white,
        notbackground: colors.theme

    },
    dark: {
        theme: 'dark',
        color: colors.white,
        background: colors.black,
        notbackground: colors.themeSecondary
    },
}

export default theme