import React from "react";
import { Route, Switch } from "react-router-dom";

import HomePage from "./pages/homepage/homepage.component";
import ShopPage from "./pages/shop/shop.component";

import "./App.css";
import Header from "./components/header/header.component";
import SignInAndSignUp from "./pages/sign-in-and-sign-up/sign-in-and-sign-up.component";
import { getAuth } from "firebase/auth";
import { createUserProfileDocument, db } from "./firebase/firebase.utils";
import { doc, onSnapshot } from "@firebase/firestore";
class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: null,
    };
  }

  unsubscribeFromAuth = null;

  componentDidMount() {
    this.unsubscribeFromAuth = getAuth().onAuthStateChanged(
      async (userAuth) => {
        if (userAuth) {
          await createUserProfileDocument(userAuth);

          onSnapshot(doc(db, "users", `${userAuth.uid}`), (doc) => {
            this.setState({
              currentUser: {
                id: doc.id,
                ...doc.data(),
              },
            });
          });
        } else {
          this.setState({
            currentUser: userAuth,
          });
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
        <Header currentUser={this.state.currentUser} />
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/shop" component={ShopPage} />
          <Route path="/signin" component={SignInAndSignUp} />
        </Switch>
      </div>
    );
  }
}

export default App;
