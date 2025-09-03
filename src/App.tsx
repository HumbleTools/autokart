
import { useFirebase } from './hooks/useFirebase'
import styles from './App.module.css';
import classNames from 'classnames';

const App = () => {
  const { user, signIn, signOut, isLoggedIn, isLoggedOut, isLoggingPending } = useFirebase();
  const headerClasses = classNames(
    {[styles.loggedout]: isLoggedOut || isLoggingPending}
  );
  return <>
    <header className={headerClasses}>
      <h1>AUTOKART</h1>
      {isLoggedIn && user?.photoURL && (
        <img
          src={user.photoURL}
          alt="Avatar"
          className={styles.avatar}
          aria-label="Se déconnecter"
          onClick={signOut}
        />
      )}
    </header>
    {isLoggingPending ? <div>Chargement...</div>
      : isLoggedOut ? <button onClick={signIn}>Se connecter avec Google</button>
      : null}
  </>;
};

export default App;
