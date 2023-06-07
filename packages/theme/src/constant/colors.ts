import type {DefaultTheme} from 'styled-components'

export const COMMON_COLORS = {
    main: '#5E76E2',
    black: '#000',
    primary: '#222', // 주로 글씨
    primarySub: '#444', // 글씨인데, 메뉴같은거
    secondary: '#666', // 글씨, 주의 사항 등등
    tertiary: '#888', // x 버튼 같은데
    quaternary: '#999', // 딤드 버튼 텍스트
    placeholder: '#B8BABC', // 텍스트 딤드 or 툴팁 레이어
    input: '#CED0D2', // input 창 border
    button: '#DCDEE0', // 클릭 안된 버튼 border
    line: '#ECEEF0', // 영역 구분선
    whiteGray: '#F3F4F6',
    white: '#F8F9FB',
    forceWhite: '#F8F9FB',
    forceBlack: '#000',
} as const

export const COMMON_DARK_COLORS = {
    main: '#5E76E2',
    black: '#FEFFFE',
    primary: '#EEE', // 주로 글씨
    primarySub: '#C5C5C5', // 글씨인데, 메뉴같은거
    secondary: '#999', // 글씨, 주의 사항 등등
    tertiary: '#757575', // x 버튼 같은데
    quaternary: '#656565', // 딤드 버튼 텍스트
    placeholder: '#575758', // 텍스트 딤드 or 툴팁 레이어
    input: '#4A4B4B', // input 창 border
    button: '#3E3E3F', // 클릭 안된 버튼 border
    line: '#323232', // 영역 구분선
    whiteGray: '#252526',
    white: '#191919',
    forceWhite: '#F8F9FB',
    forceBlack: '#000',
} as const

export const FONT_SIZES = {
    ultraSmall: '10px',
    extraSmall: '12px',
    small: '13px',
    normal: '14px',
    semiMedium: '15px',
    medium: '16px',
    semiLarge: '17px',
    large: '18px',
    extraLarge: '20px',
    ultraLarge: '22px',
    superUltraLarge: '24px',
} as const

export const FONT_WEIGHTS = {
    thin: 100,
    extraLight: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semiBold: 600,
    bold: 700,
    extraBold: 800,
    ultraBold: 900,
} as const

export type Color = keyof typeof COMMON_COLORS

export type FontSize = keyof typeof FONT_SIZES

export type FontWeight = keyof typeof FONT_WEIGHTS

export const getTheme = (isDarkTheme: boolean): DefaultTheme => {
    return {
        colors: isDarkTheme ? COMMON_DARK_COLORS : COMMON_COLORS,
        font: {
            size: FONT_SIZES,
            weight: FONT_WEIGHTS,
        },
    }
}
