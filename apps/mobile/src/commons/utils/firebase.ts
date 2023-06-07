import analytics from '@react-native-firebase/analytics'

export type FirebaseCustomEventParams =
    | {
          [key: string]: any
      }
    | undefined

export async function logCustomEventToFirebase(name: string, params?: FirebaseCustomEventParams) {
    await analytics().logEvent(name, params)
}
