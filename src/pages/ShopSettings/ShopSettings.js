import { Form, Formik } from "formik";
import React, { useContext, useState } from "react";
import { useHistory } from "react-router";
import { object } from "yup";
import {
  HandleErrorMessage,
  HandleUnauthorizedOrForbiddenError,
} from "../../components/Errors/ErrorHandlers";
import ErrorModal from "../../components/Errors/ErrorModal";
import { FormDataFetch } from "../../components/fetches/Fetches";
import {
  FileUploadField,
  SelectField,
  StandardField,
} from "../../components/forms/fields/Fields";
import {
  colorConstraints,
  fileValidation,
} from "../../components/forms/fieldsConstraints/FieldsConstraints";
import Loader from "../../components/loader/Loader";
import { InfoModal } from "../../components/Messages/Modal";
import { ShopSettingsContext } from "../../components/shopSettingsContext/shopSettingsContext";
import { MakeFormData } from "../../components/Utils/formDataUtils/FormDataUtils";
import { DisplayImage } from "../../components/Utils/ImageUtils/ImageUtils";
import { settings } from "../../settings";
import { CURRENCY } from "../../components/constants/constants";

const updateSettings = async (
  setShopSettings,
  settingsValues,
  setIsSaved,
  setIsLoading,
  setErrorsList,
  history
) => {
  try {
    setIsLoading(true);

    const response = await FormDataFetch(
      `${settings.baseURL}/api/ShopSettings`,
      "PUT",
      MakeFormData(settingsValues)
    );

    switch (response.status) {
      case 200:
        const settingData = await response.json();
        setShopSettings(settingData);
        setIsSaved(true);
        setIsLoading(false);
        break;
      case 400:
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

const validationSchema = object().shape({
  tertiaryColor: colorConstraints,
  secondaryColor: colorConstraints,
  leadingColor: colorConstraints,
  logo: fileValidation,
});

export default function ShopSettings() {
  const { logo, setShopSettings, ...settings } = useContext(
    ShopSettingsContext
  );

  const [isSaved, setIsSaved] = useState(false);
  const [errorsList, setErrorsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  if (isSaved)
    return (
      <InfoModal closeHandler={() => setIsSaved(false)} btnText="OK">
        <p>Settings successfully saved.</p>
      </InfoModal>
    );

  if (isLoading) return <Loader />;

  return (
    <>
      {errorsList.length > 0 && (
        <ErrorModal errorsArray={errorsList} clearErrors={setErrorsList} />
      )}
      <Formik
        validationSchema={validationSchema}
        initialValues={{ ...settings, logo: "" }}
        onSubmit={(settingsValues) =>
          updateSettings(
            setShopSettings,
            settingsValues,
            setIsSaved,
            setIsLoading,
            setErrorsList,
            history
          )
        }
      >
        {({ isValid }) => (
          <Form>
            <StandardField
              name="leadingColor"
              label="Leading color"
              type="color"
            />
            <StandardField
              name="secondaryColor"
              label="Secondary color"
              type="color"
            />
            <StandardField
              name="tertiaryColor"
              label="Tertiary color"
              type="color"
            />

            <SelectField name="currency" label="Currency">
              {CURRENCY.map((currency, index) => (
                <option key={currency} value={index}>
                  {currency}
                </option>
              ))}
            </SelectField>

            <DisplayImage src={logo} />

            <FileUploadField
              name="logo"
              accept=".jpg, .jpeg, .png, .pdf"
              label="Logo"
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
