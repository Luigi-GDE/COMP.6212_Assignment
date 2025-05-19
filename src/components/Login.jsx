import { useState } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });
    if (error) {
      setError("Login failed: " + error.message);
    } else {
      navigate("/admin");
    }
  };

  return (
    <section className="login-page">
      <div className="login-center-container">
        <div className="login-card-wrapper">
          <form className="login-form" onSubmit={handleSubmit}>
            <label>
              Email:
              <input type="email" name="email" value={form.email} onChange={handleChange} required />
            </label>
            <label>
              Password:
              <input type="password" name="password" value={form.password} onChange={handleChange} required />
            </label>
            <button type="submit">Login</button>
            {error && <div className="error">{error}</div>}
          </form>
        </div>
      </div>
    </section>
  );
}