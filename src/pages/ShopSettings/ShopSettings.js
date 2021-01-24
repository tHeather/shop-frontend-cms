import { Form, Formik } from "formik";
import React, { useContext, useEffect, useReducer } from "react";
import { useHistory } from "react-router";
import { object } from "yup";
import ErrorModal from "../../components/Errors/ErrorModal";
import {
  FileUploadField,
  SelectField,
} from "../../components/forms/fields/Fields";
import {
  fileValidation,
  textFileValidation,
} from "../../components/forms/fieldsConstraints/FieldsConstraints";
import Loader from "../../components/loader/Loader";
import { InfoModal } from "../../components/Messages/Modal";
import { ShopSettingsContext } from "../../components/shopSettingsContext/shopSettingsContext";
import { DisplayImage } from "../../components/Utils/ImageUtils/ImageUtils";
import { CURRENCY } from "../../components/constants/constants";
import {
  getThemes,
  updateSettings,
  deleteRegulations,
  deleteLogo,
} from "./ShopSettingsFetches";
import { settings } from "../../settings";
import { shopSettingsReducer } from "./ShopSettingsReducer";
import { HandleUnauthorizedOrForbiddenError } from "../../components/Errors/ErrorHandlers";
import {
  closeErrorModalActionCreator,
  closeModalActionCreator,
} from "../../components/Utils/GlobalActions/GlobalActions";

const validationSchema = object().shape({
  logo: fileValidation,
  regulations: textFileValidation,
});

const initialState = {
  themes: [],
  activeModalText: null,
  activeModalCloseHandlerParams: null,
  isLoading: false,
  errorsList: null,
  isUnauthorized: false,
  isServerError: false,
};

export default function ShopSettings() {
  const {
    regulations,
    logo,
    currency,
    theme: { id },
    setShopSettings,
  } = useContext(ShopSettingsContext);
  const [
    {
      themes,
      activeModalText,
      activeModalCloseHandlerParams,
      isLoading,
      errorsList,
      isUnauthorized,
      isServerError,
    },
    dispatch,
  ] = useReducer(shopSettingsReducer, initialState);
  const history = useHistory();

  useEffect(() => {
    if (themes.length) return;
    getThemes(dispatch);
  }, [themes]);

  useEffect(() => {
    if (!isUnauthorized) return;
    HandleUnauthorizedOrForbiddenError(history);
  }, [isUnauthorized]);

  useEffect(() => {
    if (!isServerError) return;
    history.push("/500");
  }, [isServerError]);

  if (activeModalText)
    return (
      <InfoModal
        closeHandler={() => {
          setShopSettings(activeModalCloseHandlerParams);
          dispatch(closeModalActionCreator());
        }}
        btnText="OK"
      >
        <p>{activeModalText}</p>
      </InfoModal>
    );

  if (isLoading) return <Loader />;

  return (
    <>
      {errorsList && (
        <ErrorModal
          errorsArray={errorsList}
          closeHandler={() => dispatch(closeErrorModalActionCreator())}
        />
      )}
      <Formik
        validationSchema={validationSchema}
        initialValues={{ themeId: id, currency, logo: "", regulations: "" }}
        onSubmit={(settingsValues) => updateSettings(settingsValues, dispatch)}
      >
        {({ isValid, values }) => (
          <Form data-testid="shopSettingsForm">
            <SelectField name="themeId" label="Theme">
              {themes.map(({ id, name }) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </SelectField>

            <SelectField name="currency" label="Currency">
              {CURRENCY.map((currency, index) => (
                <option key={currency} value={index}>
                  {currency}
                </option>
              ))}
            </SelectField>

            <DisplayImage src={values.logo || logo} alt="logo" />
            <FileUploadField
              name="logo"
              accept=".jpg, .jpeg, .png, .pdf"
              label="Logo"
            />
            {logo && (
              <button onClick={() => deleteLogo(dispatch)}>Delete logo</button>
            )}

            <FileUploadField
              name="regulations"
              accept=".doc, .docx, .pdf"
              label="Regulations"
            />
            <div>
              Current regulation:
              {regulations ? (
                <>
                  <a href={`${settings.backendApiUrl}/${regulations}`} download>
                    Download regulation
                  </a>
                  <button onClick={() => deleteRegulations(dispatch)}>
                    Delete regulations
                  </button>
                </>
              ) : (
                "no regulations yet"
              )}
            </div>

            <button type="submit" disabled={!isValid}>
              Save
            </button>
          </Form>
        )}
      </Formik>
    </>
  );
}
