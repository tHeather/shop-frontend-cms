import styled from "styled-components";
import { LightenColor } from "./ColorUtils";

export const StyledButton = styled.button`
  font-weight: bold;
  border-radius: 10px;
  padding: 0.4rem 0.7rem;
  background-color: ${({ theme: { leadingBackgroundColor } }) =>
    leadingBackgroundColor};
  color: ${({ theme: { leadingTextColor } }) => leadingTextColor};
  cursor: pointer;
  border: none;
  &:hover {
    background-color: ${({ theme: { leadingBackgroundColor } }) =>
      LightenColor(leadingBackgroundColor, 10)};
  }
`;

export const StyledDeleteButton = styled(StyledButton)`
  background-color: #ff1205;
  color: white;
  &:hover {
    background-color: ${LightenColor("#ff1205", 20)};
  }
`;

export const StyledBackToListButton = styled.button`
  font-weight: bold;
  margin: 0 30px;
  display: flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  position: relative;
  &::before {
    content: "<";
    font-size: 30px;
    position: absolute;
    transition: transform 0.3s;
    transform: translateX(-20px);
    color: ${({ theme: { leadingBackgroundColor } }) => leadingBackgroundColor};
  }
  &:hover {
    color: #585958;
    &::before {
      transform: translateX(-30px);
    }
  }
`;
