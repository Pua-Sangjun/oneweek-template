import {memo} from 'react'
import {StatusBar as NativeStatusBar, View} from 'react-native'
import {useSafeAreaInsets} from 'react-native-safe-area-context'

export const StatusBar = memo(function StatusBar() {
    const {top} = useSafeAreaInsets()

    /**
     * 안드 > status bar 처리 없이 그냥 background 처리
     * 구 아이폰 > status bar safearea insets top 쓰면됨
     * 신 아이폰 > status bar top
     * 여기서 문제점은 enableSafeAreaInset=true일때 문제가 있음
     */
    return (
        <View style={{backgroundColor: 'red', height: NativeStatusBar.currentHeight ?? top}}>
            <NativeStatusBar translucent backgroundColor={'red'} />
        </View>
    )
})
