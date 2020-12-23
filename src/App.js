import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./components/auth/AuthContext";
import Navigation from "./components/Navigation/Navigation";
import Routing from "./components/routes/Routing";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navigation />
        <Routing />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
