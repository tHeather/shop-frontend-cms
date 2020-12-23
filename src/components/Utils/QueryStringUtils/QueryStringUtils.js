export const MakeQueryString = (paramsObj) => {
  let paramsString = "";
  for (const property in paramsObj) {
    if (paramsObj[property] !== "") {
      paramsString += `&${property}=${paramsObj[property]}`;
    }
  }
  return paramsString.substring(1);
};
