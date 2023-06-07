import {memo, ReactNode} from 'react'
import {GestureHandlerRootView} from 'react-native-gesture-handler'
import {SafeAreaProvider} from 'react-native-safe-area-context'
import {NavigationContainer} from '@react-navigation/native'
import {PortalProvider} from '@gorhom/portal'
import {styled} from 'styled-components/native'

import {StackRouter} from '$screens/index'
import {ErrorBoundary} from '$commons/components/ErrorBoundary'
import {ToastProvider} from '$contexts/toast'
import {AlertProvider} from '$contexts/alert'
import {StyledComponentsThemeProvider} from '$contexts/theme'

const GestureHandlerView = styled(GestureHandlerRootView)`
    flex: 1;
    background-color: ${({theme: {colors}}) => colors.white};
`

function CommonProviders({children}: {children: ReactNode}) {
    return (
        <StyledComponentsThemeProvider>
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
        </StyledComponentsThemeProvider>
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
