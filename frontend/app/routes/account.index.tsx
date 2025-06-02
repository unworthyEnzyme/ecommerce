import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function AccountIndex() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the profile page when the account index is loaded
    navigate("/account/profile", { replace: true });
  }, [navigate]);

  return null; // This component doesn't render anything as it immediately redirects
}
