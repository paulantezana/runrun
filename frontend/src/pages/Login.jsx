import { useState } from "react";
import authService from "shared/services/authService";
import { SESSION_KEY } from "core/setting";
import useAuthStore from "store/useAuthStore";

const Login = () => {
  const { setUser } = useAuthStore();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let response = null;
      if(isRegister){
        const responseUp = await authService.signUp({ email, name: email, password });
        response = await authService.signIn({ email__eq: email, password });
      } else {
        response = await authService.signIn({ email__eq: email, password });
      }

      setUser(response.user_info);
      localStorage.setItem(SESSION_KEY, JSON.stringify({
        user: response.user_info,
        token: response.access_token,
        expiration: response.expiration
      }));
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="login">
      <h2>{isRegister ? "Registro" : "Iniciar Sesión"}</h2>

      <form className="SnForm" onSubmit={handleSubmit}>
        <div className="SnForm-item required">
          <label htmlFor="email" className="SnForm-label">
            Nombre de usuario
          </label>
          <div className="SnControl-wrapper">
            <i className="far fa-user SnControl-prefix"></i>
            <input
              type="text"
              className="SnForm-control SnControl"
              required
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nombre de usuario"
            />
          </div>
        </div>
        <div className="SnForm-item required">
          <label htmlFor="password" className="SnForm-label">
            Contraseña
          </label>
          <div className="SnControl-wrapper">
            <i className="fas fa-key SnControl-prefix"></i>
            <input
              type="password"
              className="SnForm-control SnControl"
              required
              id="password"
              placeholder="Contraseña"
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className="SnControl-suffix far fa-eye togglePassword"></span>
          </div>
        </div>
        <button
          type="submit"
          className="SnBtn block primary lg radio"
          id="loginFormSubmit"
        >
          <i className="fas fa-sign-in-alt SnMr-2"></i>
          {isRegister ? "Regístrate" : "Iniciar sesión"}
        </button>
      </form>

      <p onClick={() => setIsRegister(!isRegister)}>
        {isRegister
          ? "¿Ya tienes cuenta? Inicia sesión"
          : "¿No tienes cuenta? Regístrate"}
      </p>
    </div>
  );
};

export default Login;
