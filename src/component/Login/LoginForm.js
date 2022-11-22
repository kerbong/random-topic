import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";
import { authService } from "../../fbase";

const Input = styled.input`
  padding: 1rem;
  margin: 1rem;
  border-radius: 3px;
`;

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

const Label = styled.label`
  font-size: 1.3rem;
`;

const LoginDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 3rem;
`;

const LoginForm = (props) => {
  //   const [email, setEmail] = useState("");
  //   const [password, setPassword] = useState("");
  const [isTeacher, setIsTeacher] = useState("");

  const isTeacherChecker = (e) => {
    e.preventDefault();
    let inputValue = teacherCheckRef.current.value;
    if (inputValue === "from-indi") {
      alert("환영합니다! 구글 연동 로그인이 가능합니다!");
      localStorage.setItem("isTeacher", inputValue);
      setIsTeacher(inputValue);
    } else {
      alert("접속 비밀번호를 다시 확인해주세요!");
    }
    teacherCheckRef.current.value = "";
  };

  const teacherCheckRef = useRef();

  const onSocialClick = async (e) => {
    e.preventDefault();
    const {
      target: { name },
    } = e;
    let provider;
    if (name === "google") {
      provider = new GoogleAuthProvider();
    }

    if (navigator.platform) {
      var filter = "win16|win32|win64|mac|macintel";
      if (filter.indexOf(navigator.platform.toLowerCase()) < 0) {
        // mobile 접속인 경우
        // console.log("모바일");

        await signInWithRedirect(authService, provider);
      } else {
        if (
          navigator.userAgent.match(
            ".*(iPhone|iPod|iPad|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson).*"
          )
        ) {
          // PC 상의 모바일 에뮬레이터
          // console.log("mobile on pc");
          await signInWithPopup(authService, provider);
        } else {
          // pc 접속인 경우
          // console.log("pc");
          await signInWithPopup(authService, provider);
        }
      }
    }
  };

  return (
    <LoginDiv>
      {isTeacher === "" && (
        <>
          <Label>교사인증 비밀번호</Label>
          <form onSubmit={isTeacherChecker}>
            <Input type={"password"} ref={teacherCheckRef} autoFocus></Input>
          </form>
        </>
      )}

      {isTeacher === "from-indi" && (
        <form>
          <Button name="google" onClick={onSocialClick}>
            Google 로그인
          </Button>
        </form>
      )}

      <Button onClick={() => props.loginTypeHandler("")}>뒤로</Button>
    </LoginDiv>
  );
};

export default LoginForm;
