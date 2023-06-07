import type {GetInitialProps} from '$types/getInitialProps'

type InitialProps = {
    text: number
    a: string
    id: string
}

function NestedIdTestPage({a, id}: InitialProps) {
    return (
        <div>
            params {a} {id}
        </div>
    )
}

export const getInitialProps: GetInitialProps<InitialProps> = ({params}) => {
    const {a = '', id = ''} = params
    return {
        props: {text: 1, a, id},
    }
}

export default NestedIdTestPage
