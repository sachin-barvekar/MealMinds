import { useRef, useState, useEffect } from "react";
import {
  signOutUserFailure,
  signOutUserStart,
  signOutUserSuccess,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import './Profile.css'
import HeroSection from "../components/HeroSection";

export default function Profile() {
  const fileRef = useRef(null);
  const [setFile] = useState(null);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch("/api/v1/user");
        const data = await res.json();
        if (data.success === false) {
          console.error("Failed to fetch user data:", data.message);
          return;
        }

        setFormData({
          name: data.name,
          email: data.email,
          avatar: data.imageUrl,
        });
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      }
    };

    fetchUserData();
  }, []);

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/v1/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!data.success) {
        dispatch(signOutUserFailure());
        console.error("Sign out failed:", data.message);
        return;
      }
      dispatch(signOutUserSuccess());
      window.location.href = "/";
    } catch (error) {
      console.error("Sign out error:", error.message);
    }
  };

  return (
    <>
      <HeroSection title="Profile"/>
        <div className="profile-card m-3">
          <div className="profile m-auto text-center">
            <input
              onChange={(e) => setFile(e.target.files[0])}
              type="file"
              ref={fileRef}
              hidden
              accept="image/*"
            />
            <img
              src={formData.avatar}
              alt="profile"
              className="rounded-circle img-fluid mt-3"
              style={{ width: "150px", height: "150px", cursor: "pointer" }}
            />
            <div className="mt-4">
              <div className="mb-3">
                <strong>Name: </strong> <span>{formData.name}</span>
              </div>
              <div className="mb-3">
                <strong>Email: </strong> <span>{formData.email}</span>
              </div>
            </div>
            <Link
              onClick={handleSignOut}
              className="btn btn-success btn-block mt-4"
            >
              Sign Out
            </Link>
          </div>
        </div>
    </>
  );
}