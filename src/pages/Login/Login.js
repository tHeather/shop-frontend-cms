import React, { useContext, useState } from "react";
import { useHistory } from "react-router";
import { AuthContext } from "../../components/auth/AuthContext";
import { HandleErrorMessage } from "../../components/Errors/ErrorHandlers";
import ErrorModal from "../../components/Errors/ErrorModal";
import { JsonFetch } from "../../components/fetches/Fetches";
import Loader from "../../components/loader/Loader";
import { settings } from "../../settings";

const submitForm = async (
  password,
  email,
  setIsFormValidated,
  setIsLoading,
  setErrorsList,
  login,
  history
) => {
  if (!(password && email)) {
    setIsFormValidated(false);
    return;
  }
  setIsFormValidated(true);
  setIsLoading(true);
  try {
    const response = await JsonFetch(
      `${settings.backendApiUrl}/api/Auth/login`,
      "POST",
      false,
      {
        email,
        password,
      }
    );

    switch (response.status) {
      case 200:
        const sessionData = await response.json();
        login(sessionData);
        history.push("/orders");
        break;
      case 401:
      case 400:
        HandleErrorMessage(response, setErrorsList, setIsLoading);
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

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorsList, setErrorsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormValidated, setIsFormValidated] = useState(true);
  const { login } = useContext(AuthContext);
  const history = useHistory();

  return (
    <>
      {errorsList.length > 0 && (
        <ErrorModal errorsArray={errorsList} clearErrors={setErrorsList} />
      )}
      {isLoading ? (
        <Loader />
      ) : (
        <form>
          <label htmlFor="email">E-mail</label>
          <input
            type="text"
            id="email"
            onChange={({ target: { value } }) => setEmail(value)}
            defaultValue={email}
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={({ target: { value } }) => setPassword(value)}
            defaultValue={password}
          />
          {!isFormValidated && "E-mail and password are required."}
          <button
            onClick={(e) => {
              e.preventDefault();
              submitForm(
                password,
                email,
                setIsFormValidated,
                setIsLoading,
                setErrorsList,
                login,
                history
              );
            }}
          >
            Log in
          </button>
        </form>
      )}
    </>
  );
}
