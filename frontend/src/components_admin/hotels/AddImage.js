import data_file from "../../data.json";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./AdminHotel.css";
import { ImageConfig } from "./ImageConfig";
import "./AddImage.css";

function AddImage(props) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [imageTarget, setImageTarget] = useState("hotel");
  const storedToken = localStorage.getItem("authToken");
  const wrapperRef = useRef(null);
  const [fileList, setFileList] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const hotel = props.hotel;
  // const [image_url, setImage_url] = useState("");

  const onDragEnter = () => wrapperRef.current.classList.add("dragover");
  const onDragLeave = () => wrapperRef.current.classList.remove("dragover");
  const onDrop = () => wrapperRef.current.classList.remove("dragover");

  const onFileChange = (files) => {
    console.log(files);
  };

  const onFileDrop = (e) => {
    const newFile = e.target.files[0];
    if (newFile) {
      const updatedList = [...fileList, newFile];
      setFileList(updatedList);
      onFileChange(updatedList);
    }
  };

  const fileRemove = (file) => {
    const updatedList = [...fileList];
    updatedList.splice(fileList.indexOf(file), 1);
    setFileList(updatedList);
    onFileChange(updatedList);
  };

  useEffect(() => {
    if (!storedToken) {
      navigate("/login");
    }
  }, []);

  const handleRoomChange = (e) => {
    setSelectedRoomId(e.target.value);
  };

  const handleImageTargetChange = (e) => {
    setImageTarget(e.target.value);
  };

  useEffect(() => {
    if (imageTarget === "room" && hotel?.roomInfos?.length > 0) {
      setSelectedRoomId(hotel.roomInfos[0].id);
    }
  }, [imageTarget, hotel]);

  const handleAddImage = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const uploadPromises = fileList.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", data_file.unsignedUploadPreset);

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${data_file.cloudName}/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await res.json();
        if (!data.secure_url) {
          throw new Error("Failed to upload file: " + file.name);
        }

        const payload = {
          imageUrl: data.secure_url,
          target: imageTarget,
          hotelId: hotel.hotelId,
        };
        if (imageTarget === "room") {
          payload.roomInfoId = selectedRoomId;
        }

        return fetch(`http://${data_file.ip}:${data_file.port}/images/upload`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
          body: JSON.stringify(payload),
        });
      });

      const results = await Promise.all(uploadPromises);
      const failed = results.filter((res) => !res.ok);

      setLoading(false);
      if (failed.length > 0) {
        alert("Some images failed to upload.");
      } else {
        alert("All images uploaded successfully!");
        setFileList([]);
      }
    } catch (error) {
      console.error("Batch upload error:", error);
      alert("An error occurred while uploading.");
      setLoading(false);
    }
  };

  return (
    <form id="image-upload" onSubmit={handleAddImage}>
      <div
        ref={wrapperRef}
        className="drop-file-input"
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <div className="drop-file-input__label">
          <p>Drag & Drop your files here</p>
        </div>
        <input type="file" onChange={onFileDrop} />
      </div>
      {fileList.length > 0 ? (
        <div className="drop-file-preview">
          <p className="drop-file-preview__title">Ready to upload</p>
          {fileList.map((item, index) => (
            <div key={index} className="drop-file-preview__item">
              <img src={URL.createObjectURL(item)} alt={item.name} />
              <div className="drop-file-preview__item__info">
                <p>{item.name}</p>
              </div>
              <span
                className="drop-file-preview__item__del"
                onClick={() => fileRemove(item)}
              >
                x
              </span>
            </div>
          ))}
        </div>
      ) : null}
      {/* <div className="room field">
        <label>Image url:</label>
        <input
          type="text"
          value={image_url}
          onChange={(e) => setImage_url(e.target.value)}
        />
      </div> */}
      <div className="field">
        <label>Hotel Name:</label>
        <select value={hotel.name} onChange={() => {}}>
          <option value={hotel.name}>{hotel.name}</option>
        </select>
      </div>
      <div className="field">
        <label>Choose Image Target:</label>
        <select value={imageTarget} onChange={handleImageTargetChange}>
          <option value="hotel">Hotel</option>
          <option value="room">Room</option>
        </select>
      </div>
      {imageTarget === "room" && (
        <div className="field">
          <label>Select Room:</label>
          <select onChange={handleRoomChange} value={selectedRoomId}>
            <option value="" disabled>
              Select a room
            </option>
            {hotel.roomInfos.map((room) => (
              <option key={room.id} value={room.id}>
                {room.room.roomType} - {room.room.roomName}
              </option>
            ))}
          </select>
        </div>
      )}
      <div>
        <button type="submit">Submit</button>
      </div>
    </form>
  );
}

export default AddImage;
