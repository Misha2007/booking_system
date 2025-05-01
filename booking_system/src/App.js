import "./App.css";
import Home from "./components/home/Home";
import Header from "./components/Header";
import LoginBlock from "./components/login/LoginBlock";
import Search from "./components/search/Search";
import Account from "./components/account/Account";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Countries from "./components/countries/Countries";
import Result from "./components/countries/Result";
import Hotel from "./components/hotels/Hotel";
import NotFound from "./components/UI/NotFound";
// import PaymentPage from "./components/payment/PaymentPage";
// import { loadStripe } from "@stripe/stripe-js";
// import data_file from "./data.json";
import PaymentWrapper from "./components/payment/PaymentWrapper";
import SuccessfulPage from "./components/payment/SuccesssfulPage";

// const stripePromise = loadStripe(data_file.PUBLIC_KEY);

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginBlock />} />
          <Route path="/search" element={<Search />} />
          <Route path="/account" element={<Account />} />
          <Route path="/contries" element={<Countries />} />
          <Route path="/result/:countryName" element={<Result />} />
          <Route path="/hotel/:hotelId" element={<Hotel />} />
          <Route path="*" element={<NotFound />} />
          {/* <Route path="/payment" element={<PaymentPage />} /> */}
          <Route path="/payment" element={<PaymentWrapper />} />
          <Route path="/payment-success" element={<SuccessfulPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
