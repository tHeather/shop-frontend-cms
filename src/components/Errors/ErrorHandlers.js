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
