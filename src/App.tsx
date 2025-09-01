import { useFirebase } from './hooks/useFirebase'

const App = () => {

  const { user, userRoles, signIn, signOut, isAuthPending } = useFirebase();

  return isAuthPending ? <div>Chargement...</div>
    : user ? (
      <div>
        <p>Connecté en tant que : {user?.displayName || user?.email}</p>
        <img src={user?.photoURL || ''} alt="Avatar" width={50} height={50} />
        <button onClick={signOut}>Se déconnecter</button>
        <p>Rôles : {userRoles.join(', ')}</p>
      </div>
    ) : (
      <div>
        <button onClick={signIn}>Se connecter avec Google</button>
        <span>Non connecté</span>
      </div>
    );
}

export default App;
