import {Sample} from '../sample/components/sample'

import type {GetInitialProps} from '$types/getInitialProps'

type InitialProps = {
    text: number
}

function RootPage({text}: InitialProps) {
    return (
        <div>
            root index page text {text}
            <Sample />
        </div>
    )
}

export function loading() {
    return <div>Root 로로로오오오오오오ㅗ오옹딩중</div>
}

export const getInitialProps: GetInitialProps<InitialProps> = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                props: {text: 1},
            })
        }, 5000)
    })
}

export default RootPage
