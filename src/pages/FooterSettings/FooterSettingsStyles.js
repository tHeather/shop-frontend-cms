import { Form } from "formik";
import styled from "styled-components";

const MOBILE_THRESHOLD = 700;

export const StyledFooterSettingsForm = styled(Form)`
  margin: 10vw 0;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 300px);
  justify-content: center;
  align-content: center;
  gap: 25px 50px;
  div:nth-child(5) {
    grid-column: 1/3;
  }

  @media (max-width: ${MOBILE_THRESHOLD}px) {
    grid-template-columns: 0.95fr;
    gap: 0;
    div:nth-child(5) {
      grid-column: 1/1;
    }
    button {
      width: 90%;
      max-width: 250px;
      margin: auto;
    }
  }
`;
