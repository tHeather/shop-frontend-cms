import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./components/auth/AuthContext";
import ShopSettingsProvider from "./components/shopSettingsContext/shopSettingsContext";
import Layout from "./components/StyledComponents/GlobalStyles";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ShopSettingsProvider>
          <Layout />
        </ShopSettingsProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
