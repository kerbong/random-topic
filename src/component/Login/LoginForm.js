import React from "react";

const LoginForm = (props) => {
  return (
    <div className="login-form">
      <button onClick={() => props.loginTypeHandler("")}>뒤로</button>
      <form>
        <input type={"text"}></input>
        <input type={"password"}></input>
      </form>
    </div>
  );
};

export default LoginForm;
