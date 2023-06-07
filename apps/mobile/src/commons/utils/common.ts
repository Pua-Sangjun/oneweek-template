export function assertBoolean(
    value?: unknown,
    options?: {
        compare?: boolean
        default?: boolean
    },
) {
    if (!value) {
        return options?.default || false
    }
    return value.toString() === `${options?.compare || true}`
}
