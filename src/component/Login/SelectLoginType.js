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
        />
      )}
      {loginType === "student" && <RandomTopic />}
    </div>
  );
};

export default SelectLoginType;
