export const throttle = <Return, Arguments extends unknown[]>(
    fn: (...args: Arguments) => Return,
    delay: number,
): [(...args: Arguments) => Return | undefined, () => void] => {
    let wait = false
    let timeout: undefined | NodeJS.Timeout
    let canceled = false

    return [
        (...args: Arguments) => {
            if (canceled || wait) {
                return undefined
            }

            const val = fn(...args)

            wait = true

            timeout = setTimeout(() => {
                wait = false
            }, delay)

            return val
        },
        () => {
            canceled = true
            if (timeout) {
                clearTimeout(timeout)
            }
        },
    ]
}
