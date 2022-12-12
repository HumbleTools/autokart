import { User } from 'firebase/auth'
import React, { createContext } from 'react'

import { useFirebase } from '../hooks/useFirebase'

interface ISignContext {
  signIn: () => void
  signOut: () => void
  isFullyLoggedIn: () => boolean
}

export interface IUserContext extends ISignContext {
  user?: User
  roles?: string[]
}

export interface ISafeUserContext extends ISignContext {
  user: User
  roles: string[]
}

export const UserContext = createContext<IUserContext>({} as IUserContext)

interface ProviderProps {
  children: React.ReactNode
};

export const UserProvider = (props: ProviderProps) => {
  const context = useFirebase()
  return <UserContext.Provider value={context}>{props.children}</UserContext.Provider>
}

export const getSafeUser: (context: IUserContext) => ISafeUserContext = (context) => {
  if (context.user == null) {
    throw new Error('User is undefined in context at this point !')
  }
  if (context.roles == null) {
    throw new Error('User has no roles in context at this point !')
  }
  return { ...context } as ISafeUserContext
}
