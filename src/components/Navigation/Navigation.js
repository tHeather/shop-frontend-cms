import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";

export function Collapse({ btnText, children }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerStyle = { transform: `scaleY(${isOpen ? 1 : 0})` };
  return (
    <>
      <button onClick={() => setIsOpen((s) => !s)}>{btnText}</button>
      <div style={containerStyle}>{children}</div>
    </>
  );
}

export function DisplayLinks({ links }) {
  if (!links) return null;
  return links.map(({ label, url }) => (
    <Link key={url} to={url}>
      {label}
    </Link>
  ));
}

const productLinks = [
  { label: "Add product", url: "/add-product" },
  { label: "Product list", url: "/products" },
];

const visualSettingsLinks = [
  { label: "Menu ", url: "/menu" },
  { label: "Current sections", url: "sections" },
  { label: "Add Section", url: "/add-sections" },
];

export default function Navigation() {
  const { logout, userEmail } = useContext(AuthContext);

  if (!userEmail) return null;

  return (
    <nav>
      <Collapse btnText="Products">
        <DisplayLinks links={productLinks} />
      </Collapse>
      <Collapse btnText="Visual settings">
        <DisplayLinks links={visualSettingsLinks} />
      </Collapse>
      <Collapse btnText="My account">
        <div>{userEmail}</div>
        <Link to="/change-password">Change password</Link>
        <button onClick={logout}>Logout</button>
      </Collapse>
    </nav>
  );
}
