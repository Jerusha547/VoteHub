import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { uiActions } from "../store/ui-slice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddCandidateModal = () => {
  const [fullName, setFullName] = useState("");
  const [motto, setMotto] = useState("");
  const [image, setImage] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  //close add candidate modal
  const token = useSelector((state) => state?.vote?.currentVoter?.token);
  const electionId = useSelector(
    (state) => state?.vote?.addCandidateElectionId
  );
  const closeModal = () => {
    dispatch(uiActions.closeAddCandidateModal());
  };

  const addCandidate = async (e) => {
    try {
      e.preventDefault();
      const candidateInfo = new FormData();
      candidateInfo.set("fullName", fullName);
      candidateInfo.set("motto", motto);
      candidateInfo.set("image", image);
      candidateInfo.set("currentElection", electionId);
      await axios.post(
        `${process.env.REACT_APP_API_URL}/candidates`,
        candidateInfo,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );
      navigate(0);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="modal">
      <div className="modal__content">
        <header className="modal__header">
          <h4>Add Candidate</h4>
          <button className="modal__close" onClick={closeModal}>
            <IoMdClose />
          </button>
        </header>
        <form onSubmit={addCandidate}>
          <div>
            <h6>Candidate Name:</h6>
            <input
              type="text"
              value={fullName}
              name="fullName"
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div>
            <h6>Candidate Motto:</h6>
            <input
              type="motto"
              value={motto}
              name="fullName"
              onChange={(e) => setMotto(e.target.value)}
            />
          </div>
          <div>
            <h6>Candidate Image:</h6>
            <input
              type="file"
              name="image"
              onChange={(e) => setImage(e.target.files[0])}
              accept="png, jpg, jpeg, webp, avif"
            />
          </div>
          <button type="submit" className="btn primary">
            Add Candidate
          </button>
        </form>
      </div>
    </section>
  );
};

export default AddCandidateModal;
