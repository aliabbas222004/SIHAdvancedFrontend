import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
    const location = useLocation();

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container">
                
                {/* Brand */}
                <Link className="navbar-brand fw-bold" to="/">
                    Sunrise Interior Hub
                </Link>

                {/* Toggler for mobile */}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Nav Items */}
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link
                                className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
                                to="/"
                            >
                                Home
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className={`nav-link ${location.pathname === "/hsn" ? "active" : ""}`}
                                to="/hsn"
                            >
                                Add HSN
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link
                                className={`nav-link ${location.pathname === "/item" ? "active" : ""}`}
                                to="/item"
                            >
                                Add Item
                            </Link>
                        </li>

                        <div className="dropdown">
                            <button
                                className="btn dropdown-toggle"
                                type="button"
                                id="dropdownMenuButton1"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Inventory
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                <li>
                                    <a className="dropdown-item" href="/inventory/show">
                                        Show
                                    </a>
                                </li>
                                <li>
                                    <a className="dropdown-item" href="/inventory">
                                        Add
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <li className="nav-item">
                            <Link
                                className={`nav-link ${location.pathname === "/company" ? "active" : ""}`}
                                to="/company"
                            >
                                Company
                            </Link>
                        </li>

                        <div className="dropdown">
                            <button
                                className="btn dropdown-toggle"
                                type="button"
                                id="dropdownMenuButton1"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Analytics
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                <li>
                                    <a className="dropdown-item" href="/sales">
                                        Sales
                                    </a>
                                </li>
                                <li>
                                    <a className="dropdown-item" href="/profit">
                                        Profit
                                    </a>
                                </li>
                                <li>
                                    <a className="dropdown-item" href="/monthReport">
                                        Month Report
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div className="dropdown">
                            <button
                                className="btn dropdown-toggle"
                                type="button"
                                id="dropdownMenuButton1"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Customer
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                <li>
                                    <a className="dropdown-item" href="/addCustomer">
                                        Add
                                    </a>
                                </li>
                                <li>
                                    <a className="dropdown-item" href="/editCustomer">
                                        Edit
                                    </a>
                                </li>
                                <li>
                                    <a className="dropdown-item" href="/addPayment">
                                        Add Payment
                                    </a>
                                </li>
                                <li>
                                    <a className="dropdown-item" href="/ledger">
                                        Show Ledger
                                    </a>
                                </li>
                            </ul>
                        </div>


                        <div className="dropdown">
                            <button
                                className="btn dropdown-toggle"
                                type="button"
                                id="dropdownMenuButton1"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Transport
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                <li>
                                    <a className="dropdown-item" href="/addTransport">
                                        Add
                                    </a>
                                </li>
                                <li>
                                    <a className="dropdown-item" href="/showTransport">
                                        Show
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
