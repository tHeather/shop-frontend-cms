import React, { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import { StyledButton } from "../StyledComponents/Button";
import {
  StyledNavBar,
  StyledCollapseContainer,
  StyledCollapseBtn,
  StyledNavLinksList,
  StyledNav,
  StyledNavCloseBtn,
  StyledNavAccountLinks,
} from "./NavigationStyles";

export function CollapseNavLinks({ btnText, Content, isMobile, closeMenu }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [isMobile]);

  if (isMobile)
    return (
      <StyledCollapseContainer data-testid="navCollapse">
        <StyledCollapseBtn
          className={isOpen ? "activeMobileCollapseBtn" : ""}
          onClick={() => setIsOpen((s) => !s)}
        >
          {btnText}
        </StyledCollapseBtn>
        <Content
          style={{ display: isOpen ? "block" : "none" }}
          closeMenu={closeMenu}
        />
      </StyledCollapseContainer>
    );

  return (
    <StyledCollapseContainer
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      data-testid="navCollapse"
    >
      <StyledCollapseBtn>{btnText}</StyledCollapseBtn>
      <Content
        style={{ transform: `scaleY(${isOpen ? 1 : 0})` }}
        closeMenu={closeMenu}
      />
    </StyledCollapseContainer>
  );
}

export function DisplayLinks({ links, closeMenu, ...props }) {
  if (!links) return null;
  return (
    <StyledNavLinksList {...props}>
      {links.map(({ label, url }) => (
        <li key={url}>
          <NavLink onClick={closeMenu} activeClassName="activeNavLink" to={url}>
            {label}
          </NavLink>
        </li>
      ))}
    </StyledNavLinksList>
  );
}

export function AccountLinks({ userEmail, logout, closeMenu, ...props }) {
  return (
    <StyledNavAccountLinks data-testid="accountLinksContainer" {...props}>
      <div data-testid="userEmail">{userEmail}</div>
      <NavLink to="/change-password" onClick={closeMenu}>
        Change password
      </NavLink>
      <StyledButton onClick={logout}>Logout</StyledButton>
    </StyledNavAccountLinks>
  );
}

export const productLinks = [
  { label: "Add product", url: "/add-product" },
  { label: "Product list", url: "/products" },
];

export const visualSettingsLinks = [
  { label: "Menu", url: "/menu" },
  { label: "Current sections", url: "sections" },
  { label: "Add Section", url: "/add-sections" },
  { label: "Shop settings", url: "/shop-settings" },
  { label: "Slider", url: "/slider" },
  { label: "Footer settings", url: "/footer" },
];

export const ordersLinks = [{ label: "Orders list", url: "/orders" }];

export const sections = [
  {
    btnText: "Products",
    Content: (props) => <DisplayLinks links={productLinks} {...props} />,
  },
  {
    btnText: "Visual settings",
    Content: (props) => <DisplayLinks links={visualSettingsLinks} {...props} />,
  },
  {
    btnText: "Orders",
    Content: (props) => <DisplayLinks links={ordersLinks} {...props} />,
  },
];

const NavigationSections = ({ sections, isMobile, closeMenu }) => {
  return sections.map(({ btnText, Content }) => {
    return (
      <CollapseNavLinks
        key={btnText}
        isMobile={isMobile}
        btnText={btnText}
        closeMenu={closeMenu}
        Content={Content}
      />
    );
  });
};

export default function Navigation() {
  const [isMobile, setIsMobile] = useState(document.body.clientWidth < 800);
  const [isOpen, setIsOpen] = useState(false);
  const { logout, userEmail } = useContext(AuthContext);

  useEffect(() => {
    const checkIsMobile = () => {
      document.body.clientWidth < 800 ? setIsMobile(true) : setIsMobile(false);
    };

    window.addEventListener("resize", checkIsMobile);
    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  if (!userEmail) return null;

  return (
    <StyledNavBar isOpen={isOpen}>
      <StyledNav isOpen={isOpen}>
        <NavigationSections
          sections={sections}
          isMobile={isMobile}
          closeMenu={() => setIsOpen(false)}
        />
        <CollapseNavLinks
          isMobile={isMobile}
          btnText="My account"
          closeMenu={() => setIsOpen(false)}
          Content={(props) => (
            <AccountLinks userEmail={userEmail} logout={logout} {...props} />
          )}
        />
      </StyledNav>
      <StyledNavCloseBtn
        data-testid="toggleMenuBtn"
        onClick={() => setIsOpen((s) => !s)}
      >
        &#9776;
      </StyledNavCloseBtn>
    </StyledNavBar>
  );
}
