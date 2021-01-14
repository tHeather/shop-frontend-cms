import React, { useContext } from "react";
import styled, { ThemeProvider, createGlobalStyle } from "styled-components";
import { AuthContext } from "../auth/AuthContext";
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

const StyledMain = styled.main`
  margin-top: ${({ isLoggedIn }) => (isLoggedIn ? "50px" : 0)};
  display: flex;
  min-height: 100vh;
  background-image: linear-gradient(
      339deg,
      rgba(47, 47, 47, 0.02) 0%,
      rgba(47, 47, 47, 0.02) 42%,
      transparent 42%,
      transparent 99%,
      rgba(17, 17, 17, 0.02) 99%,
      rgba(17, 17, 17, 0.02) 100%
    ),
    linear-gradient(
      257deg,
      rgba(65, 65, 65, 0.02) 0%,
      rgba(65, 65, 65, 0.02) 11%,
      transparent 11%,
      transparent 92%,
      rgba(53, 53, 53, 0.02) 92%,
      rgba(53, 53, 53, 0.02) 100%
    ),
    linear-gradient(
      191deg,
      rgba(5, 5, 5, 0.02) 0%,
      rgba(5, 5, 5, 0.02) 1%,
      transparent 1%,
      transparent 45%,
      rgba(19, 19, 19, 0.02) 45%,
      rgba(19, 19, 19, 0.02) 100%
    ),
    linear-gradient(
      29deg,
      rgba(28, 28, 28, 0.02) 0%,
      rgba(28, 28, 28, 0.02) 33%,
      transparent 33%,
      transparent 40%,
      rgba(220, 220, 220, 0.02) 40%,
      rgba(220, 220, 220, 0.02) 100%
    ),
    linear-gradient(90deg, rgb(255, 255, 255), rgb(255, 255, 255));
`;

export default function Layout() {
  const { userEmail } = useContext(AuthContext);
  const { logo, currency, regulations, ...colors } = useContext(
    ShopSettingsContext
  );

  return (
    <ThemeProvider theme={colors}>
      <GlobalStyles />
      <Navigation />
      <StyledMain isLoggedIn={userEmail.length > 0}>
        <Routing />
      </StyledMain>
    </ThemeProvider>
  );
}
