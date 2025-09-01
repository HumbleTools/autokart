import { useFirebase } from './hooks/useFirebase'

const App = () => {

  const { user, roles, signIn, signOut, isFullyLoggedIn } = useFirebase();

  return isFullyLoggedIn() ? (
          <div>
            <p>Connecté en tant que : {user?.displayName || user?.email}</p>
            <button onClick={signOut}>Se déconnecter</button>
            <p>Rôles : {roles?.join(', ')}</p>
          </div>
        ) : (
          <div>
            <button onClick={signIn}>Se connecter avec Google</button>
            <span>Non connecté</span>
          </div>
        )
}

export default App;
