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
    theme: {
      id: 1,
      name: "Green, grey and white",
      secondaryBackgroundColor: "#f1f1f1",
      secondaryTextColor: "#000000",
      leadingBackgroundColor: "#02d463",
      leadingTextColor: "#000000",
      navbarBackgroundColor: "#ffffff",
      navbarTextColor: "#000000",
      mainBackgroundColor: "#ffffff",
      mainTextColor: "#000000",
      footerBackgroundColor: "#ffffff",
      footerTextColor: "#000000",
    },
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
