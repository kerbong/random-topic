import React, { useState, useRef, useEffect } from "react";
import { read, utils } from "xlsx";
import styled from "styled-components";
import { doc, setDoc } from "firebase/firestore";
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

const RandomTopic = (props) => {
  const [uid, setUid] = useState(props.userUid);
  const [topics, setTopics] = useState([]);
  const [picked, setPicked] = useState([]);
  const fileInfoInput = useRef(null);
  const numInput = useRef(null);

  useEffect(() => {
    setTopics([...props.topics]);
  }, [props.topics]);

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
    await setDoc(doc(dbService, "topic", props.userEmail), data);
  };

  const submitTopicUploader = async () => {
    //변경된 값이 없으면 return.. 차집합으로 계산해서 완전 겹쳐지면.. 차집합 영역이 둘다 없으면 return
    let differ1 = topics.filter((x) => !props.topics.includes(x));
    let differ2 = props.topics.filter((x) => !topics.includes(x));

    if (differ1.length === 0 && differ2.length === 0) {
      alert("변경된 자료가 없어요!");
      return;
    }
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
    setPicked([...newTopics]);
  };

  return (
    <div>
      {/* 교사로 접속하면 단어도 추가 가능 */}
      {uid && (
        <>
          <input
            type="file"
            id="excelFile"
            ref={fileInfoInput}
            onChange={(e) => {
              excelFileHandler(e);
            }}
            accept={".xls,.xlsx"}
          />
          <Button onclick={submitTopicUploader}>저장</Button>
        </>
      )}
      총 {topics.length} 개의 주제
      <form onSubmit={randomHandler}>
        <input type={"number"} min={1} max={5} ref={numInput} />
        <Button onclick={randomHandler}>랜덤뽑기</Button>
      </form>
      {picked?.map((picked) => (
        <li key={picked.num}>
          {picked.num} - {picked.theme}
        </li>
      ))}
    </div>
  );
};

export default RandomTopic;
