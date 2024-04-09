import { Dimensions, PixelRatio } from 'react-native';
const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('screen').width;
const SCREEN_HEIGHT = Dimensions.get('screen').height;

export const storageKey = {}

export const routes = {
    auth: 'auth',
    tab: 'tabNavigator',
    drawer: 'drawer',
    app: 'app',
    splash: 'splash',
    selectAccount: 'selectAccount',
    login: 'login',
    signup: 'signup',
    dashboard: 'dashboard',
    alert: 'alert',
    profile: 'profile',
    welcome: 'welcome',
    deviceConfig: 'deviceConfig',
    addCamera: 'addCamera',
    alertDetails: 'alertDetails',
    cameraDetails: 'cameraDetails'

}

export const loaderStyles = {
    CircleFlip: 'CircleFlip',
    Bounce: 'Bounce',
    Wave: 'Wave',
    WanderingCubes: 'WanderingCubes',
    Pulse: 'Pulse',
    ChasingDots: 'ChasingDots',
    ThreeBounce: 'ThreeBounce',
    Circle: 'Circle',
    CubeGrid: '9CubeGrid',
    WordPress: 'WordPress',
    FadingCircle: 'FadingCircle',
    FadingCircleAlt: 'FadingCircleAlt',
    Arc: 'Arc',
}


export const wp = (p) => WINDOW_WIDTH * (p / 100);
export const hp = (p) => WINDOW_HEIGHT * (p / 100);
export { WINDOW_HEIGHT, WINDOW_WIDTH, SCREEN_HEIGHT, SCREEN_WIDTH };

const widthBaseScale = SCREEN_WIDTH / 375;
const heightBaseScale = SCREEN_HEIGHT / 812;

function normalize(size, based = 'width') {
    const newSize =
        based === 'height' ? size * heightBaseScale : size * widthBaseScale;
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
}
const widthPixel = size => {
    return normalize(size, 'width');
};
const heightPixel = size => {
    return normalize(size, 'height');
};
const fontPixel = size => {
    return heightPixel(size);
};

export {
    widthPixel,
    heightPixel,
    fontPixel,

};



