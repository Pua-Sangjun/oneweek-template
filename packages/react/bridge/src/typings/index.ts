import type {
    AlertInterface,
    AnalyticsInterface,
    ConsoleInterface,
    InfoInterface,
    OptionInterface,
    RequestInterface,
    RouterInterface,
    StorageInterface,
    ToastInterface,
} from '../plugins'

export type Oneweek = ConsoleInterface &
    InfoInterface &
    AnalyticsInterface &
    StorageInterface &
    ToastInterface &
    AlertInterface &
    RequestInterface &
    RouterInterface &
    OptionInterface

declare global {
    interface Window {
        oneweek: Oneweek
    }
}
