import { readableColor } from "polished";
import styled, { css } from "styled-components";

const NAVBAR_HEIGHT = 50;
const NAVBAR_COLOR = "#ffffff";
const COLLAPSE_BTN_HEIGHT = 30;
const MOBILE_THRESHOLD = 920;

const hoverAnimation = css`
  position: relative;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: ${({ theme: { leadingColor } }) => leadingColor};
    border-radius: 10px;
    z-index: -1;
    transform: scaleX(0);
    transition: transform 0.3s cubic-bezier(0.44, 0.05, 0.21, 0.9) 0s;
    transform-origin: left;
  }
  &:hover {
    color: ${({ theme: { leadingColor } }) => readableColor(leadingColor)};
    &::before {
      transform: scaleX(1);
    }
  }
`;

export const StyledNavBar = styled.header`
  z-index: 3001;
  top: 0;
  left: 0;
  position: fixed;
  width: 100%;
  height: ${NAVBAR_HEIGHT}px;
  display: flex;
  justify-content: flex-end;
  box-shadow: 0px 4px 5px rgba(0, 0, 0, 0.25);
  background: ${NAVBAR_COLOR};
  border-radius: ${({ isOpen }) => (isOpen ? "0" : "0 0 10px 10px")};
`;

export const StyledNav = styled.nav`
  transition: transform 0.3s;
  display: flex;
  @media (max-width: ${MOBILE_THRESHOLD}px) {
    transform: ${({ isOpen }) =>
      isOpen ? "translateX(0)" : "translateX(-100%)"};
    position: absolute;
    top: ${NAVBAR_HEIGHT}px;
    background: ${NAVBAR_COLOR};
    flex-direction: column;
    justify-content: flex-start;
    padding: 50px 0;
    height: calc(100vh - 50px);
    width: 100%;
    text-align: center;
    overflow-y: auto;
  }
`;

export const StyledNavCloseBtn = styled.button`
  display: none;
  @media (max-width: ${MOBILE_THRESHOLD}px) {
    display: block;
    background: none;
    border: none;
    font-size: 30px;
    margin-right: 10px;
  }
`;

export const StyledCollapseBtn = styled.button`
  display: block;
  font-size: 1rem;
  height: ${COLLAPSE_BTN_HEIGHT}px;
  padding: 5px 35px;
  background: none;
  border: none;
  cursor: pointer;
  @media (min-width: ${MOBILE_THRESHOLD + 1}px) {
    cursor: default;
    ${hoverAnimation}
  }
`;

export const StyledCollapseContainer = styled.div`
  margin: 35px;
  display: flex;
  flex-direction: column;
  @media (min-width: ${MOBILE_THRESHOLD + 1}px) {
    margin: ${(NAVBAR_HEIGHT - COLLAPSE_BTN_HEIGHT - 1) / 2}px 35px 35px 0;
  }
  .activeNavLink {
    &::before {
      transform: scaleX(1);
    }
  }
  .activeMobileCollapseBtn {
    background-color: ${({ theme: { leadingColor } }) => leadingColor};
    border-radius: 10px;
    color: ${({ theme: { leadingColor } }) => readableColor(leadingColor)};
  }
`;

const collapseContent = css`
  transform-origin: top;
  transition: transform 0.3s;
  border-radius: 0 0 10px 10px;
  box-shadow: 0px 4px 5px rgba(0, 0, 0, 0.25);
  text-align: center;
  margin: ${(NAVBAR_HEIGHT - COLLAPSE_BTN_HEIGHT - 1) / 2}px 0 0 0;
  background: ${NAVBAR_COLOR};

  a {
    text-decoration: none;
    color: black;
    display: block;
    width: 100%;
    ${hoverAnimation}
  }
`;

export const StyledNavLinksList = styled.ul`
  ${collapseContent}
  list-style: none;
  padding: 0;
  a {
    padding: 10px;
  }
  li {
    margin: 15px 0;
    position: relative;
    @media (min-width: ${MOBILE_THRESHOLD + 1}px) {
      margin: 5px 0;
    }
  }
`;

export const StyledNavAccountLinks = styled.div`
  ${collapseContent}
  padding: 20px 0;
  div:first-child {
    background-color: ${({ theme: { secondaryColor } }) => secondaryColor};
    border-radius: 10px;
    padding: 10px 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  a {
    padding: 10px 0;
    margin: 10px 0;
  }
`;
