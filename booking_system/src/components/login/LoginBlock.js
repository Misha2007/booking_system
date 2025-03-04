import Login from "./Login";
import { useState } from "react";
import Register from "./Register";

const LoginBlock = () => {
  const [login, setLogin] = useState(true);

  const toggleLogin = () => {
    setLogin((prev) => !prev);
  };

  const addUserHandler = (user) => {
    const addUser = async (user) => {
      try {
        console.log(JSON.stringify(user));
        const response = await fetch("http://localhost:3001/user/new-user", {
          method: "POST",
          body: JSON.stringify(user),
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log("sad");
        console.log(response);
        if (!response.ok) {
          throw new Error("Failed adding user");
        }
      } catch (error) {
        console.log(error);
        // setError({
        //   title: "An error occurred",
        //   message: "Failed to add expense, please try again later.",
        // });
        // setShowError(true);
      }
    };
    addUser(user);
  };

  return (
    <section className="dsa">
      <div className="login-container">
        <h2 id="login_title">{login ? "Login" : "Register"}</h2>
        {login ? (
          <Login></Login>
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
