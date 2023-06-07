import {createFetchInstance} from '@oneweek/fetch'

import type {GetInitialProps} from '$types/getInitialProps'

type JsonIDPageProps = {
    body: string
    title: string
}

const api = createFetchInstance('https://jsonplaceholder.typicode.com')
function JsonIDPage({body, title}: JsonIDPageProps) {
    return (
        <div>
            {body} {title}
        </div>
    )
}

export const loading = () => {
    return <div>로딩중입니다~</div>
}

export const getInitialProps: GetInitialProps = async ({params}) => {
    if (!params?.id) {
        return {
            redirect: {
                to: '/',
            },
        }
    }
    const {id} = params

    const {result} = await api<JsonIDPageProps>(`/posts/${id}`)

    return {
        props: {
            body: result.body,
            title: result.title,
        },
    }
}

export default JsonIDPage
