import { useEffect, useState } from "react";
import data_file from "../../data.json";
import "./Gallery.css";

function Gallery({ hotelId }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const storedToken = localStorage.getItem("authToken");
  const [activeMenu, setActiveMenu] = useState(null);

  const fetchImages = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://${data_file.ip}:${data_file.port}/images/get-by-hotelId/${hotelId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch images");
      const data = await response.json();
      setImages(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [hotelId]);

  const handleDelete = async (imageId) => {
    alert("Are you sure you want to delete this image?");
    try {
      const res = await fetch(
        `http://${data_file.ip}:${data_file.port}/images/delete/${imageId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to delete image");
      setImages((prev) => prev.filter((img) => img.id !== imageId));
      fetchImages();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSetCover = async (imageId) => {
    try {
      const res = await fetch(
        `http://${data_file.ip}:${data_file.port}/images/set-cover/${imageId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to set cover image");
      const updatedImages = images.map((img) => ({
        ...img,
        isCover: img.id === imageId,
      }));
      setImages(updatedImages);
      fetchImages();
    } catch (err) {
      alert(err.message);
    }
  };

  const toggleMenu = (imageId) => {
    setActiveMenu((prev) => (prev === imageId ? null : imageId));
  };

  return (
    <div className="gallery-admin">
      <h1>Gallery</h1>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
        <div className="gallery-grid">
          {images.map((image, index) => (
            <div className="gallery-item" key={index}>
              <div className="options">
                <i
                  className="fa fa-trash"
                  onClick={() => handleDelete(image.imageId)}
                  title="Delete"
                ></i>

                <i
                  className="fa fa-ellipsis-v"
                  onClick={() => toggleMenu(image.imageId)}
                  title="Options"
                ></i>

                {activeMenu === image.imageId && (
                  <div className="dropdown-menu">
                    {!image.isCover && (
                      <div
                        className="dropdown-option"
                        onClick={() => {
                          handleSetCover(image.imageId);
                          setActiveMenu(null);
                        }}
                      >
                        Set as cover image
                      </div>
                    )}
                    {image.isCover && (
                      <div className="dropdown-option disabled">
                        Set cover image
                      </div>
                    )}
                  </div>
                )}
              </div>

              <img
                className={image.isCover ? "cover-image" : ""}
                src={image.url}
                alt={`Hotel image ${index + 1}`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Gallery;
