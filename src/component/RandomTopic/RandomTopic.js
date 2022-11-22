import React, { useState, useRef } from "react";
import { read, utils } from "xlsx";
import styled from "styled-components";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { dbService } from "../../fbase";

const Button = styled.button`
  background-color: #00d495;
  font-size: 1.3rem;
  margin: 1rem;
  padding: 1rem 2rem;
  border: none;
  border-radius: 3px;
  display: block;
  font-weight: bold;
  width: 200px;
`;

const SaveDiv = styled.div`
  display: flex;
  font-size: 1.3rem;
  padding: 1rem 2rem;
  width: 200px;
  font-weight: bold;
  flex-direction: column;
  align-items: center;
`;

const MainDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TeacherDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #00d44d2b;
  width: 350px;
  margin-top: 5px;
`;

const GettopicForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ThemeInput = styled.input`
  font-size: 1.3rem;
  margin: 1rem;
  padding: 1rem 2rem;
  border-radius: 3px;
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

const RandomTopic = (props) => {
  const [uid, setUid] = useState(props.userUid || null);
  const [topics, setTopics] = useState([]);
  const [picked, setPicked] = useState([]);

  const fileInfoInput = useRef(null);
  const numInput = useRef(null);
  const emailThemeInput = useRef(null);
  const themeInput = useRef(null);

  //테마선택 버튼 누르면 테마 주제들 가져오기
  const getTopicsHandler = async (e) => {
    e.preventDefault();
    const docRef = doc(dbService, "topic", emailThemeInput.current.value);
    onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        setTopics([...doc.data().datas]);
        console.log([...doc.data().datas]);
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

  const uploadTopics = async (data) => {
    let themeLabel = themeInput.current.value;

    console.log(themeLabel);
    await setDoc(doc(dbService, "topic", props.userEmail + themeLabel), {
      datas: data,
    });

    localStorage.setItem("emailTheme", props.userEmail + themeLabel);
  };

  const submitTopicUploader = async () => {
    //변경된 값이 없으면 return.. 차집합으로 계산해서 완전 겹쳐지면.. 차집합 영역이 둘다 없으면 return
    let differ1 = topics.filter((x) => !props.topics.includes(x));
    let differ2 = props.topics.filter((x) => !topics.includes(x));

    if (differ1.length === 0 && differ2.length === 0) {
      alert("변경된 자료가 없어요!");
      return;
    }
    console.log(topics);
    uploadTopics(topics);
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
    console.log(newTopics);
    setPicked([...newTopics]);
  };

  return (
    <MainDiv>
      {/* 교사로 접속하면 단어도 추가 가능 */}
      {uid && (
        <TeacherDiv>
          <h2> 교사용</h2>
          <input
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
              placeholder="접속할 때 쓸 테마명. 꼭 기억하기!"
            />{" "}
            <Button onClick={submitTopicUploader}>저장</Button>
          </SaveDiv>
          <Button onClick={() => props.logOutHandler()}>로그아웃</Button>
        </TeacherDiv>
      )}
      {/* 학생교사 공용 */}
      <GettopicForm onSubmit={getTopicsHandler}>
        <ThemeInput
          type={"text"}
          ref={emailThemeInput}
          placeholder={"선생님의 아이디 + 테마명을 적어주세요"}
        />
        <Button onClick={getTopicsHandler}>테마선택</Button>
      </GettopicForm>
      총 {topics.length} 개의 주제 중
      <form onSubmit={randomHandler}>
        <ThemeInput type={"number"} min={1} max={5} ref={numInput} />
        가지를
        <Button onclick={randomHandler}>랜덤뽑기</Button>
      </form>
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
