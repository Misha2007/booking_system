import "./App.css";
import Home from "./components/home/Home";
import Header from "./components/Header";
import LoginBlock from "./components/login/LoginBlock";
import Search from "./components/search/Search"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginBlock />} />
          <Route path="/search" element={<Search />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
