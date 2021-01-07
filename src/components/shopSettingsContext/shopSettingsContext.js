import React, { createContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { settings } from "../../settings";
import { JsonFetch } from "../fetches/Fetches";

const getSettings = async (setShopSettings, history) => {
  try {
    const response = await JsonFetch(
      `${settings.baseURL}/api/ShopSettings`,
      "GET",
      false,
      null
    );

    switch (response.status) {
      case 200:
        const settingsData = await response.json();
        setShopSettings(settingsData);
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
    secondaryColor: "#000000",
    leadingColor: "#000000",
    logo: "",
    currency: "",
    regulations: "",
  });

  useEffect(() => {
    getSettings(setShopSettings, history);
  }, []);

  return (
    <ShopSettingsContext.Provider value={{ ...shopSettings, setShopSettings }}>
      {children}
    </ShopSettingsContext.Provider>
  );
}
