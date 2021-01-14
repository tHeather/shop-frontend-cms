import React, { createContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { settings } from "../../settings";
import { JsonFetch } from "../fetches/Fetches";
import Loader from "../loader/Loader";

const getSettings = async (setShopSettings, history, setIsLoading) => {
  setIsLoading(true);
  try {
    const response = await JsonFetch(
      `${settings.backendApiUrl}/api/ShopSettings`,
      "GET",
      false,
      null
    );

    switch (response.status) {
      case 200:
        const settingsData = await response.json();
        setShopSettings(settingsData);
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

export const ShopSettingsContext = createContext();

export default function ShopSettingsProvider({ children }) {
  const history = useHistory();
  const [shopSettings, setShopSettings] = useState({
    tertiaryColor: "#000000",
    secondaryColor: "#f1f1f1",
    leadingColor: "#02d463",
    logo: "",
    currency: "",
    regulations: "",
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getSettings(setShopSettings, history, setIsLoading);
  }, []);

  if (isLoading) return <Loader />;

  return (
    <ShopSettingsContext.Provider value={{ ...shopSettings, setShopSettings }}>
      {children}
    </ShopSettingsContext.Provider>
  );
}
