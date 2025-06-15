import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

const Footer = () => {
  const { darkMode } = useContext(ThemeContext);

  return (
    <footer
      className={`${
        darkMode ? "bg-gray-900 text-gray-300" : "bg-gray-100 text-gray-700"
      } transition duration-300`}
    >
      <div className="container mx-auto px-6 py-4 text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} Attendance System. All rights reserved.
        </p>
        <p className="text-sm mt-2">
          Made with ❤️
         
             
        
        </p>
      </div>
    </footer>
  );
};

export default Footer;
