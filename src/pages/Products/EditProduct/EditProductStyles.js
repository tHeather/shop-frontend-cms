import styled from "styled-components";
import { background } from "../../../components/StyledComponents/Background";
import { StyledDeleteButton } from "../../../components/StyledComponents/Button";

export const StyledEditProductContainer = styled.div`
  ${background}
  margin-bottom:50px;
`;

export const StyledEditProductDeleteButton = styled(StyledDeleteButton)`
  margin-top: 75px;
`;
