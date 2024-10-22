import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <nav className="p-4 md:p-6 shadow-md">
     <h2 className="text-3xl text-red-300">mysd</h2>
      <ul className="container">
        <li>
          <Link href={"/"} className="text-lg dark:text-gray-200">
            Home
          </Link>
        </li>
        <li>
          <Link href={"/"} className="text-lg dark:text-gray-200">
            Login
          </Link>
        </li>
        <li>
          <Link href={"/"} className="text-lg dark:text-gray-200">
            Messages
          </Link>
        </li>
        <li>
          <Link href={"/"} className="text-lg dark:text-gray-200">
            Dashboard
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
