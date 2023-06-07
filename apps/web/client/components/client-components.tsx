'use client'

import {StyledComponentThemeProvider} from '@oneweek-react/theme'
import {styled} from 'styled-components'

const Test = styled.div`
    color: ${({theme: {colors}}) => colors.main};
`

export function Client() {
    return (
        <StyledComponentThemeProvider>
            <div>
                이건 client component 에용
                <button>state</button>
            </div>
            <Test>12312321</Test>
        </StyledComponentThemeProvider>
    )
}
