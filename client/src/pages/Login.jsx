
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

function Login() {
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";
  
  // Кнопка активна, якщо обидва поля непорожні
  const isFormValid = nickname.trim() !== "" && password.trim() !== "";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) return; // Додатково захист, хоча кнопка і заблочена

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
      alert("Невірний нікнейм або пароль");
    }
  };

  return (
    <div className="auth-container">
      <h2>Авторизація</h2>
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
        <button type="submit" disabled={!isFormValid}>
          Увійти
        </button>
      </form>
      <p>
        Ще не маєте акаунта?{" "}
        <Link to="/register" className="auth-link">
          Зареєструватися
        </Link>
      </p>
    </div>
  );
}

export default Login;
