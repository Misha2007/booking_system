import "./Register.css";
import { useState, useRef } from "react";

const Register = (props) => {
  const [error, setError] = useState(null);

  const nameInputRef = useRef();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const passwordConfInputRef = useRef();
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const errorHandler = () => {
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
      id: Math.random().toString(),
    };
    props.onAddUser(userData);
  };

  const sumbitHandler = (event) => {
    const enteredName = nameInputRef.current.value;
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    const enteredPasswordConf = passwordConfInputRef.current.value;
    const rememberMeValue = rememberMe;
    event.preventDefault();

    if (
      enteredName.trim().length == 0 ||
      enteredEmail.trim().length == 0 ||
      enteredPassword.trim().length == 0 ||
      enteredPasswordConf.trim().length == 0
    ) {
      console.log(enteredPasswordConf);
      console.log(enteredPassword);
      setError({
        title: "Invalid input",
        message:
          "Please enter a valid name or email or password (non-empty values)",
      });
      return;
    }

    if (enteredPasswordConf != enteredPassword) {
      setError({
        title: "Invalid input",
        message: "Your passwords are not matching. Please try again.",
      });
      return;
    }

    const expenseData = {
      name: enteredName,
      email: enteredEmail,
      password: enteredPassword,
    };

    console.log(expenseData);
    saveUserDataHandler(expenseData);
    nameInputRef.current.value = "";
    emailInputRef.current.value = "";
    passwordInputRef.current.value = "";
    passwordConfInputRef.current.value = "";
  };

  return (
    <form onSubmit={sumbitHandler}>
      <div className="form-group">
        <div className="input-container">
          <i className="fa fa-user"></i>
          <input
            type="text"
            id="user"
            name="name"
            placeholder=" "
            required
            ref={nameInputRef}
          />
          <label htmlFor="name">Name</label>
        </div>

        <div className="input-container">
          <i className="fa fa-envelope"></i>
          <input
            type="email"
            id="email"
            name="email"
            placeholder=" "
            required
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
            required
            ref={passwordInputRef}
          />
          <label htmlFor="password">Password</label>
        </div>
        <div className="input-container">
          <i
            className={`fa ${showPassword ? "fa-unlock" : "fa-lock"}`}
            onClick={togglePasswordVisibility}
            style={{ cursor: "pointer" }}
          ></i>
          <input
            type={showPassword ? "text" : "password"}
            id="passwordConfirm"
            name="password"
            placeholder=" "
            required
            ref={passwordConfInputRef}
          />
          <label htmlFor="password">Confirm Password</label>
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
          <a>Forgot password?</a>
        </div>

        <button type="submit" className="login_button">
          Login
        </button>
      </div>
    </form>
  );
};

export default Register;
