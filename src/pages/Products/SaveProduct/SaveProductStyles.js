import { Form } from "formik";
import styled from "styled-components";
import { background } from "../../../components/StyledComponents/Background";
import { StyledButton } from "../../../components/StyledComponents/Button";

const DESKTOP_THRESHOLD = 1110;
const MEDIUM_THRESHOLD = 780;
const MOBILE_THRESHOLD = 450;

export const StyledSaveProductForm = styled(Form)`
  ${background}
  margin: 30px auto;
  display: grid;
  grid-template-columns: minmax(300px, 500px) 720px;
  grid-template-areas: "fields images" "submitBtn submitBtn";
  grid-gap: 20px;
  @media (max-width: ${DESKTOP_THRESHOLD}px) {
    grid-template-columns: 1fr;
    grid-template-areas: "fields" "images" "submitBtn";
  }
  @media (max-width: ${MOBILE_THRESHOLD}px) {
    padding: 5px;
  }
`;

export const StyledSaveProductFieldsSection = styled.section`
  grid-area: fields;
`;

export const StyledSaveProductImageSection = styled.section`
  grid-area: images;
  display: flex;
  flex-wrap: wrap;
`;

export const StyledSaveProductImageSectionElement = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  margin: 5px;
  img {
    width: 300px;
    height: 200px;
    object-fit: contain;
    @media (max-width: ${MOBILE_THRESHOLD}px) {
      width: 275px;
      height: 150px;
    }
  }
  @media (max-width: ${MEDIUM_THRESHOLD}px) {
    flex-direction: column;
    margin: 5px 5px 10px 5px;
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
  grid-area: submitBtn;
  margin: auto;
  width: 250px;
`;
