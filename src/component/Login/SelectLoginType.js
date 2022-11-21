import React, { useState } from "react";
import LoginForm from "./LoginForm";
import SelectTypeBtn from "./SelectTypeBtn";
import AccessForm from "./AccessForm";

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
      {loginType === "student" && (
        <AccessForm
          loginTypeHandler={(type) => {
            setLoginType(type);
          }}
        />
      )}
    </div>
  );
};

export default SelectLoginType;
