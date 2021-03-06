import styled from "styled-components";
import { StyledBackToListButton } from "../../../components/StyledComponents/Button";

const DESKTOP_THRESHOLD = 1060;
const MEDIUM_THRESHOLD = 850;
const MOBILE_THRESHOLD = 450;

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
  @media (max-width: ${MOBILE_THRESHOLD}px) {
    margin: 30px;
  }
`;

export const StyledProductListContainer = styled.div`
  width: 100%;
  min-height: calc(100vh - 50px);
  padding: 25px 0;
  display: grid;
  grid-gap: 20px;
  grid-template: "filters list" "filters pagination";
  grid-template-columns: 220px 800px;
  grid-template-rows: 1fr auto;
  justify-content: center;
  @media (max-width: ${DESKTOP_THRESHOLD}px) {
    grid-template: "filters" "list" "pagination";
    grid-template-columns: 1fr;
    grid-template-rows: repeat(3, auto);
    padding-top: 0;
  }
`;

export const StyledProductListFiltersContainer = styled.aside`
  grid-area: filters;
  border-radius: 10px;
  padding: 5px;
  display: flex;
  align-items: center;
  flex-direction: column;
  @media (max-width: ${DESKTOP_THRESHOLD}px) {
    padding: 0;
    top: 80px;
    bottom: 0;
    left: 0;
    right: 0;
  }
  form {
    position: fixed;
    padding: 20px 5px;
    @media (max-width: ${DESKTOP_THRESHOLD}px) {
      position: unset;
    }
  }
`;

export const StyledProductListListContainer = styled.div`
  grid-area: list;
  padding: 5px;
  @media (min-width: ${DESKTOP_THRESHOLD}px) {
    border-left: 2px solid
      ${({ theme: { leadingBackgroundColor } }) => leadingBackgroundColor};
  }
`;

export const StyledProductListPaginationContainer = styled.div`
  grid-area: pagination;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const StyledProductListProductContainer = styled.article`
  &:hover {
    box-shadow: 0px 4px 5px rgba(0, 0, 0, 0.25);
  }
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px;
  padding: 10px;
  border: 2px solid
    ${({ theme: { secondaryBackgroundColor } }) => secondaryBackgroundColor};
  border-radius: 10px;
  @media (max-width: ${MEDIUM_THRESHOLD}px) {
    flex-direction: column;
    padding: 15px 2px;
    margin: 10px 3px;
  }
  table {
    tr {
      display: grid;
      grid-template-columns: 130px 470px;
      @media (max-width: ${MEDIUM_THRESHOLD}px) {
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
      @media (max-width: ${MEDIUM_THRESHOLD}px) {
        text-align: center;
        width: 400px;
      }
      @media (max-width: ${MOBILE_THRESHOLD}px) {
        width: 280px;
        font-size: 0.9rem;
      }
    }
  }
  img {
    padding: 10px;
    width: 150px;
    height: 150px;
    object-fit: contain;
    @media (max-width: ${MOBILE_THRESHOLD}px) {
      width: 275px;
      height: 150px;
    }
  }
`;
