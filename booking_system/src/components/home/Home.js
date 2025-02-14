import "./Home.css";
import Tours from "./Tours";

const Home = () => {
  return (
    <div>
      <div className="container">
        <h1>Booking system</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </div>
      <div id="motion-demo">
        <img
          src="https://images.vexels.com/media/users/3/242810/isolated/preview/faf4f5ad02d6d68cfeafa44e1b57649a-plane-semi-flat.png"
          alt="Flying Plane"
          className="animated-plane"
        />
      </div>
      <div>
        <Tours></Tours>
      </div>
    </div>
  );
};

export default Home;
