import "./Login.css";

const Login = () => {
  return (
    <section className="dsa">
      <div className="login-container">
        <h2 id="login_title">Login</h2>
        <form>
          <div className="form-group">
            <div className="input-container">
              <input
                type="text"
                id="username"
                name="username"
                placeholder=" "
                required
              />
              <label htmlFor="username">Username</label>
            </div>
            <div className="input-container">
              <input
                type="password"
                id="password"
                name="password"
                placeholder=" "
                required
              />
              <label htmlFor="password">Password</label>
            </div>
            <div>
              <div>
                <input type="checkbox" id="remember_me" name="remember_me" />
                <label htmlFor="remember_me"> Remember me</label>
              </div>
              <a href="#">Forgot password?</a>
            </div>
            <button type="submit" className="login_button">
              Login
            </button>
          </div>
        </form>

        <p>
          Haven’t signed in yet? <a href="#">Register</a>
        </p>
      </div>
    </section>
  );
};

export default Login;
