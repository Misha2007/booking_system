import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import data_file from "../data.json";
import "./Users.css";

function Users() {
  const [clients, setClients] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const storedToken = localStorage.getItem("authToken");

  const nameInputRef = useRef();
  const lastNameInputRef = useRef();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const passwordConfInputRef = useRef();
  const numberInputRef = useRef();
  const roleSelectRef = useRef();

  useEffect(() => {
    if (!storedToken) {
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `http://${data_file.ip}:${data_file.port}/user/admin/getAllUsers`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          if (
            response.status === 401 &&
            errorData.message &&
            errorData.message.toLowerCase().includes("expired")
          ) {
            localStorage.removeItem("authToken");
            navigate(
              "/login" +
                (errorData.message ? `?error=${errorData.message}` : "")
            );
            return;
          }
          return;
        }

        const data = await response.json();
        setClients(data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUserData();
  }, [navigate, storedToken]);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const sumbitHandler = async (event) => {
    event.preventDefault();

    const name = nameInputRef.current.value.trim();
    const lastName = lastNameInputRef.current.value.trim();
    const email = emailInputRef.current.value.trim();
    const number = numberInputRef.current.value.trim();
    const password = passwordInputRef.current.value;
    const confirmPassword = passwordConfInputRef.current.value;
    const role = roleSelectRef.current.value;

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    const payload = {
      name,
      lastName,
      email,
      number,
      password,
      role,
    };

    try {
      const response = await fetch(
        `http://${data_file.ip}:${data_file.port}/user/admin/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert("User created successfully.");
        navigate("/");
      } else {
        alert(result.message || "Failed to create user.");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Server error.");
    }
  };

  return (
    <section className="dsa" id="login-block">
      <div className="login-container">
        <h2 id="login_title">Create account</h2>
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
              <i className="fa fa-user"></i>
              <input
                type="text"
                id="lastName"
                name="name"
                placeholder=" "
                ref={lastNameInputRef}
              />
              <label htmlFor="lastName">Lastname</label>
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
              <i className="fa fa-envelope"></i>
              <input
                type="number"
                id="number"
                name="number"
                placeholder=" "
                ref={numberInputRef}
                onInput={(e) => {
                  e.target.value = e.target.value.slice(0, 10);
                }}
              />
              <label htmlFor="number">Phonenumber</label>
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

            <div className="input-container">
              <i className="fa fa-user" style={{ cursor: "pointer" }}></i>
              <select name="roles" id="roles" ref={roleSelectRef} required>
                <option value="client">Client</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button type="submit" className="login_button">
              Create account
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Users;
