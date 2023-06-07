import {Dimensions, Platform} from 'react-native'
import {getVersion, getUniqueId} from 'react-native-device-info'
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context'
import {useHeaderHeight} from '@react-navigation/elements'

export type GetDeviceInfo = {
    id: string
    appVersion: string
    platform: 'ios' | 'aos'
}

export async function getDeviceInfo(): Promise<GetDeviceInfo> {
    const id = await getUniqueId()
    const appVersion = getVersion()
    const platform = Platform.OS === 'ios' ? 'ios' : 'aos'
    return {id, appVersion, platform}
}

export type DeviceStyle = {
    device: {width: number; height: number}
    safeAreaInsets: EdgeInsets
    headerHeight: number
}

const deviceDimensions = Dimensions.get('window')

export function useDeviceStyle(): DeviceStyle {
    const safeAreaInsets = useSafeAreaInsets()
    const headerHeight = useHeaderHeight()
    return {
        device: deviceDimensions,
        safeAreaInsets,
        headerHeight: headerHeight - safeAreaInsets.top,
    }
}
