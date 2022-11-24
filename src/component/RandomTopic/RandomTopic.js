import React, { useState, useRef, useEffect } from "react";
import { read, utils } from "xlsx";
import styled from "styled-components";
import {
  doc,
  setDoc,
  onSnapshot,
  collection,
  getDocs,
} from "firebase/firestore";
import { dbService } from "../../fbase";
import Swal from "sweetalert2";

const Button = styled.button`
  background-color: #00d495;
  font-size: 1.3rem;
  margin: 1rem;
  padding: 1rem 2rem;
  border: none;
  border-radius: 3px;
  display: block;
  font-weight: bold;
  width: 160px;
`;

const LogOutButton = styled.button`
  background-color: #00d495;
  font-size: 1.3rem;
  margin: 0.5rem;
  padding: 1rem 1rem;
  border: none;
  border-radius: 3px;
  display: block;
  font-weight: bold;
  width: 120px;
`;

const SaveDiv = styled.div`
  display: flex;
  font-size: 1.3rem;
  padding: 10px;
  width: 90vw;
  flex-wrap: wrap;
  justify-content: center;
`;

const MainDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TeacherBtnDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const TeacherDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #00d44d2b;
  width: 95vw;
  margin-top: 5px;
  margin-bottom: 20px;
`;

const GettopicForm = styled.form`
  display: flex;
  width: 90vw;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
`;

const ThemeInput = styled.input`
  font-size: 1.2rem;
  margin: 10px 5px;
  padding: 1rem 1rem;
  border-radius: 3px;
  width: 40vw;
`;

const PwInput = styled.input`
  font-size: 1.2rem;
  margin: 10px 5px;
  padding: 1rem 0.5rem;
  border-radius: 3px;
  width: 25vw;
`;

const ResultLi = styled.li`
  font-size: 1.3rem;
  margin: 0.5rem;
  padding: 10px;
  list-style: none;
  background-color: #ffb6c19e;
  border-radius: 10%;
`;

const ResultUl = styled.ul`
  display: flex;
  flex-wrap: wrap;
`;

const ExcelExplain = styled.p`
  margin: 10px;
  word-break: keep-all;
`;

const TeacherH2 = styled.h2`
  margin: 10px;
