import React, { useState } from "react";
import "./Search.css";

const sampleData = [
  {
    id: 1,
    type: "hotel",
    title: "Carolina Hotel",
    price: 50,
    stars: 3.2,
    image: "https://www.carolina.ee/photos/Fassaad%20%202009.jpg?1389297182377",
  },
  {
    id: 2,
    type: "tour",
    title: "Mountain Adventure",
    description: "Explore the breathtaking mountains.",
    image:
      "https://www.zicasso.com/static/f0a152d1bc93dc1a7b2fd97679e949b2/304cc/f0a152d1bc93dc1a7b2fd97679e949b2.jpg",
  },
  // Add more sample items as needed
];

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(sampleData);

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);

    const filtered = sampleData.filter((item) =>
      item.title.toLowerCase().includes(value.toLowerCase())
    );
    setResults(filtered);
  };

  return (
    <div>
      {/* Header Section */}
      <div className="search-container">
        <h1 className="search-header">Let's travel the world</h1>
        <p className="header-subtitle">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        <div className="search-wrapper">
          <input
            type="text"
            value={query}
            onChange={handleSearch}
            placeholder="Search for hotels or tours..."
            className="search-input"
          />
          <i className="fa fa-search search-icon"></i>
        </div>
      </div>

      {/* Hero Section with Images inside Search Bar */}
      <section className="hero-section">
        <div className="hero-images">
          <div className="hero-image hero-image-one" style={{ backgroundImage: "url('https://s3-alpha-sig.figma.com/img/87b0/5230/67d5d8b7fa690f0090fbcebd031e4f77?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=ShjCWcN~3YCef-1IKT4xGElXe7g6FU4ixOgmIGqSh2aC8QpgSnz7M1NHZKlJtyVciFBm~JvUO0Qbm3zpR-oLMHz94SYgyRKDtXKgiqW0N4vJWf-mYhflVty6duLzbS2irzWjJ~cEPCrJTbaocyeQNmrhgG--ZSyWFJ6g61y0RiWHvgZeU13~Yj-v1GxFKRB4TDB82gpNLr92yA5ghW5PnPk3k2PVRaBxLuuHQ240gjYlZ8R7KiOQFoo2vF3Cs5c7I5QZyTmaeiNEnFpdCyWAZvkOX1Cb1et5tWUJl7iNVKXMdUKZ1IKxBnI~jxzJ0JvmFSj3jE-AsMqX3q3Y9AaQ~A__')" }}></div>
          <div className="hero-image hero-image-two" style={{ backgroundImage: "url('https://s3-alpha-sig.figma.com/img/6daf/653e/72b50d7dd0ccdedd14c442c0d9b86dfd?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=rdVcwAeHyBKKYwgXvyHmOXekgNlTZB1y3WwUxDXaDXfPzLArjcBkDQ6xHyXnaZHajE-oYQO21h7~yJO89OXppYXh8KgxKNcn2vKvTKhghLHJMfip-shYCv4fRG4oTuLPtWkHLp8AqwxZPsz1YKShTJ8QrpaJD0hEyZubnd9eeImYJuZkRun-44u9JntOGa9QhyrXOO7t61GAWqlykUWVSM1~AUmyCxpQV~JhjZzfeXFqkkG59W9nmMEAbOwMnPV66hFtIuTcjJ579kf-93moocEyfwc154tD3WJakWrpUcHRt~n-tNA~7pI6dMqLpMYx2n61NusfesAiRwDXF444Rw__')" }}></div>
          <div className="hero-image hero-image-three" style={{ backgroundImage: "url('https://s3-alpha-sig.figma.com/img/b72e/667c/66e83f8008b1e0a9042e4fcc2c1396e4?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=jmTiKvn332OlqXJGIv3-fBOhEX31LpbE1vGsd~Cq5OcfKkc11cwlGxAXTX9FUKr2JFixj8NGbo2qy7qryZPreywAutsiN1Of3p7KBXq~haie2sIC-l0ymsoHYnSj4K2P7IzaSHunf82Br4Zs3~qD7QslZcdyCO3yPVd0Zoje2icphhNO5oYfhY-qFeu2dSyXDwA9mv4Pn1577CkAmOOOBd4roFVwurzruF8LstWtvZrkjnEIQiCbB2MLJuWZxgFbnSKwQNngv-u3-eIksAcI7I28t8GfrdS61PPMJEHMjVqL0RSJglO5NTgdYbLa8RM4kWuZo5GOnitXFZUT5hY7zg__')" }}></div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="popular-destinations">
        <h2>Popular Destinations</h2>
        <div className="destinations">
          {results.map((item) => (
            <div key={item.id} className="destination-card">
              <img src={item.image} alt={item.title} />
              <h3>{item.title}</h3>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Search;