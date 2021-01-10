import React, { useContext } from "react";
import styled, { ThemeProvider, createGlobalStyle } from "styled-components";
import Navigation from "../Navigation/Navigation";
import Routing from "../routes/Routing";
import { ShopSettingsContext } from "../shopSettingsContext/shopSettingsContext";

const GlobalStyles = createGlobalStyle`
body{
  margin:0;
}
 
*,*::before,*:after{
  box-sizing:border-box;
  font-family: 'Montserrat', sans-serif;
}
`;

const StyledMain = styled.main``;

export default function Layout() {
  const { logo, currency, regulations, ...colors } = useContext(
    ShopSettingsContext
  );

  return (
    <ThemeProvider theme={colors}>
      <GlobalStyles />
      <Navigation />
      <StyledMain>
        <Routing />
      </StyledMain>
    </ThemeProvider>
  );
}
