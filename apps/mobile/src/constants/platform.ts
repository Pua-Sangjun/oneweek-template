import {Platform} from 'react-native'

export const isIOS: Readonly<boolean> = Platform.OS === 'ios'
export const isAndroid: Readonly<boolean> = Platform.OS === 'android'
