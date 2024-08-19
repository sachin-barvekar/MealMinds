import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import HeroSection from "../components/HeroSection";

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await fetch("/api/v1/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        throw new Error(data.message || "Failed to sign up.");
      }

      setError(null);
      alert("User Created Successfully");
      navigate("/sign-in");
    } catch (error) {
      setLoading(false);
      setError(
        error.message || "An error occurred while signing up. Please try again."
      );
    }
  };

  return (
    <>
      <HeroSection title="Sign Up" />
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <button
                disabled={loading}
                className="btn btn-success w-100"
                type="submit"
              >
                {loading ? "Loading..." : "Sign Up"}
              </button>
            </form>
            <div className="text-center mt-3">
              <p>
                Already have an account?{" "}
                <Link to="/sign-in" className="text-muted">
                  Sign in
                </Link>
              </p>
            </div>
            {error && <div className="alert alert-success mt-3">{error}</div>}
          </div>
        </div>
      </div>
    </>
  );
}
