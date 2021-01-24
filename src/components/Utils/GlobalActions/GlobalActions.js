export const GLOBAL_ACTIONS = {
  loader: "loader",
  unauthorized: "unauthorized",
  serverError: "serverError",
  closeModal: "closeModal",
  setModalMessage: "setModalMessage",
  setErororModalMessage: "setErororModalMessage",
  closeErrorModal: "closeErrorModal",
};

export const loaderActionCreator = (isLoading) => {
  return {
    type: GLOBAL_ACTIONS.loader,
    payload: { isLoading },
  };
};

export const unauthorizedActionCreator = () => {
  return {
    type: GLOBAL_ACTIONS.unauthorized,
    payload: null,
  };
};

export const serverErrorActionCreator = () => {
  return {
    type: GLOBAL_ACTIONS.serverError,
    payload: null,
  };
};

export const closeModalActionCreator = () => {
  return {
    type: GLOBAL_ACTIONS.closeModal,
    payload: null,
  };
};

export const setModalMessageActionCreator = (activeModalText) => {
  return {
    type: GLOBAL_ACTIONS.setModalMessage,
    payload: { activeModalText },
  };
};

export const closeErrorModalActionCreator = () => {
  return {
    type: GLOBAL_ACTIONS.closeErrorModal,
    payload: null,
  };
};

export const setErororModalMessageActionCreator = (errorsList) => {
  return {
    type: GLOBAL_ACTIONS.setErrorModalMessage,
    payload: { errorsList },
  };
};
