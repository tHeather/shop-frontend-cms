import { Form } from "formik";
import styled from "styled-components";
import { StyledButton } from "../../../components/StyledComponents/Button";

const DESKTOP_THRESHOLD = 1235;
const MEDIUM_THRESHOLD = 640;
const MOBILE_THRESHOLD = 450;

export const StyledSaveProductForm = styled(Form)`
  margin: 30px auto;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(2, 600px);
  justify-content: center;
  @media (max-width: ${DESKTOP_THRESHOLD}px) {
    grid-template-columns: 600px;
    h2 {
      text-align: center;
      padding: 20px 0;
    }
  }
  @media (max-width: ${MEDIUM_THRESHOLD}px) {
    grid-template-columns: 0.95fr;
  }
`;

export const StyledSaveProductFeaturesSection = styled.section`
  @media (min-width: ${DESKTOP_THRESHOLD}px) {
    border-right: 2px solid
      ${({ theme: { leadingBackgroundColor } }) => leadingBackgroundColor};
    padding-right: 100px;
  }
`;

export const StyledSaveProductImageSection = styled.section`
  @media (min-width: ${DESKTOP_THRESHOLD}px) {
    padding-left: 100px;
  }
`;

export const StyledSaveProductImageSectionElement = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  margin: 20px 5px;
  img {
    background-color: #e5e5e5;
    object-fit: contain;
    width: 180px;
    height: 180px;
  }
  @media (max-width: ${MEDIUM_THRESHOLD}px) {
    flex-direction: column;
    margin: 5px 5px 50px 5px;
  }
`;

export const StyledSaveProductImageSectionElementControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  button,
  label {
    min-width: 120px;
    margin: 10px auto 10px 10px;
    max-width: 380px;
    @media (max-width: ${MEDIUM_THRESHOLD}px) {
      margin: 10px auto;
      text-align: center;
    }
    @media (max-width: ${MOBILE_THRESHOLD}px) {
      max-width: 250px;
    }
  }
`;

export const StyledSaveProductSubmitBtn = styled(StyledButton)`
  margin: 50px auto;
  width: 250px;
  @media (min-width: ${DESKTOP_THRESHOLD}px) {
    grid-column: 1/3;
  }
`;
