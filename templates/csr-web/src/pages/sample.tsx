import {css} from '@emotion/react'
import {useEffect, useState} from 'react'

import {bridge} from '.'

function SamplePage() {
    const [uiStyle, setUiStyle] = useState<any>()

    useEffect(() => {
        bridge.info.style().then((value) => {
            bridge.console.log(value)
            setUiStyle(value)
        })
    }, [])

    if (!uiStyle) {
        return null
    }

    return (
        <div
            css={css`
                overflow: hidden;
                /* margin-top: ${uiStyle.headerHeight + uiStyle.safeAreaInsets.top}px; */
                background-color: red;
                width: 100%;
                height: 100%;
            `}>
            <div
                css={css`
                    /* overflow: scroll; */
                    ::-webkit-scrollbar {
                        width: 10px;
                    }
                    ::-webkit-scrollbar-thumb {
                        background-color: #2f3542;
                        border-radius: 10px;
                        background-clip: padding-box;
                        border: 2px solid transparent;
                    }
                    ::-webkit-scrollbar-track {
                        background-color: grey;
                        border-radius: 10px;
                        box-shadow: inset 0px 0px 5px white;
                    }
                    width: 100%;
                    /* height: 600px; */
                    padding: 10px;
                    background-color: #f8f9fb;
                `}>
                <b>별 헤는 밤</b>
                <br />
                <br />
                계절이 지나가는 하늘에는
                <br />
                가을로 가득 차 있습니다.
                <br />
                <br />
                나는 아무 걱정도 없이
                <br />
                가을 속의 별들을 다 헤일 듯합니다.
                <br />
                <br />
                가슴 속에 하나 둘 새겨지는 별을
                <br />
                이제 다 못 헤는 것은
                <br />
                쉬이 아침이 오는 까닭이요,
                <br />
                내일 밤이 남은 까닭이요,
                <br />
                아직 나의 청춘이 다하지 않은 까닭입니다.
                <br />
                <br />
                별 하나에 추억과
                <br />
                별 하나에 사랑과
                <br />
                별 하나에 쓸쓸함과
                <br />
                별 하나에 동경과
                <br />
                별 하나에 시와
                <br />
                별 하나에 어머니, 어머니,
                <br />
                <br />
                어머님, 나는 별 하나에 아름다운 말 한마디씩 불러봅니다. 소학교때 책상을 같이 했던 아이들의 이름과, 패,
                경, 옥 이런 이국소녀들의 이름과 벌써 애기 어머니 된 계집애들의 이름과, 가난한 이웃사람들의 이름과,
                비둘기, 강아지, 토끼, 노새, 노루, ｢프란시스․쟘｣ ｢라이너․마리아․릴케｣ 이런 시인의 이름을 불러봅니다.
                <br />
                <br />
                이네들은 너무나 멀리 있습니다.
                <br />
                별이 아슬히 멀 듯이,
                <br />
                <br />
                어머님,
                <br />
                그리고 당신은 멀리 북간도에 계십니다.
                <br />
                <br />
                나는 무엇인지 그리워
                <br />
                이 많은 별빛이 나린 언덕 위에
                <br />
                내 이름자를 써보고,
                <br />
                흙으로 덮어 버리었습니다.
                <br />
                <br />
                딴은 밤을 새워 우는 벌레는
                <br />
                부끄러운 이름을 슬퍼하는 까닭입니다.
                <br />
                <br />
                그러나 겨울이 지나고 나의 별에도 봄이 오면
                <br />
                무덤 위에 파란 잔디가 피어나듯이
                <br />
                내 이름자 묻힌 언덕 위에도
                <br />
                자랑처럼 풀이 무성할 게외다.
                <br />
            </div>
        </div>
    )
}

export default SamplePage
