import { getApps, deleteApp, initializeApp, getApp } from 'firebase/app'
import { getAuth, getRedirectResult, GoogleAuthProvider, onAuthStateChanged, signInWithRedirect, User } from 'firebase/auth'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUser } from '../dataServices/UserService'
import { config } from '../firebase-config'
import { basicCatchToast } from '../tools/ToasterUtils'

export const useFirebase = () => {
  const [user, setUser] = useState<User>()
  const [roles, setRoles] = useState<string[]>()
  const [isListeningAuth, setIsListeningAuth] = useState<boolean>(false)
  const navigate = useNavigate()

  if (getApps().length === 0) {
    initializeApp(config)
  }

  const listenAuthState = () => {
    if (isListeningAuth) return
    setIsListeningAuth(true)
    onAuthStateChanged(getAuth(), changedUser => {
      if (changedUser != null) {
        setUser(changedUser)
        console.log('User state changed to signed in !')
      } else {
        setUser(undefined)
      }
    })
  }

  useEffect(() => {
    if (isListeningAuth) return
    getRedirectResult(getAuth())
      .then((result) => {
        if (result != null) {
          setUser(result.user)
          console.log('User signed in !')
        } else {
          console.log('No user is signed in.')
          listenAuthState()
        }
      })
      .catch(basicCatchToast)
  })

  useEffect(() => {
    if ((user != null) && (roles == null)) {
      getUser(user.email as string)
        .then(dbUser => setRoles(dbUser.roles))
        .catch(basicCatchToast)
    }
  }, [user, roles])

  const signIn = () => {
    signInWithRedirect(getAuth(), new GoogleAuthProvider())
      .catch((error) => {
        console.error(error)
      })
  }

  const signOut = () => {
    getAuth()
      .signOut()
      .then(() => {
        setUser(undefined)
        deleteApp(getApp())
          .catch(basicCatchToast)
        console.log('Destroyed app and user !')
      })
      .catch(basicCatchToast)
    navigate('/')
  }

  const isFullyLoggedIn = () => !(user == null) && !(roles == null)

  return { user, roles, signIn, signOut, isFullyLoggedIn }
}
