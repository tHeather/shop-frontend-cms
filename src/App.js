import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./components/auth/AuthContext";
import Navigation from "./components/Navigation/Navigation";
import Routing from "./components/routes/Routing";
import ShopSettingsProvider from "./components/shopSettingsContext/shopSettingsContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ShopSettingsProvider>
          <Navigation />
          <Routing />
        </ShopSettingsProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
