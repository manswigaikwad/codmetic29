import { useDispatch } from "react-redux";
import { logout } from "../redux/apiCalls"; // Correctly imported logout function
import { useNavigate } from "react-router-dom";

const Account = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(dispatch); // Dispatch the logout action
    navigate("/login"); // Redirect to the login page after logout
  };

  return (
    <div>
      {/* Your account component UI */}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Account;
