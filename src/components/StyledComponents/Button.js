import styled from "styled-components";
import { lighten, readableColor } from "polished";

export const StyledButton = styled.button`
  font-weight: bold;
  border-radius: 10px;
  padding: 0.3rem 0.6rem;
  background-color: ${({ theme: { leadingColor } }) => leadingColor};
  color: ${({ theme: { leadingColor } }) => readableColor(leadingColor)};
  cursor: pointer;
  border: none;
  &:hover {
    background-color: ${({ theme: { leadingColor } }) =>
      lighten(0.1, leadingColor)};
  }
`;
