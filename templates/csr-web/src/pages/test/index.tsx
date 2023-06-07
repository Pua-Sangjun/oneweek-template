import {css, useTheme} from '@emotion/react'
import {createFetchInstance} from '@oneweek/fetch'
import {useEvent} from '@oneweek-react/hook'
import {useNavigate} from 'react-router-dom'

import {GetInitialProps} from '$types/getInitialProps'

const api = createFetchInstance('https://jsonplaceholder.typicode.com')

type Item = {
    userId: number
    id: number
    title: string
    body: string
}

type JsonPlaceHolderTestPageProps = {
    items: Item[]
}

function JsonPlaceHolderTestPage({items}: JsonPlaceHolderTestPageProps) {
    const navigate = useNavigate()
    const handleGoDetail = useEvent((id: number) => {
        navigate(`/test/${id}`)
    })

    const {colors} = useTheme()

    return (
        <div>
            <ul>
                {items.map(({userId, id}, index) => {
                    return (
                        <li
                            css={css`
                                border: 1px solid ${colors.main};
                                list-style: none;
                            `}
                            key={index}>
                            <p>userId : {userId}</p>
                            <p onClick={() => handleGoDetail(id)}>id : {id}</p>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export const getInitialProps: GetInitialProps = async () => {
    try {
        const {result: props} = await api('/posts')
        return {
            props: {items: props},
        }
    } catch {
        return {
            serverError: true,
        }
    }
}

export default JsonPlaceHolderTestPage
