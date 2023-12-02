import { useState } from "react";

const version = APP_VERSION;
const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const menuClassName = isMenuOpen ? "menu-opened" : "";

  return (
    <div className="flex flex-col min-h-screen justify-start overflow-x-hidden">
      <div className="bg-primary text-white z-50 text-center text-5xl">
        <h1 className="m-4 font-fastaction">AUTOKART</h1>
      </div>
      
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
