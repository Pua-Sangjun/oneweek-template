import {Server} from 'client/components/server-components'

import {Client} from '../components/client-components'

function getData() {
    return new Promise<{id: number}>((resolve) => {
        setTimeout(() => {
            resolve({id: 1})
        }, 1000)
    })
}

async function Home() {
    const {id} = await getData()
    return (
        <>
            <h1>Hello, World! {id}</h1>
            <Client />
            <Server />
        </>
    )
}

export default Home
