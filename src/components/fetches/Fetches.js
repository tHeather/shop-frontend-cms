export const makeRequestObject = (
  method = "",
  isAuthorization = false,
  data = null
) => {
  const requestObject = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (isAuthorization)
    requestObject.headers.Authorization =
      "Bearer " + sessionStorage.getItem("token");

  if (data) requestObject.body = JSON.stringify(data);

  return requestObject;
};

export const JsonFetch = async (
  url = "",
  method = "",
  isAuthorization = false,
  data = null
) => {
  const requestObject = makeRequestObject(method, isAuthorization, data);
  const response = await fetch(url, requestObject);
  return response;
};

export const FormDataFetch = async (url = "", method, data) => {
  const response = await fetch(url, {
    method: method,
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("token"),
    },
    body: data,
  });

  return response;
};
