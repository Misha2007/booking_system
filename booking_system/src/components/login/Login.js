import "./Login.css";
import { useState, useRef } from "react";
import Error from "../UI/Error";

const Login = (props) => {
  const [error, setError] = useState(null);

  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleCloseError = () => {
    setError(null);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleRememberMe = () => {
    setRememberMe((prev) => !prev);
  };

  const saveUserDataHandler = (enteredUserData) => {
    const userData = {
      ...enteredUserData,
    };
    props.onLoginUser(userData);
  };

  const sumbitHandler = (event) => {
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    const rememberMeValue = rememberMe;
    event.preventDefault();

    if (enteredEmail.trim().length == 0 || enteredPassword.trim().length == 0) {
      setError({
        title: "Invalid input",
        message:
          "Please enter a valid title or amount or date (non-empty values)",
      });
      return;
    }

    const expenseData = {
      email: enteredEmail,
      password: enteredPassword,
    };

    console.log(expenseData);
    saveUserDataHandler(expenseData);
  };

  return (
    <form onSubmit={sumbitHandler}>
      {error && (
        <Error
          title={error.title}
          message={error.message}
          onConfirm={handleCloseError}
        />
      )}
      <div className="form-group">
        <div className="input-container">
          <i className="fa fa-envelope"></i>
          <input
            type="email"
            id="email"
            name="email"
            placeholder=" "
            ref={emailInputRef}
          />
          <label htmlFor="email">Email</label>
        </div>

        <div className="input-container">
          <i
            className={`fa ${showPassword ? "fa-unlock" : "fa-lock"}`}
            onClick={togglePasswordVisibility}
            style={{ cursor: "pointer" }}
          ></i>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            placeholder=" "
            ref={passwordInputRef}
          />
          <label htmlFor="password">Password</label>
        </div>

        <div className="remember-container">
          <div>
            <input
              type="checkbox"
              id="remember_me"
              name="remember_me"
              onClick={toggleRememberMe}
            />
            <label htmlFor="remember_me">Remember me</label>
          </div>
          <a href="#">Forgot password?</a>
        </div>

        <button type="submit" className="login_button">
          Login
        </button>
      </div>
    </form>
  );
};

export default Login;
