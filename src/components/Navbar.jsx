import { useState } from "react";
// import { GiHamburgerMenu } from "react-icons/gi";

export const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);

  const handleButtonToggle = () => {
    setShowMenu(!showMenu);
  };

  return (
    <header>
      <div className="container">
        <div className="grid navbar-grid">
          <div className="logo">
            <h1>Pet Adoption</h1>
          </div>

          <nav className={showMenu ? "menu-mobile" : "menu-web"}>
            <ul>
              <li>
                <a href="/dashboard">Home</a>
              </li>
              <li>
                <a href="pets">Pets</a>
              </li>
              <li>
                <a href="my-applications">My Applications</a>
              </li>
              <li>
                <a href="all-applications">All Applications</a>
              </li>
            </ul>
          </nav>

          <div className="ham-menu">
            <button onClick={handleButtonToggle}>
              {/* <GiHamburgerMenu /> */}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};