import Config from 'react-native-config'

export const ENV = Config?.ENV || 'local'

export const isLocalProfile = ENV === 'local'
export const isStageProfile = ENV === 'stage'
export const isRealProfile = ENV === 'real'
