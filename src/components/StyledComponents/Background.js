import { readableColor } from "polished";
import { css } from "styled-components";

export const background = css`
  background-color: ${({ theme: { secondaryColor } }) => secondaryColor};
  color: ${({ theme: { secondaryColor } }) => readableColor(secondaryColor)};
  border-radius: 10px;
  padding: 1.5rem 1.5rem;
`;
