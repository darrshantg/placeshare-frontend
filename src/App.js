import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom';

// import Users from './user/pages/users';
// import NewPlace from './places/pages/newPlace';
// import UserPlaces from './places/pages/userPlaces';
// import UpdatePlace from './places/pages/updatePlace';
// import Auth from './user/pages/auth';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import { AuthContext } from './shared/context/auth-context';
import {useAuth} from './shared/hooks/auth-hook';
import LoadingSpinner from './shared/components/UIElements/loadingSpinner';

const Users = React.lazy(() => import('./user/pages/users'));
const NewPlace = React.lazy(() => import('./places/pages/newPlace'));
const UserPlaces = React.lazy(() => import('./places/pages/userPlaces'));
const UpdatePlace = React.lazy(() => import('./places/pages/updatePlace'));
const Auth = React.lazy(() => import('./user/pages/auth'));


function App() {
  const {token, login, logout, userId} = useAuth();

  console.log(process.env.REACT_APP_MAPBOX_API_KEY)
  console.log(process.env.REACT_APP_BACKEND_URL)

  let routes;

  if(token) {
    routes = (
      <Switch>
        <Route path = "/" exact>
          <Users/>
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces/>
        </Route>
        <Route path = "/places/new" exact>
          <NewPlace/>
        </Route>
        <Route path= "/places/:placeId">
          <UpdatePlace/>
        </Route>
        <Redirect to = "/"></Redirect>
      </Switch>  
    );
  } else {
    routes = (
      <Switch>
        <Route path = "/" exact>
          <Users/>
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces/>
        </Route>
        <Route path = "/auth">
          <Auth/>
        </Route>
        <Redirect to = "/auth"></Redirect>
      </Switch>  
    );
  }

  return(
    <AuthContext.Provider value = {{isLoggedIn: !!token, token:token, userId: userId,login: login, logout: logout}}>
      <Router>
        <MainNavigation/>
        <main>
          <Suspense 
            fallback = {
              <div className='center'>
                <LoadingSpinner/>
              </div>
            }
          >
            {routes}
          </Suspense>
        </main>
      </Router>
    </AuthContext.Provider>
  ) 
}

export default App;
