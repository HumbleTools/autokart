import { SyntheticEvent } from 'react'
import { basicCatchToast } from './ToasterUtils'

export const voidHandleSubmit = <T>(handler: (event: SyntheticEvent) => Promise<T>) =>
  (event: SyntheticEvent) => {
    handler(event).catch(basicCatchToast)
  }
