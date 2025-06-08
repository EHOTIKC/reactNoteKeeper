
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

function Register() {
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Паролі не співпадають");
      return;
    }

    const response = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nickname, password }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("token", data.token);
      window.dispatchEvent(new Event("login"));
      navigate("/");
    } else {
      const error = await response.json();
      alert(error.message || "Щось пішло не так");
    }
  };

  const isFormValid = nickname.trim() !== "" && password !== "" && password === confirmPassword;

  return (
    <div className="auth-container">
      <h2>Реєстрація</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="text"
          placeholder="Нікнейм"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Повторіть пароль"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={!isFormValid}>
          Зареєструватися
        </button>
      </form>
      <p>
        Вже маєте акаунт?{" "}
        <Link to="/login" className="auth-link">
          Увійти
        </Link>
      </p>
    </div>
  );
}

export default Register;
