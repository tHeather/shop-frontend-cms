import { useEffect } from "react";
import { useHistory } from "react-router";

export const HandleErrorMessage = async (
  response,
  setErrorsList,
  setIsLoading
) => {
  const res = await response.json();
  setErrorsList(res.errors);
  setIsLoading(false);
};

export const HandleUnauthorizedOrForbiddenError = (history) => {
  sessionStorage.removeItem("token");
  history.push("/");
  history.go(0);
};

export const useServerErrorsHandler = (isUnauthorized, isServerError) => {
  const history = useHistory();

  useEffect(() => {
    if (!isUnauthorized) return;
    HandleUnauthorizedOrForbiddenError(history);
  }, [isUnauthorized]);

  useEffect(() => {
    if (!isServerError) return;
    history.push("/500");
  }, [isServerError]);
};
