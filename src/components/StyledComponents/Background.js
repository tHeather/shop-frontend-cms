import { css } from "styled-components";

export const background = css`
  background-color: ${({ theme: { secondaryColor } }) => secondaryColor};
  border-radius: 10px;
  padding: 1.5rem 1.5rem;
`;
