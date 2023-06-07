import 'styled-components'

declare module 'styled-components' {
    export interface DefaultTheme {
        colors: {
            main: string
            black: string
            primary: string
            primarySub: string
            secondary: string
            tertiary: string
            quaternary: string
            placeholder: string
            input: string
            button: string
            line: string
            whiteGray: string
            white: string
            forceWhite: string
            forceBlack: string
        }
        font: {
            size: {
                ultraSmall: string
                extraSmall: string
                small: string
                normal: string
                semiMedium: string
                medium: string
                semiLarge: string
                large: string
                extraLarge: string
                ultraLarge: string
                superUltraLarge: string
            }
            weight: {
                thin: number
                extraLight: number
                light: number
                normal: number
                medium: number
                semiBold: number
                bold: number
                extraBold: number
                ultraBold: number
            }
        }
    }
}
