import React from "react";
import styled, { css } from "styled-components";

export const LOADER_SIZES = {
  fullscreen: "fullscreen",
  fullscreenWithNavbar: "fullscreenWithNavbar",
  list: "list",
};

const backgroundFullscreenStyles = css`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const backgroundSizeStyleMaker = (size) => {
  switch (size) {
    case LOADER_SIZES.fullscreen:
      return backgroundFullscreenStyles;
    case LOADER_SIZES.fullscreenWithNavbar:
      return css`
        ${backgroundFullscreenStyles}
        top: 50px;
      `;
    case LOADER_SIZES.list:
      return css`
        height: 100%;
      `;

    default:
      break;
  }
};

const spinnerSizeStyleMaker = (size) => {
  switch (size) {
    case LOADER_SIZES.fullscreen:
    case LOADER_SIZES.fullscreenWithNavbar:
      return css`
        width: 200px;
        height: 200px;
        @media (max-width: 380px) {
          width: 100px;
          height: 100px;
        }
      `;
    case LOADER_SIZES.list:
      return css`
        width: 100px;
        height: 100px;
        @media (max-width: 380px) {
          width: 50px;
          height: 50px;
        }
      `;

    default:
      break;
  }
};

const StyledLoaderBackground = styled.div`
  ${({ theme: { mainBackgroundColor }, backgroundColor }) =>
    `background:${mainBackgroundColor || backgroundColor}`};
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  ${({ size }) => backgroundSizeStyleMaker(size)}

  @keyframes animation {
    0% {
      stroke-dasharray: 1 98;
      stroke-dashoffset: -105;
    }
    50% {
      stroke-dasharray: 80 10;
      stroke-dashoffset: -160;
    }
    100% {
      stroke-dasharray: 1 98;
      stroke-dashoffset: -300;
    }
  }
`;

const StyledLoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  ${({ size }) => spinnerSizeStyleMaker(size)}
`;

const StyledSpinner = styled.circle`
  transform-origin: center;
  animation-name: animation;
  animation-duration: 1.2s;
  animation-timing-function: cubic-bezier;
  animation-iteration-count: infinite;
  fill: transparent;
  stroke-width: 7px;
  stroke-linecap: round;
  ${({ theme: { leadingBackgroundColor }, leadingColor }) =>
    `stroke:${leadingBackgroundColor || leadingColor}`};
`;

export default function Loader(props) {
  return (
    <StyledLoaderBackground
      data-testid="loader"
      backgroundColor={props.theme && props.theme.mainBackgroundColor}
      size={props.size && props.size}
    >
      <StyledLoaderContainer size={props.size && props.size}>
        <svg viewBox="0 0 100 100">
          <StyledSpinner
            cx="50"
            cy="50"
            r="45"
            leadingColor={props.theme && props.theme.leadingBackgroundColor}
          />
        </svg>
      </StyledLoaderContainer>
    </StyledLoaderBackground>
  );
}
