import { useEffect, useRef, useState } from "react";
import { useGoogleAuth } from "./hooks/useGoogleAuth";

const version = APP_VERSION;
const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const menuClassName = isMenuOpen ? "menu-opened" : "";

  // Auth logic
  const { signInWithGoogle, signOutGoogle, isAuthenticated, user, loading } = useGoogleAuth();
  const [autoLogin, setAutoLogin] = useState(true);
  const triedAutoLogin = useRef(false);

  useEffect(() => {
    if (autoLogin && !isAuthenticated && !loading && !triedAutoLogin.current) {
      triedAutoLogin.current = true;
      signInWithGoogle();
    }
  }, [autoLogin, isAuthenticated, loading, signInWithGoogle]);

  let content;
  if (loading) {
    content = <div>Chargement...</div>;
  } else if (isAuthenticated && user) {
    content = (
      <div className="flex flex-col items-center gap-2">
        <div>Connecté</div>
        <div><b>Nom :</b> {user.displayName}</div>
        <div><b>Email :</b> {user.email}</div>
        {user.photoURL && <img src={user.photoURL} alt="avatar" className="rounded-full w-16 h-16" />}
        <button className="mt-2 px-4 py-2 bg-red-500 text-white rounded" onClick={() => { setAutoLogin(false); signOutGoogle(); }}>Se déconnecter</button>
      </div>
    );
  } else {
    content = (
      <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={() => { setAutoLogin(false); signInWithGoogle(); }}>Se reconnecter</button>
    );
  }

  return (
    <div className="flex flex-col min-h-screen justify-start overflow-x-hidden">
      <div className="bg-primary text-white z-50 text-center text-5xl">
        <h1 className="m-4 font-fastaction">AUTOKART</h1>
      </div>
      <div id="content">{content}</div>
      <div className="relative mt-auto text-center text-sm p-4 z-40 bg-primary text-whitesmoke">
        <div id="bg-menu" className={`absolute bottom-10 left-[50%] -translate-x-1/2 w-16 h-8 bg-primary rounded-t-full 
          transition-all flex justify-center ${menuClassName}`} onClick={toggleMenu}>
        </div>
        <svg id="burger-icon" className="absolute block left-[50%] -translate-x-1/2 bottom-12 w-6 h-6" fill="none" 
          stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" onClick={toggleMenu}>
          <path id="line-1" className={`transition-all ${menuClassName}`} stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3,10 L21,10" />
          <path id="line-2" className={`transition-all ${menuClassName}`} stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3,14 L21,14" />
        </svg>
        {`AutoKart ${new Date().getFullYear()} - v${version ?? 'NOVERSION'}`}
      </div>
    </div>
  )
}

export default App;
