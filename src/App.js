import "./App.css";
import SelectLoginType from "./component/Login/SelectLoginType";
import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";
import { authService } from "./fbase";
import RandomTopic from "./component/RandomTopic/RandomTopic";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userUid, setUserUid] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    try {
      authService.onAuthStateChanged((user) => {
        if (user) {
          setUserEmail(user.email.split("@")[0]);
          setUserUid(user.uid);

          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
        setInit(true);
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const logOutHandler = () => {
    setInit(false);
    setIsLoggedIn(false);
    setUserUid(null);
    setTopics([]);
  };

  const loggedInHandler = (user) => {
    setUserEmail(user.email.split("@")[0]);
    setUserUid(user.uid);
    setIsLoggedIn(true);
    setInit(true);
  };

  return (
    <div className="App">
      <Routes>
        {init && isLoggedIn ? (
          <Route
            index
            element={
              <RandomTopic
                topics={topics}
                userUid={userUid}
                userEmail={userEmail}
                logOutHandler={() => {
                  const auth = getAuth();
                  signOut(auth);
                  logOutHandler();
                }}
              />
            }
          />
        ) : (
          <Route
            index
            element={
              <SelectLoginType loggedIn={(user) => loggedInHandler(user)} />
            }
          />
        )}
      </Routes>
    </div>
  );
}

export default App;
