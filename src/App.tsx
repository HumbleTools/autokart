import { useFirebase } from './hooks/useFirebase'
import { useState } from 'react';
import styles from './App.module.css';
import loaderStyles from './components/loader.module.css';
import buttonStyles from './components/buttons.module.css';
import classNames from 'classnames';

const App = () => {
  const { user, signIn, signOut, isLoggedIn, isPending } = useFirebase();
  const headerClasses = classNames(
    { [styles.loggedout]: !isLoggedIn }
  );
  return <>
    <header className={headerClasses}>
      <h1>AUTOKART</h1>
      {isLoggedIn && user?.photoURL && (
        <Avatar src={user.photoURL} onClick={signOut} />
      )}
    </header>
    <div className={classNames(styles.loggingOverlay, { [styles.loggedIn]: isLoggedIn })}>
      {isPending ? <span className={loaderStyles.loader} />
        : isLoggedIn ? null
          : <button className={classNames(buttonStyles.akButton, buttonStyles.white)} onClick={signIn}>Se connecter avec Google</button>}
    </div>
    {isLoggedIn && <div className={styles.mainContent}>
      <div className={buttonStyles.buttonGrid}>
        <button className={classNames(buttonStyles.akButton, buttonStyles.white)}>Bouton blanc</button>
        <button className={classNames(buttonStyles.akButton)}>Bouton bleu</button>
        <button className={classNames(buttonStyles.akButton, buttonStyles.white)}>Bouton blanc</button>
        <button className={classNames(buttonStyles.akButton)}>Bouton bleu</button>
        <button className={classNames(buttonStyles.akButton, buttonStyles.white)}>Bouton blanc</button>
      </div>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        <br /><br />
        Sed euismod, nunc ut laoreet dictum, massa dolor dictum urna, nec dictum massa dolor nec urna.
        <br /><br />
        Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
        <br /><br />
        Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Etiam euismod, nunc ut laoreet dictum, massa dolor dictum urna, nec dictum massa dolor nec urna.
        <br /><br />
        Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
        <br /><br />
        Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Etiam euismod, nunc ut laoreet dictum, massa dolor dictum urna, nec dictum massa dolor nec urna.
        <br /><br />
        Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Etiam euismod, nunc ut laoreet dictum, massa dolor dictum urna, nec dictum massa dolor nec urna.
        <br /><br />
        Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Etiam euismod, nunc ut laoreet dictum, massa dolor dictum urna, nec dictum massa dolor nec urna. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
        <br /><br />
        Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Etiam euismod, nunc ut laoreet dictum, massa dolor dictum urna, nec dictum massa dolor nec urna. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Etiam euismod, nunc ut laoreet dictum, massa dolor dictum urna, nec dictum massa dolor nec urna. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Etiam euismod, nunc ut laoreet dictum, massa dolor dictum urna, nec dictum massa dolor nec urna. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        <br /><br />
        Sed euismod, nunc ut laoreet dictum, massa dolor dictum urna, nec dictum massa dolor nec urna.
        <br /><br />
        Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
        <br /><br />
        Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Etiam euismod, nunc ut laoreet dictum, massa dolor dictum urna, nec dictum massa dolor nec urna.
        <br /><br />
        Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
        <br /><br />
        Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Etiam euismod, nunc ut laoreet dictum, massa dolor dictum urna, nec dictum massa dolor nec urna.
        <br /><br />
        Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Etiam euismod, nunc ut laoreet dictum, massa dolor dictum urna, nec dictum massa dolor nec urna.
        <br /><br />
        Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Etiam euismod, nunc ut laoreet dictum, massa dolor dictum urna, nec dictum massa dolor nec urna. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
        <br /><br />
        Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Etiam euismod, nunc ut laoreet dictum, massa dolor dictum urna, nec dictum massa dolor nec urna. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Etiam euismod, nunc ut laoreet dictum, massa dolor dictum urna, nec dictum massa dolor nec urna. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Etiam euismod, nunc ut laoreet dictum, massa dolor dictum urna, nec dictum massa dolor nec urna. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        <br /><br />
        Sed euismod, nunc ut laoreet dictum, massa dolor dictum urna, nec dictum massa dolor nec urna.
        <br /><br />
        Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
        <br /><br />
        Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Etiam euismod, nunc ut laoreet dictum, massa dolor dictum urna, nec dictum massa dolor nec urna.
        <br /><br />
        Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
        <br /><br />
        Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Etiam euismod, nunc ut laoreet dictum, massa dolor dictum urna, nec dictum massa dolor nec urna.
        <br /><br />
        Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Etiam euismod, nunc ut laoreet dictum, massa dolor dictum urna, nec dictum massa dolor nec urna.
        <br /><br />
        Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Etiam euismod, nunc ut laoreet dictum, massa dolor dictum urna, nec dictum massa dolor nec urna. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
        <br /><br />
        Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Etiam euismod, nunc ut laoreet dictum, massa dolor dictum urna, nec dictum massa dolor nec urna. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Etiam euismod, nunc ut laoreet dictum, massa dolor dictum urna, nec dictum massa dolor nec urna. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Etiam euismod, nunc ut laoreet dictum, massa dolor dictum urna, nec dictum massa dolor nec urna. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;
      </p>
    </div>}
  </>;
};

export default App;

interface AvatarProps {
  src: string;
  onClick: () => void;
}

const Avatar: React.FC<AvatarProps> = ({ src, onClick }) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <img
      src={src}
      alt="Avatar"
      className={styles.avatar + (loaded ? ' ' + styles.avatarVisible : '')}
      aria-label="Se déconnecter"
      onClick={onClick}
      onLoad={() => setLoaded(true)}
      style={{ opacity: loaded ? 1 : 0 }}
    />
  );
};
