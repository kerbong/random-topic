import "./App.css";
import SelectLoginType from "./component/Login/SelectLoginType";
import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

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
                logOutHandler={logOutHandler}
              />
            }
          />
        ) : (
          <Route index element={<SelectLoginType />} />
        )}
      </Routes>
    </div>
  );
}

export default App;
