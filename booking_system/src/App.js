import logo from "./logo.svg";
import "./App.css";
import Home from "./components/home/Home";
import Header from "./components/Header";

function App() {
  return (
    <div className="App">
      <Header></Header>
      <Home></Home>
    </div>
  );
}

export default App;
