import React from "react"
import "../styles/navbar.scss"
import Logo from "../images/logo.svg"

function Navbar() {
  return (
    <>
      <nav className="navbar">
        <div className="navbar__logo">
          <img
            src={Logo}
            alt="The logo of our brand"
            className="navbar__image"
          />
          <h3 className="navbar__title">You Favorite Book</h3>
        </div>
      </nav>
    </>
  )
}

export default Navbar
