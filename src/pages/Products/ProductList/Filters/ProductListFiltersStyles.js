import { Form } from "formik";
import styled from "styled-components";
import { StyledButton } from "../../../../components/StyledComponents/Button";

const MOBILE_THRESHOLD = 1060;

export const StyledProductListFiltersFormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  @media (max-width: ${MOBILE_THRESHOLD}px) {
    display: ${({ isOpen }) => (isOpen ? "flex" : "none")};
  }
`;

export const StyledProductListFiltersForm = styled(Form)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

export const StyledProductListFiltersBtn = styled(StyledButton)`
  top: 0;
  height: 30px;
  width: 100%;
  @media (min-width: ${MOBILE_THRESHOLD}px) {
    display: none;
  }
`;
