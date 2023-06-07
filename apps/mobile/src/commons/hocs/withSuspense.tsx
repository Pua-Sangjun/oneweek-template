import {FC, Suspense, ComponentType} from 'react'

export function withSuspense<Props extends Record<string, unknown> = Record<string, never>>(
    Component: ComponentType<Props>,
    FallbackComponent: ComponentType,
) {
    const WithSuspense: FC<Props> = (props: Props) => {
        return (
            <Suspense fallback={<FallbackComponent />}>
                <Component {...props} />
            </Suspense>
        )
    }

    return WithSuspense
}
