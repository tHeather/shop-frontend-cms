import styled from "styled-components";

export const StyledPaginationButton = styled.button`
  width: 30px;
  height: 30px;
  cursor: pointer;
  background: none;
  border: none;
  &:hover {
    path {
      fill: #585958;
    }
  }
  svg {
    width: 100%;
    height: 100%;
  }
`;

export const StyledPaginationForm = styled.form`
  margin: 0 10px;
  display: grid;
  grid-template-columns: 50px 10px auto;
  grid-column-gap: 10px;
  align-items: center;
`;
