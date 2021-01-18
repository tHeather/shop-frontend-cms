import { lighten } from "polished";
import styled from "styled-components";
import { background } from "../../../components/StyledComponents/Background";
import { StyledBackToListButton } from "../../../components/StyledComponents/Button";

export const StyledProductListEditProductContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const StyledProductListBackToListButton = styled(StyledBackToListButton)`
  align-self: flex-start;
  margin: 50px;
  @media (max-width: 500px) {
    margin: 30px;
  }
`;

export const StyledProductListContainer = styled.div`
  width: 100%;
  height: 100%;
  padding: 25px 0;
  display: grid;
  grid-gap: 20px;
  grid-template: "filters list" "filters pagination";
  grid-template-columns: 200px 800px;
  grid-template-rows: 1fr auto;
  justify-content: center;
  @media (max-width: 1050px) {
    grid-template: "filters" "list" "pagination";
    grid-template-columns: 1fr;
    grid-template-rows: repeat(3, auto);
  }
`;

export const StyledProductListFiltersContainer = styled.aside`
  grid-area: filters;
  background-color: ${({ theme: { tertiaryColor } }) => tertiaryColor};
  border-radius: 10px;
  padding: 5px;
`;

export const StyledProductListFiltersInner = styled.div`
  position: fixed;
  &,
  form {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  input,
  select,
  button {
    width: 90%;
  }
`;

export const StyledProductListListContainer = styled.div`
  grid-area: list;
`;

export const StyledProductListPaginationContainer = styled.div`
  grid-area: pagination;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const StyledProductListProductContainer = styled.article`
  ${background}
  &:hover {
    box-shadow: 0px 4px 5px rgba(0, 0, 0, 0.25);
  }
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px;
  padding: 10px;
  @media (max-width: 850px) {
    flex-direction: column;
    padding: 15px 2px;
    margin: 10px 3px;
  }
  table {
    tr {
      display: grid;
      grid-template-columns: 130px 470px;
      @media (max-width: 850px) {
        display: flex;
        flex-direction: column;
      }
    }
    th {
      text-align: left;
    }
    td {
      overflow-wrap: break-word;
    }
    th,
    td {
      font-size: 1rem;
      @media (max-width: 850px) {
        text-align: center;
        width: 400px;
      }
      @media (max-width: 450px) {
        width: 280px;
        font-size: 0.9rem;
      }
    }
  }
  img {
    width: 150px;
    height: 150px;
    object-fit: contain;
    @media (max-width: 450px) {
      width: 275px;
      height: 150px;
    }
  }
`;
