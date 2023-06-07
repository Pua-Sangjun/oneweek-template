// import {SafeAreaView} from 'react-native'
// import {useBoolean} from '@oneweek-react/hook'
// import {firebase} from '@react-native-firebase/crashlytics'

// import {Alert} from '$commons/components/Alert'
// import {Button} from '$commons/components/Button'
// import {Text} from '$commons/components/Text'
// import {isIOS} from '$constants/platform'
// import {restAuthApi, restBaseApi} from '$utils/api'
// import {setToken} from '$storages/auth'

// export function Temp() {
//     const [state, setTrue, setFalse] = useBoolean()

//     return (
//         <CommonProviders>
//             <SafeAreaView style={{justifyContent: 'center', flex: 1}}>
//                 <WebView uri={isIOS ? 'http://localhost:5173' : 'http://new-local-m.pay.naver.com:5173/'} />
//                 <Button
//                     css={{width: 100, height: 100}}
//                     onPress={async () => {
//                         const data = await restBaseApi.post<{accessToken: string; refreshToken: string}>(
//                             '/auth/signin',
//                             {
//                                 phoneNumber: 'string1',
//                                 password: 'string1',
//                             },
//                         )
//                         setToken(data)
//                     }}>
//                     <Text>signIn</Text>
//                 </Button>
//                 <Button
//                     css={{width: 100, height: 100}}
//                     onPress={async () => {
//                         // eslint-disable-next-line no-console
//                         const [result, result2, result3, result4, result5] = await Promise.all([
//                             restAuthApi.get<[{_id: string}]>('/users'),
//                             restAuthApi.get<[{_id: string}]>('/users'),
//                             restAuthApi.get<[{_id: string}]>('/users'),
//                             restAuthApi.get<[{_id: string}]>('/users'),
//                             restAuthApi.get<[{_id: string}]>('/users'),
//                         ])

//                         // eslint-disable-next-line no-console
//                         console.log(
//                             result?.[0]?._id,
//                             result2?.[0]?._id,
//                             result3?.[0]?._id,
//                             result4?.[0]?._id,
//                             result5?.[0]?._id,
//                         )
//                     }}>
//                     <Text>get user all</Text>
//                 </Button>
//             </SafeAreaView>
//             <Alert
//                 isShow={state}
//                 title="지금 연장하면 10초만에 끝낼 수      있어요"
//                 message={`조회 기간이 끝나면 처음부터 연결해야해요. 정말 그만둘까요?`}
//                 onClose={state ? setFalse : setTrue}
//                 direction="horizontal"
//                 success={{
//                     label: '그만하기',
//                     callback: () => {
//                         return new Promise((resolve) => setTimeout(() => resolve(), 1000))
//                     },
//                 }}
//                 cancel={{
//                     callback: () => {
//                         firebase.crashlytics().crash()
//                     },
//                     label: '계속하기',
//                 }}
//             />
//         </CommonProviders>
//     )
// }
export {}
