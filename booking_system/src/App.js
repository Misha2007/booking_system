import "./App.css";
import Home from "./components/home/Home";
import Header from "./components/Header";
import Login from "./components/login/Login";

function App() {
  return (
    <div className="App">
      <Header></Header>
      <Home></Home>
      <Login></Login>
    </div>
  );
}

export default App;
