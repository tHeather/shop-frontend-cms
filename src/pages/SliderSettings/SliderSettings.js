import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { object } from "yup";
import {
  HandleErrorMessage,
  HandleUnauthorizedOrForbiddenError,
} from "../../components/Errors/ErrorHandlers";
import ErrorModal from "../../components/Errors/ErrorModal";
import { FormDataFetch, JsonFetch } from "../../components/fetches/Fetches";
import { FileUploadField } from "../../components/forms/fields/Fields";
import { fileValidation } from "../../components/forms/fieldsConstraints/FieldsConstraints";
import Loader from "../../components/loader/Loader";
import { InfoModal } from "../../components/Messages/Modal";
import { MakeFormData } from "../../components/Utils/formDataUtils/FormDataUtils";
import { DisplayImage } from "../../components/Utils/ImageUtils/ImageUtils";
import { settings } from "../../settings";

const validationSchema = object().shape({
  firstSlide: fileValidation,
  secondSlide: fileValidation,
  thirdSlide: fileValidation,
  fourthSlide: fileValidation,
  fifthSlide: fileValidation,
});

const initialFormValues = {
  firstSlide: "",
  secondSlide: "",
  thirdSlide: "",
  fourthSlide: "",
  fifthSlide: "",
};

const getImages = async (setFormValues, setIsLoading, history) => {
  try {
    setIsLoading(true);
    const response = await JsonFetch(
      `${settings.backendApiUrl}/api/Slider`,
      "GET",
      false,
      null
    );

    switch (response.status) {
      case 200:
        const images = await response.json();
        setFormValues(images);
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

const updateImages = async (
  formValues,
  setIsLoading,
  setFormValues,
  setErrorsList,
  setIsImagesSaved,
  history
) => {
  try {
    setIsLoading(true);

    const response = await FormDataFetch(
      `${settings.backendApiUrl}/api/Slider`,
      "PUT",
      MakeFormData(formValues)
    );

    switch (response.status) {
      case 200:
        const images = await response.json();
        setFormValues(images);
        setIsImagesSaved(true);
        setIsLoading(false);
        break;
      case 400:
        setFormValues(initialFormValues);
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

const Slider = ({
  firstSlide,
  secondSlide,
  thirdSlide,
  fourthSlide,
  fifthSlide,
}) => {
  return (
    <>
      <DisplayImage src={firstSlide} />
      <DisplayImage src={secondSlide} />
      <DisplayImage src={thirdSlide} />
      <DisplayImage src={fourthSlide} />
      <DisplayImage src={fifthSlide} />
    </>
  );
};

export default function SliderSettings() {
  const [formValues, setFormValues] = useState(initialFormValues);
  const [isImagesSaved, setIsImagesSaved] = useState(false);
  const [errorsList, setErrorsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  useEffect(() => {
    getImages(setFormValues, setIsLoading, history);
  }, []);

  if (isImagesSaved)
    return (
      <InfoModal closeHandler={() => setIsImagesSaved(false)} btnText="OK">
        <p>Images successfully saved.</p>
      </InfoModal>
    );

  if (isLoading) return <Loader />;

  return (
    <>
      {errorsList.length > 0 && (
        <ErrorModal errorsArray={errorsList} clearErrors={setErrorsList} />
      )}

      <Slider {...formValues} />

      <Formik
        validationSchema={validationSchema}
        initialValues={formValues}
        onSubmit={(formValues) =>
          updateImages(
            formValues,
            setIsLoading,
            setFormValues,
            setErrorsList,
            setIsImagesSaved,
            history
          )
        }
      >
        {({ isValid }) => (
          <Form data-testid="sliderForm">
            <FileUploadField
              name="firstSlide"
              accept="jpg, jpeg, bmp, gif, png, svg"
              label="First slide"
            />

            <FileUploadField
              name="secondSlide"
              accept="jpg, jpeg, bmp, gif, png, svg"
              label="Second slide"
            />

            <FileUploadField
              name="thirdSlide"
              accept="jpg, jpeg, bmp, gif, png, svg"
              label="Third slide"
            />

            <FileUploadField
              name="fourthSlide"
              accept="jpg, jpeg, bmp, gif, png, svg"
              label="Fourth slide"
            />

            <FileUploadField
              name="fifthSlide"
              accept="jpg, jpeg, bmp, gif, png, svg"
              label="Fifth slide"
            />

            <button type="submit" disabled={!isValid}>
              Save
            </button>
          </Form>
        )}
      </Formik>
    </>
  );
}
