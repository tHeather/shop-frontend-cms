import styled from "styled-components";

export const StyledPageHeadline = styled.h1`
  text-align: center;
  margin: 0;
  padding: 1.2rem 5px;
  background-color: ${({ theme: { secondaryBackgroundColor } }) =>
    secondaryBackgroundColor};
  color: ${({ theme: { secondaryTextColor } }) => secondaryTextColor};
  border-radius: 10px;
`;
