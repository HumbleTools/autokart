import { Navigate, NavLink, Route, Routes } from 'react-router-dom'
import { Home, MenuButtons } from './components/Home'
import { WriteRecipe } from './components/recipe/write/WriteRecipe'
import { ViewRecipe } from './components/recipe/view/ViewRecipe'
import { ISafeUserContext, IUserContext, UserContext } from './contexts/UserContext'
import { useContext, useState } from 'react'
import { LoaderContext } from './contexts/LoaderContext'
import { SearchRecipes } from './components/recipe/search/SearchRecipes'
import { Toaster } from './tools/Toaster'
import { ViewPlanning } from './components/plan/ViewPlanning'
import { ShoppingList } from './components/shopping/ShoppingList'
import { useSwipe } from './hooks/useSwipe'
import { AdminMenu } from './components/admin/AdminMenu'
import { isAdmin } from './dataServices/UserService'

const App = () => {
  const userContext = useContext(UserContext)
  const { loader } = useContext(LoaderContext)
  const [menuState, setMenuState] = useState<string>('')

  const closeMenu = () => {
    setMenuState('invisible')
    document.body.classList.remove('no-scroll')
  }
  const openMenu = () => {
    setMenuState('visible')
    document.body.classList.add('no-scroll')
  }
  const { onTouchStart, onTouchMove, onTouchEnd } = useSwipe({
    onSwipeLeft: closeMenu,
    onSwipeRight: openMenu
  })

  return (
    <div className="app" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} onTouchMove={onTouchMove}>
      {loader}
      <Header {...userContext} />
      <div className='main'>
        {userContext.isFullyLoggedIn() && <div className={`menu ${menuState}`}>
          <MenuButtons onButtonClicked={closeMenu} userContext={userContext as ISafeUserContext}/>
        </div>}
        <div className='container'>
          {userContext.isFullyLoggedIn()
            ? (
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/writeRecipe">
                <Route path=":recipeId" element={<WriteRecipe />} />
                <Route path="" element={<WriteRecipe />} />
              </Route>
              <Route path="/view/:recipeId" element={<ViewRecipe />} />
              <Route path="/search">
                <Route path=":query" element={<SearchRecipes />} />
                <Route path="" element={<SearchRecipes />} />
                <Route path="/search/tag/:query" element={<SearchRecipes tagModeInit={true} />} />
              </Route>
              <Route path="/planning" element={<ViewPlanning />} />
              <Route path="/shopping" element={<ShoppingList />} />
              {isAdmin(userContext.roles) && <>
                  <Route path="/admin" element={<AdminMenu />} />
              </>}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
              )
            : (
            <div className='not-logged'>
              <p>
                <button onClick={userContext.signIn}>Se connecter</button>
              </p>
            </div>
              )}
        </div>
      </div>
      <div className="footer">
        {`Copyright © ${new Date().getFullYear()} AutoKart - v${process.env.REACT_APP_VERSION ?? 'NOVERSION'}`}
      </div>
      <Toaster />
    </div>
  )
}

const Header = (userContext: IUserContext) => {
  return <div className='header'>
    <div className='title-row'>
      <div>
        <h1><NavLink className="no-link" to="/">AUTOKART</NavLink></h1>
      </div>
      <div className='right-title-item' onClick={userContext.signOut}></div>
    </div>
  </div>
}

export default App
