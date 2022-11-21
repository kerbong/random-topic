import React from "react";
import styled from "styled-components";

const Button = styled.button`
  display: inline-block;
  background-color: #00d495;
  font-size: 2rem;
  margin: 1rem;
  padding: 2rem 3rem;
  border: none;
  border-radius: 3px;
  display: block;
  font-weight: bold;
`;

const P = styled.p`
  font-size: 1.5rem;
`;

const SelectDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const BtnDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const SelectTypeBtn = (props) => {
  return (
    <SelectDiv>
      <div className="title-div">
        <P>🎁 랜 덤 토 픽 ✨</P>
        <P>로그인 방식을 선택하세요.</P>
      </div>
      <BtnDiv>
        <Button onClick={() => props.loginTypeHandler("teacher")}>교사</Button>
        <Button onClick={() => props.loginTypeHandler("student")}>학생</Button>
      </BtnDiv>
    </SelectDiv>
  );
};

export default SelectTypeBtn;
