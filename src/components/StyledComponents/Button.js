import styled from "styled-components";
import { lighten, readableColor } from "polished";

export const StyledButton = styled.button`
  font-weight: bold;
  border-radius: 10px;
  padding: 0.4rem 0.7rem;
  background-color: ${({ theme: { leadingColor } }) => leadingColor};
  color: ${({ theme: { leadingColor } }) => readableColor(leadingColor)};
  cursor: pointer;
  border: none;
  &:hover {
    background-color: ${({ theme: { leadingColor } }) =>
      lighten(0.1, leadingColor)};
  }
`;

export const StyledDeleteButton = styled(StyledButton)`
  background-color: #ff1205;
  color: white;
  &:hover {
    background-color: ${lighten(0.1, "#ff1205")};
  }
`;
