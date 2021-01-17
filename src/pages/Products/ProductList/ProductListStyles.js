import styled from "styled-components";
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
