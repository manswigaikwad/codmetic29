import { FaSearch, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import Badge from "@mui/material/Badge";
import { useSelector, useDispatch } from "react-redux";
import { useState, useRef, useEffect } from "react";
import { logout } from "../redux/apiCalls"; // Import logout function

const Navbar = () => {
  const quantity = useSelector((state) => state.cart.quantity);
  const user = useSelector((state) => state.user);
  const [search, setSearch] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false); // For dropdown toggle
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const dropdownRef = useRef(null); // Reference to the dropdown

  // Handle logout function
  const handleLogout = () => {
    logout(dispatch);
    navigate("/login"); // Redirect to login page after logout
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false); // Close the dropdown
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="flex items-center justify-between h-[100px] bg-white shadow-md px-6">
      <div className="cursor-pointer m-2">
        <Link to="/">
          <img src="/blisslogo1.png" height="150px" width="200px" alt="Bliss Logo" />
        </Link>
      </div>

      <div className="flex items-center m-2">
        <input
          type="text"
          placeholder="Search products"
          onChange={(e) => setSearch(e.target.value)}
          className="p-[15px] border-2 border-[#f096dd] border-solid w-[500px] outline-none rounded-lg mr-[-30px]"
        />
        <Link to={`/products/${search}`}>
          <FaSearch className="text-[20px] cursor-pointer" />
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        <Link to="/cart" className="relative group">
          <Badge badgeContent={quantity} color="secondary">
            <ShoppingBasketIcon className="text-[#e455c5] group-hover:text-pink-600 transition duration-300" />
          </Badge>
        </Link>

        <div className="relative" ref={dropdownRef}>
          <div
            onClick={() => setDropdownOpen(!dropdownOpen)} // Toggle dropdown
            className="flex items-center space-x-2 border border-pink-300 p-2 rounded-lg cursor-pointer hover:bg-pink-100 transition duration-300"
          >
            <FaUser className="text-[#e455c5] hover:text-pink-600 transition duration-300" />
            {user.currentUser ? (
              <span className="text-[#e455c5] hover:text-pink-600 transition duration-300 font-semibold">
                {user.currentUser.name}
              </span>
            ) : (
              <Link to="/login">
                <span className="text-[#e455c5] hover:text-pink-600 transition duration-300 font-semibold">Login</span>
              </Link>
            )}
          </div>

          {/* Dropdown menu */}
          {dropdownOpen && user.currentUser && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <Link to="/myaccount" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                My Account
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
