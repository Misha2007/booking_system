import Login from "./Login";
import { useState } from "react";
import Register from "./Register";

const LoginBlock = () => {
  const [login, setLogin] = useState(true);

  const toggleLogin = () => {
    setLogin((prev) => !prev);
  };

  return (
    <section className="dsa">
      <div className="login-container">
        <h2 id="login_title">{login ? "Login" : "Register"}</h2>
        {login ? <Login></Login> : <Register></Register>}
        <p>
          {login ? "Haven’t signed in yet?" : "Already have an account?"}{" "}
          <a onClick={toggleLogin}>{login ? "Register" : "Login"}</a>
        </p>
      </div>
    </section>
  );
};
export default LoginBlock;
