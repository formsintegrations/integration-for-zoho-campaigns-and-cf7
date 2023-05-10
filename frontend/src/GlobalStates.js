import { atom } from 'recoil'
import { configs } from './Config'

// atoms
// eslint-disable-next-line no-undef
export const $fitzocacf = atom({ key: '$fitzocacf', default: configs })
export const $newFlow = atom({
  key: '$newFlow',
  default: {},
  dangerouslyAllowMutability: true,
})
export const $actionConf = atom({ key: '$actionConf', default: {}, dangerouslyAllowMutability: true })
export const $formFields = atom({ key: '$formFields', default: {}, dangerouslyAllowMutability: true })
export const $flowStep = atom({ key: '$flowStep', default: 1, dangerouslyAllowMutability: true })
