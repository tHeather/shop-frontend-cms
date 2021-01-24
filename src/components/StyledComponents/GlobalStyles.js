import React, { useContext } from "react";
import styled, { ThemeProvider, createGlobalStyle } from "styled-components";
import { AuthContext } from "../auth/AuthContext";
import Navigation from "../Navigation/Navigation";
import Routing from "../routes/Routing";
import { ShopSettingsContext } from "../shopSettingsContext/shopSettingsContext";

const GlobalStyles = createGlobalStyle`
html{
  font-size: 16px;
  @media (max-width: 500px) {
    font-size: 14px;
  }
  h1{
    font-size:1.6rem
  }
  h2{
    font-size:1.4rem
  }
  label{
    font-size:1.05rem
  }
}

body{
  margin:0;
}
 
*,*::before,*:after{
  box-sizing:border-box;
  font-family: 'Montserrat', sans-serif;
}
`;

const StyledMain = styled.main`
  margin-top: ${({ isLoggedIn }) => (isLoggedIn ? "50px" : 0)};
  min-height: 100vh;
  background-color: ${({ theme: { mainBackgroundColor } }) =>
    mainBackgroundColor};
  color: ${({ theme: { mainTextColor } }) => mainTextColor};
`;

export default function Layout() {
  const { userEmail } = useContext(AuthContext);
  const { theme } = useContext(ShopSettingsContext);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Navigation />
      <StyledMain isLoggedIn={userEmail.length > 0}>
        <Routing />
      </StyledMain>
    </ThemeProvider>
  );
}
