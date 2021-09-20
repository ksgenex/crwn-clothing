import React from "react";
import { Route, Switch } from "react-router-dom";
import { doc, onSnapshot } from "@firebase/firestore";

import HomePage from "./pages/homepage/homepage.component";
import ShopPage from "./pages/shop/shop.component";
import Header from "./components/header/header.component";
import SignInAndSignUp from "./pages/sign-in-and-sign-up/sign-in-and-sign-up.component";
import { getAuth } from "firebase/auth";
import { createUserProfileDocument, db } from "./firebase/firebase.utils";

import "./App.css";
import { connect } from "react-redux";
import { setCurrentUser } from "./redux/user/user.actions";

class App extends React.Component {
  unsubscribeFromAuth = null;

  componentDidMount() {
    const { setCurrentUser } = this.props;
    this.unsubscribeFromAuth = getAuth().onAuthStateChanged(
      async (userAuth) => {
        if (userAuth) {
          await createUserProfileDocument(userAuth);

          onSnapshot(doc(db, "users", `${userAuth.uid}`), (doc) => {
            setCurrentUser({
              id: doc.id,
              ...doc.data(),
            });
          });
        } else {
          setCurrentUser(userAuth);
        }
      }
    );
  }

  componentWillUnmount() {
    this.unsubscribeFromAuth();
  }

  render() {
    return (
      <div className="App">
        <Header />
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/shop" component={ShopPage} />
          <Route path="/signin" component={SignInAndSignUp} />
        </Switch>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  setCurrentUser: (user) => dispatch(setCurrentUser(user)),
});

export default connect(null, mapDispatchToProps)(App);
