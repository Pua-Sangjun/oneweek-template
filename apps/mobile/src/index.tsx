import {memo, ReactNode} from 'react'
import styled from '@emotion/native'
import {GestureHandlerRootView} from 'react-native-gesture-handler'
import {SafeAreaProvider} from 'react-native-safe-area-context'
import {NavigationContainer} from '@react-navigation/native'
import {PortalProvider} from '@gorhom/portal'

import {StackRouter} from '$screens/index'
import {ErrorBoundary} from '$commons/components/ErrorBoundary'
import {ToastProvider} from '$contexts/toast'
import {AlertProvider} from '$contexts/alert'
import {EmotionThemeProvider} from '$contexts/theme'

const GestureHandlerView = styled(GestureHandlerRootView)`
    flex: 1;
    background-color: ${({theme: {colors}}) => colors.white};
`

function CommonProviders({children}: {children: ReactNode}) {
    return (
        <EmotionThemeProvider>
            <GestureHandlerView>
                <SafeAreaProvider>
                    <NavigationContainer>
                        <PortalProvider>
                            <ErrorBoundary>
                                <AlertProvider>
                                    <ToastProvider>{children}</ToastProvider>
                                </AlertProvider>
                            </ErrorBoundary>
                        </PortalProvider>
                    </NavigationContainer>
                </SafeAreaProvider>
            </GestureHandlerView>
        </EmotionThemeProvider>
    )
}

const App = memo(function App() {
    return (
        <CommonProviders>
            <StackRouter />
        </CommonProviders>
    )
})

export default App
