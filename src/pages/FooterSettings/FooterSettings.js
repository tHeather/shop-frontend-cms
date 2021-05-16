import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { object } from "yup";
import {
  HandleErrorMessage,
  HandleUnauthorizedOrForbiddenError,
} from "../../components/Errors/ErrorHandlers";
import ErrorModal from "../../components/Errors/ErrorModal";
import { JsonFetch } from "../../components/fetches/Fetches";
import { StandardField, TextArea } from "../../components/forms/fields/Fields";
import {
  timeRangeValidation,
  phoneNumberValidation,
  emailValidation,
  footerTextValidation,
} from "../../components/forms/fieldsConstraints/FieldsConstraints";
import Loader from "../../components/loader/Loader";
import { InfoModal } from "../../components/Messages/Modal";
import { StyledButton } from "../../components/StyledComponents/Button";
import { StyledPageHeadline } from "../../components/StyledComponents/PageHeadlineStyles";
import { settings } from "../../settings";
import { StyledFooterSettingsForm } from "./FooterSettingsStyles";

const validationSchema = object().shape({
  weekWorkingHours: timeRangeValidation,
  weekendWorkingHours: timeRangeValidation,
  phoneNumber: phoneNumberValidation,
  email: emailValidation,
  text: footerTextValidation,
});

const initialFormValues = {
  weekWorkingHours: "",
  weekendWorkingHours: "",
  phoneNumber: "",
  email: "",
  text: "",
};

const getData = async (setFormValues, setIsLoading, history) => {
  try {
    setIsLoading(true);
    const response = await JsonFetch(
      `${settings.backendApiUrl}/api/FooterSettings`,
      "GET",
      false,
      null
    );

    switch (response.status) {
      case 200:
        const footerData = await response.json();
        setFormValues(footerData);
        setIsLoading(false);
        break;
      case 500:
        history.push("/500");
        break;
      default:
        console.log(response);
        break;
    }
  } catch (err) {
    console.error(err);
  }
};

const updateData = async (
  formValues,
  setIsLoading,
  setFormValues,
  setIsDataSaved,
  setErrorsList,
  history
) => {
  try {
    setIsLoading(true);

    const response = await JsonFetch(
      `${settings.backendApiUrl}/api/FooterSettings`,
      "PUT",
      true,
      formValues
    );

    switch (response.status) {
      case 200:
        setFormValues(formValues);
        setIsDataSaved(true);
        setIsLoading(false);
        break;
      case 400:
        setFormValues(formValues);
        HandleErrorMessage(response, setErrorsList, setIsLoading);
        break;
      case 401:
      case 403:
        HandleUnauthorizedOrForbiddenError(history);
        break;
      case 500:
        history.push("/500");
        break;
      default:
        console.log(response);
        break;
    }
  } catch (err) {
    console.error(err);
  }
};

export default function FooterSettings() {
  const [formValues, setFormValues] = useState(initialFormValues);

  const [isDataSaved, setIsDataSaved] = useState(false);

  const [errorsList, setErrorsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    getData(setFormValues, setIsLoading, history);
  }, []);

  if (isDataSaved)
    return (
      <InfoModal closeHandler={() => setIsDataSaved(false)} btnText="OK">
        <p>Data successfully saved.</p>
      </InfoModal>
    );

  if (isLoading) return <Loader />;

  return (
    <>
      {errorsList.length > 0 && (
        <ErrorModal
          errorsArray={errorsList}
          closeHandler={() => setErrorsList([])}
        />
      )}
      <StyledPageHeadline>Footer settings</StyledPageHeadline>
      <Formik
        validationSchema={validationSchema}
        initialValues={formValues}
        onSubmit={(formValues) =>
          updateData(
            formValues,
            setIsLoading,
            setFormValues,
            setIsDataSaved,
            setErrorsList,
            history
          )
        }
      >
        {({ isValid }) => (
          <StyledFooterSettingsForm data-testid="footerSettingsForm">
            <StandardField
              name="weekWorkingHours"
              label="Opening hours (Mon - Fri)"
              type="text"
            />

            <StandardField
              name="weekendWorkingHours"
              label="Opening hours  (Sat - Sun)"
              type="text"
            />

            <StandardField
              name="phoneNumber"
              label="Telephone number"
              type="text"
            />

            <StandardField name="email" label="E-mail" type="text" />

            <TextArea name="text" label="Text" rows="8" />

            <StyledButton type="submit" disabled={!isValid}>
              Save
            </StyledButton>
          </StyledFooterSettingsForm>
        )}
      </Formik>
    </>
  );
}
