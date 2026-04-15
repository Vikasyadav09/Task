import React, { useState } from "react";
import { Col, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import API from "./services/api";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/login", form);

      alert(res.data.message || "Login Successful");

      // 👉 success redirect
      navigate("/");
    } catch (err) {
      console.log(err);
      alert("Login Failed");
    }
  };

  return (
    <Container className="mt-5">
      <Col lg={4} className="mx-auto">
        <div className="card p-4 shadow">
          <h3 className="text-center mb-3">Login</h3>

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label">Email address</label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Enter email"
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Password"
                onChange={handleChange}
              />
            </div>

            <div className="form-check mb-3">
              <input type="checkbox" className="form-check-input" />
              <label className="form-check-label">Remember me</label>
            </div>

            <button type="submit" className="btn btn-primary w-100 mb-2">
              Sign In
            </button>

            <Link to="/signup" className="btn btn-secondary w-100">
              Signup
            </Link>
          </form>
        </div>
      </Col>
    </Container>
  );
}
