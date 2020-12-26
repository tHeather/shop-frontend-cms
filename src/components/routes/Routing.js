import React, { useContext } from "react";
import { Route, Switch, Redirect } from "react-router";
import Login from "../../pages/Login/Login";
import { AuthContext } from "../auth/AuthContext";
import ServerError from "../../pages/ErrorPages/ServerError";
import ProductList from "../../pages/Products/ProductList/ProductList";
import CategoryList from "../../pages/MenuSettings/CategoryList/CategoryList";
import SectionList from "../../pages/Sections/SectionList/SectionList";
import SaveSection from "../../pages/Sections/SaveSection/SaveSection";
import SaveProduct from "../../pages/Products/SaveProduct/SaveProduct";

const PrivateRoute = ({ userEmail, children }) => {
  return userEmail ? children : <Redirect exact to="/" />;
};

export default function Routing() {
  const { userEmail } = useContext(AuthContext);

  return (
    <Switch>
      {/* Public */}
      <Route exact path="/" component={() => <Login />} />
      {/* Private */}
      <Route exact path="/orders">
        <PrivateRoute userEmail={userEmail}>
          <div>Orders</div>
        </PrivateRoute>
      </Route>
      <Route exact path="/sections">
        <PrivateRoute userEmail={userEmail}>
          <SectionList />
        </PrivateRoute>
      </Route>
      <Route exact path="/add-sections">
        <PrivateRoute userEmail={userEmail}>
          <SaveSection />
        </PrivateRoute>
      </Route>
      <Route exact path="/menu">
        <PrivateRoute userEmail={userEmail}>
          <CategoryList />
        </PrivateRoute>
      </Route>
      <Route exact path="/add-product">
        <PrivateRoute userEmail={userEmail}>
          <SaveProduct />
        </PrivateRoute>
      </Route>
      <Route exact path="/products">
        <PrivateRoute userEmail={userEmail}>
          <ProductList />
        </PrivateRoute>
      </Route>
      {/* Error */}
      <Route exact path="/500" component={() => <ServerError />} />
      {/* default */}
      <Route component={() => <div>404</div>} />
    </Switch>
  );
}
