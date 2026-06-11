import React from "react";
import { IoMdTrash } from "react-icons/io";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ElectionCandidate = ({ fullName, image, motto, _id: id }) => {
  const navigate = useNavigate();

  const token = useSelector((state) => state?.vote?.currentVoter?.token);
  // Extracted isAdmin status from Redux state to toggle visibility
  const isAdmin = useSelector((state) => state?.vote?.currentVoter?.isAdmin);

  const deleteCandidate = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/candidates/${id}`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate(0);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <li className="electionCandidate">
      {/* Inline styles applied as safe backup for the card image constraints */}
      <div
        className="electionCandidate__image"
        style={{ width: "100%", height: "15rem", overflow: "hidden" }}
      >
        <img
          src={image}
          alt={fullName}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            objectPosition: "bottom center",
          }}
        />
      </div>
      <div>
        <h5>{fullName}</h5>
        <small>
          {motto?.length > 70 ? motto.substring(0, 70) + "..." : motto}
        </small>
        {/* Render trash can button only if user is logged in as an administrator */}
        {isAdmin && (
          <button className="electionCandidate__btn" onClick={deleteCandidate}>
            <IoMdTrash />
          </button>
        )}
      </div>
    </li>
  );
};

export default ElectionCandidate;
