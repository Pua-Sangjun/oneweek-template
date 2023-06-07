import React, {useEffect, useState} from 'react'
import {Button, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, useColorScheme, View} from 'react-native'
import {
    Colors,
    DebugInstructions,
    Header,
    LearnMoreLinks,
    ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen'
import {ResponseParsingType, createFetchInstance} from '@oneweek/fetch'
import {useBoolean} from '@oneweek-react/hook'
import {EmotionThemeProvider} from '@oneweek-react/theme'
import {css} from '@emotion/native'

const styles = StyleSheet.create({
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
    },
    highlight: {
        fontWeight: '700',
    },
})

const Section = ({children, title}: any) => {
    const isDarkMode = useColorScheme() === 'dark'
    return (
        <View style={styles.sectionContainer}>
            <Text
                style={[
                    styles.sectionTitle,
                    {
                        color: isDarkMode ? Colors.white : Colors.black,
                    },
                ]}>
                {title}
            </Text>
            <Text
                style={[
                    styles.sectionDescription,
                    {
                        color: isDarkMode ? Colors.light : Colors.dark,
                    },
                ]}>
                {children}
            </Text>
        </View>
    )
}

const sampleApi = createFetchInstance('http://localhost:4000/api/rest')

const App = () => {
    const isDarkMode = useColorScheme() === 'dark'
    const [state, setTrue, setFalse] = useBoolean()
    const [res, setRes] = useState<any>()

    const backgroundStyle = {
        backgroundColor: isDarkMode || state ? Colors.darker : Colors.lighter,
    }

    useEffect(() => {
        async function test() {
            setRes('')
            try {
                const {result} = await sampleApi<string>('/temp', {
                    responseType: ResponseParsingType.TEXT,
                })
                setRes(result)
            } catch (error) {
                console.log(error)
                setRes(error)
            }
        }
        test()
    }, [state])

    return (
        <EmotionThemeProvider isDarkMode>
            <SafeAreaView style={backgroundStyle}>
                <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
                <Button title={state ? 'true' : 'false'} onPress={state ? setFalse : setTrue} />
                <ScrollView contentInsetAdjustmentBehavior="automatic" style={backgroundStyle}>
                    <Header />
                    <View
                        style={{
                            backgroundColor: isDarkMode ? Colors.black : Colors.white,
                        }}>
                        <Section title="Step One">
                            <Text>{JSON.stringify(res)}</Text>
                            Edit{' '}
                            <Text
                                style={css`
                                    color: red;
                                `}>
                                App.js
                            </Text>{' '}
                            to change this screen and then come back to see your edits.
                        </Section>
                        <Section title="See Your Changes">
                            <ReloadInstructions />
                        </Section>
                        <Section title="Debug">
                            <DebugInstructions />
                        </Section>
                        <Section title="Learn More">Read the docs to discover what to do next:</Section>
                        <LearnMoreLinks />
                    </View>
                </ScrollView>
            </SafeAreaView>
        </EmotionThemeProvider>
    )
}

export default App
