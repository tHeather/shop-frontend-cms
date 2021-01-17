export const GLOBAL_ACTIONS = {
  loader: "loader",
  unauthorized: "unauthorized",
  serverError: "serverError",
  closeModal: "closeModal",
  closeErrorModal: "closeErrorModal",
};

export const loaderActionCreator = (isLoading) => {
  return {
    type: GLOBAL_ACTIONS.loader,
    isLoading,
  };
};

export const unauthorizedActionCreator = () => {
  return {
    type: GLOBAL_ACTIONS.unauthorized,
  };
};

export const serverErrorActionCreator = () => {
  return {
    type: GLOBAL_ACTIONS.serverError,
  };
};

export const closeModalActionCreator = () => {
  return {
    type: GLOBAL_ACTIONS.closeModal,
  };
};

export const closeErrorModalActionCreator = () => {
  return {
    type: GLOBAL_ACTIONS.closeErrorModal,
  };
};