`;

const RandomTopic = (props) => {
  const [uid, setUid] = useState(props.userUid || null);
  const [topics, setTopics] = useState([]);
  const [myTopics, setMyTopics] = useState([]);
  const [topicNames, setTopicNames] = useState([]);
  const [picked, setPicked] = useState([]);

  const fileInfoInput = useRef(null);
  const numInput = useRef(null);
  const chooseThemeInput = useRef(null);
  const themeInput = useRef(null);
  const pwUploadInput = useRef(null);
  const pwInput = useRef(null);

  //데이터베이스에서 이름들만 받아오기
  const findLabelPossible = async () => {
    const new_topicNames = [];
    const new_myTopics = [];
    const querySnapshot = await getDocs(collection(dbService, "topic"));
    querySnapshot.forEach((doc) => {
      new_topicNames.push(doc.id);
      if (doc.data().writtenId === props.userUid) {
        new_myTopics.push(doc.id);
      }
    });
    setMyTopics([...new_myTopics]);
    setTopicNames([...new_topicNames]);
  };

  useEffect(() => {
    //데이터베이스에서 자료이름들 찾아보고 저장해두기
    findLabelPossible();
  }, []);

  //테마선택 버튼 누르면 테마 주제들 가져오기
  const getTopicsHandler = async (e) => {
    e.preventDefault();
    const themeValue = chooseThemeInput.current.value;
    const pwValue = pwInput.current.value;

    const docRef = doc(dbService, "topic", themeValue + pwValue);
    onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        setTopics([...doc.data().datas]);
        // console.log([...doc.data().datas]);
      } else {
        setTopics([]);
      }
    });
  };

  const excelFileHandler = (e) => {
    let input = e.target;
    if (input.files[0] !== undefined) {
      let reader = new FileReader();
      reader.onload = function () {
        try {
          let data = reader.result;
          let workBook = read(data, { type: "binary" });
          workBook.SheetNames.forEach(function (sheetName) {
            let rows = utils.sheet_to_json(workBook.Sheets[sheetName]);
            // console.log(rows);
            let new_rows = rows.map((row) => ({
              num: row["번호"],
              theme: row["주제"],
            }));
            setTopics([...new_rows]);
          });
        } catch (error) {
          console.log(error);
        }
      };
      reader.readAsBinaryString(input.files[0]);
    } else {
      return;
    }
  };

  //특수문자 입력방지 함수
  const characterCheck = (obj) => {
    //띄어쓰기와 특수문자 모두
    const regExp = /[ ~!@\#$%^&*\()\-=+_'\;<>\/.\`:\"\\,\[\]?|{}]/gi;

    if (regExp.test(obj.current.value)) {
      // 입력한 특수문자 한자리 지움
      obj.current.value = obj.current.value.substring(
        0,
        obj.current.value.length - 1
      );
      Swal.fire({
        icon: "error",
        title: "입력불가",
        text: "특수문자, 띄어쓰기는 입력이 불가능합니다!",
      });
    }
  };

  const onlyNumber = (obj) => {
    let regExp = /[^0-9]/gi;
    if (regExp.test(obj.current.value)) {
      obj.current.value = obj.current.value.substring(
        0,
        obj.current.value.length - 1
      );
    }
  };

  //주제 업로드하기
  const uploadTopics = async (data, labelPw) => {
    Swal.fire({
      icon: "success",
      title: "저장완료",
      showConfirmButton: true,
      timer: 5000,
    });

    await setDoc(doc(dbService, "topic", labelPw), {
      datas: data,
      writtenId: props.userUid,
    });

    localStorage.setItem("emailTheme", labelPw);

    pwUploadInput.current.value = "";
    themeInput.current.value = "";
  };

  const submitTopicUploader = async () => {
    //변경된 값이 없으면 return.. 차집합으로 계산해서 완전 겹쳐지면.. 차집합 영역이 둘다 없으면 return
    let differ1 = topics.filter((x) => !props.topics.includes(x));
    let differ2 = props.topics.filter((x) => !topics.includes(x));

    if (differ1.length === 0 && differ2.length === 0) {
      alert("변경된 자료가 없어요!");
      return;
    }

    const themeLabel = themeInput.current.value;
    const pwInput = pwUploadInput.current.value;

    //이미 저장된 자료에 동일한 주제명이 있는지 확인
    if (topicNames.includes(themeLabel + pwInput)) {
      Swal.fire({
        icon: "error",
        title: "저장불가",
        text: "특수문자, 띄어쓰기는 입력이 불가능합니다!",
      });
      return false;
    }

    uploadTopics(topics, themeLabel + pwInput);
  };

  const randomHandler = (e) => {
    e.preventDefault();
    let num = numInput.current.value;
    let newTopics = [];
    while (newTopics.length < num) {
      let randomNum = Math.floor(Math.random() * topics.length);
      let dupNumber = newTopics?.filter(
        (top) => top.theme === topics[randomNum].theme
      );
      //   console.log(randomNum);
      //   console.log(dupNumber);
      if (dupNumber?.length === 0) {
        newTopics.push(topics[randomNum]);
      }
    }
    // console.log(newTopics);
    setPicked([...newTopics]);
  };

  return (
    <MainDiv>
      {/* 교사로 접속하면 단어도 추가 가능 */}
      {uid && (
        <TeacherDiv>
          <TeacherH2> 교사용</TeacherH2>
          <select defaultValue={""}>
            <option value="">내가 입력했던 자료(테마+비번)</option>
            {myTopics.map((mt, index) => (
              <option value={mt} key={index}>
                {mt}
              </option>
            ))}
          </select>

          <ExcelExplain>
            *엑셀파일의 A1 에는 번호, B1 에는 주제 라고 적힌 데이터 파일 업로드
          </ExcelExplain>

          <ExcelExplain>
            *학생들은 선생님의 email아이디(@전까지)+테마명 으로 접속합니다.
          </ExcelExplain>
          <label htmlFor="excelFileInput"></label>
          <input
            name="excelFileInput"
            type="file"
            id="excelFile"
            ref={fileInfoInput}
            onChange={(e) => {
              excelFileHandler(e);
            }}
            accept={".xls,.xlsx"}
          />
          <SaveDiv>
            <ThemeInput
              type="text"
              ref={themeInput}
              placeholder="접속할 때 쓸 테마명"
              onKeyDown={() => characterCheck(themeInput)}
              onKeyUp={() => characterCheck(themeInput)}
              maxLength={"20"}
            />
            <PwInput
              type="number"
              ref={pwUploadInput}
              placeholder="4자리숫자"
              maxLength={"4"}
              onKeyDown={() => onlyNumber(pwUploadInput)}
              onKeyUp={() => onlyNumber(pwUploadInput)}
            />{" "}
            <TeacherBtnDiv>
              <Button onClick={submitTopicUploader}>저장</Button>
              <LogOutButton onClick={() => props.logOutHandler()}>
                로그아웃
              </LogOutButton>
            </TeacherBtnDiv>
          </SaveDiv>
        </TeacherDiv>
      )}
      {/* 학생교사 공용 */}
      <GettopicForm onSubmit={getTopicsHandler}>
        <ThemeInput
          type={"text"}
          ref={chooseThemeInput}
          placeholder={"테마명"}
          onKeyDown={() => characterCheck(chooseThemeInput)}
          onKeyUp={() => characterCheck(chooseThemeInput)}
        />
        <PwInput
          type="number"
          ref={pwInput}
          placeholder="비밀번호"
          maxLength={"4"}
          onKeyDown={() => onlyNumber(pwInput)}
          onKeyUp={() => onlyNumber(pwInput)}
        />
        <Button onClick={getTopicsHandler}>테마선택</Button>
      </GettopicForm>
      총 {topics.length} 개의 주제 중
      <GettopicForm onSubmit={randomHandler}>
        <ThemeInput type={"number"} min={1} max={5} ref={numInput} />
        가지를
        <Button onclick={randomHandler}>랜덤뽑기</Button>
      </GettopicForm>
      <Button
        onClick={() => {
          props.gotoMain();
        }}
      >
        초기화면
      </Button>
      <ResultUl>
        {picked?.map((picked) => (
          <ResultLi key={picked.num}>
            {picked.num}번 - {picked.theme}
          </ResultLi>
        ))}
      </ResultUl>
    </MainDiv>
  );
};

export default RandomTopic;
