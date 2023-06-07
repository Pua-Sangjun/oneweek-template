import type {GetInitialProps} from '$types/getInitialProps'

type JsonIDPageProps = {
    body: string
    title: string
}

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

    return {
        props: {
            body: [''],
            title: 'result.title',
        },
    }
}

export default JsonIDPage
