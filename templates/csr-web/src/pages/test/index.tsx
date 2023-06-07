import {css, useTheme} from '@emotion/react'
import {useEvent} from '@oneweek-react/hook'
import {useNavigate} from 'react-router-dom'

import {GetInitialProps} from '$types/getInitialProps'

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
        <div
            css={css`
                display: flex;
                justify-content: space-between;
                flex-direction: column;
                max-width: 100%;
                width: 100%;
                padding: 0;
                height: 100px;
                align-items: center;
                margin: 0;
                background-color: #f8f9fb;
            `}>
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
    return {
        props: {
            items: [{userId: 'number', id: 'number', title: 'string', body: 'string'}],
        },
    }
}

export default JsonPlaceHolderTestPage
