import React, { useState } from "react";
import LoginForm from "./LoginForm";
import SelectTypeBtn from "./SelectTypeBtn";
import RandomTopic from "../RandomTopic/RandomTopic";

const SelectLoginType = (props) => {
  const [loginType, setLoginType] = useState("");
  return (
    <div className="login-div">
      {loginType === "" && (
        <SelectTypeBtn
          loginTypeHandler={(type) => {
            setLoginType(type);
          }}
        />
      )}
      {loginType === "teacher" && (
        <LoginForm
          loginTypeHandler={(type) => {
            setLoginType(type);
          }}
          loggedIn={(user) => {
            props.loggedIn(user);
          }}
          gotoMain={() => props.gotoMain()}
        />
      )}
      {loginType === "student" && (
        <RandomTopic gotoMain={() => props.gotoMain()} />
      )}
    </div>
  );
};

export default SelectLoginType;
