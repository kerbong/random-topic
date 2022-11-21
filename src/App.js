import "./App.css";
import SelectLoginType from "./component/Login/SelectLoginType";
import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { dbService } from "./fbase";
import { authService } from "./fbase";
import RandomTopic from "./component/RandomTopic/RandomTopic";

function App() {
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
          getTopics(user.email.split("@")[0]);
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  //저장된 학생명부 불러오는 snapshot 함수
  //참고 https://firebase.google.com/docs/firestore/query-data/listen?hl=ko
  const getTopics = async (email) => {
    //db에서 studnets 콜렉션 DB가져오고 doc id가 현재 유저인 doc 가져오기
    const docRef = doc(dbService, "topic", email);
    onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        setTopics([...doc.data().datas]);
        console.log([...doc.data().datas]);
      } else {
        setTopics([]);
      }
    });
  };

  const logOutHandler = () => {
    setIsLoggedIn(false);
    setUserUid(null);
    setTopics([]);
  };

  return (
    <div className="App">
      <Routes>
        {!isLoggedIn && <Route index element={<SelectLoginType />} />}

        {isLoggedIn && (
          <Route
            index
            element={
              <RandomTopic
                topics={topics}
                userUid={userUid}
                userEmail={userEmail}
              />
            }
          />
        )}
      </Routes>
    </div>
  );
}

export default App;
