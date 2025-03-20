import Login from "./Login";
import { useState } from "react";
import Register from "./Register";
import { useNavigate } from "react-router-dom";
import Error from "../UI/Error";

const LoginBlock = () => {
  const [login, setLogin] = useState(true);
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const toggleLogin = () => {
    setLogin((prev) => !prev);
  };

  const handleCloseError = () => {
    setError(null);
  };

  const addUserHandler = (user) => {
    const addUser = async (user) => {
      try {
        console.log(JSON.stringify(user));
        const response = await fetch("http://localhost:3002/user/new-user", {
          method: "POST",
          body: JSON.stringify(user),
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log("sad");
        console.log(response);
        if (!response.ok) {
          const errorMessage = await response.text();
          setError({
            title: "Problems with backend",
            message: errorMessage || "Invalid email or password.",
          });
          return;
        }
        console.log(error);
      } catch (error) {
        console.log(error);
        setError({
          title: "Server Unreachable",
          message: "Failed to add user, please try again later.",
        });
        return;
      }
    };
    addUser(user);
  };

  const loginUserHandler = (user) => {
    console.log("it is working");

    const getUser = async (user) => {
      console.log("it is working");

      try {
        console.log(JSON.stringify(user));
        const response = await fetch("http://localhost:3002/user/login", {
          method: "POST",
          body: JSON.stringify(user),
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log("sad");
        console.log(response);

        if (!response.ok) {
          const errorMessage = await response.text();
          setError({
            title: "An error occurred",
            message: errorMessage || "Invalid email or password.",
          });
          return;
        }
        navigate("/account");
      } catch (error) {
        console.log(error);
        setError({
          title: "Server Unreachable",
          message: "Failed to add user, please try again later.",
        });
      }
    };
    getUser(user);
  };

  return (
    <section className="dsa">
      {error && (
        <Error
          title={error.title}
          message={error.message}
          onConfirm={handleCloseError}
        />
      )}
      <div className="login-container">
        <h2 id="login_title">{login ? "Login" : "Register"}</h2>
        {login ? (
          <Login onLoginUser={loginUserHandler}></Login>
        ) : (
          <Register onAddUser={addUserHandler}></Register>
        )}
        <p>
          {login ? "Haven’t signed in yet?" : "Already have an account?"}{" "}
          <a onClick={toggleLogin}>{login ? "Register" : "Login"}</a>
        </p>
      </div>
    </section>
  );
};
export default LoginBlock;
