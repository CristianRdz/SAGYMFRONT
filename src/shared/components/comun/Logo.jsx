import React from "react";
import styled from "styled-components";

const logo = require("../../../resources/logo.png");

export const LogoWrapper = styled.div`
  position: absolute;
  top: -3.75rem;
  left: calc(50% - 3.75rem);
  width: 7.5rem;
  height: 7.5rem;
  border-radius: 50%;
  background-color: #ffffff;
  border: 0.15rem solid #179275;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 85;
    height: 85px;
  }
`;
export const Logo = () => {
  return (
    <LogoWrapper>
      <img src={logo} alt="Logo de mi aplicacion" />
    </LogoWrapper>
  );
};
