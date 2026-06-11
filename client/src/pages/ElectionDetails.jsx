import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoAddOutline } from "react-icons/io5";
import ElectionCandidate from "../components/ElectionCandidate";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../store/ui-slice";
import AddCandidateModal from "../components/AddCandidateModal";
import axios from "axios";
import { voteActions } from "../store/vote-slice";

const ElectionDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [election, setElection] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [voters, setVoters] = useState([]);

  const addCandidateModalShowing = useSelector(
    (state) => state.ui.addCandidateModalShowing,
  );
  const token = useSelector((state) => state?.vote?.currentVoter?.token);
  const isAdmin = useSelector((state) => state?.vote?.currentVoter?.isAdmin);

  // FIXED ACCESS CONTROL: Checking token safely inside lifecycle
  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  const getElection = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/elections/${id}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setElection(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getCandidates = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/elections/${id}/candidates`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setCandidates(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getVoters = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/elections/${id}/voters`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setVoters(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteElection = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/elections/${id}`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/elections");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (token) {
      getElection();
      getCandidates();
      getVoters();
    }
  }, [id, token]);

  const openModal = () => {
    dispatch(uiActions.openAddCandidateModal());
    dispatch(voteActions.changeAddCandidateElectionId(id));
  };

  return (
    <>
      <section className="electionDetails">
        <div className="container electionDetails__container">
          <h2>{election.title}</h2>
          <p>{election.description}</p>

          {/* Integrated CSS layout patch directly into the banner image container */}
          <div
            className="electionDetails__image"
            style={{ width: "100%", height: "15rem", overflow: "hidden" }}
          >
            <img
              src={election.thumbnail}
              alt={election.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
          </div>

          <menu className="electionDetails__candidates">
            {candidates.map((candidate) => (
              <ElectionCandidate key={candidate._id} {...candidate} />
            ))}
            {isAdmin && (
              <button className="add__candidate-btn" onClick={openModal}>
                <IoAddOutline />
              </button>
            )}
          </menu>

          <menu className="voters">
            <h2>Voters</h2>
            <table className="voters__table">
              <thead>
                <tr>
                  <th> Full Name </th>
                  <th> Email Address </th>
                  <th> Time </th>
                </tr>
              </thead>
              <tbody>
                {voters.map((voter) => (
                  <tr key={voter._id}>
                    <td>
                      <h5>{voter.fullName}</h5>
                    </td>
                    <td>{voter.email}</td>
                    <td>{voter.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </menu>
          {isAdmin && (
            <button className="btn danger full" onClick={deleteElection}>
              Delete Election
            </button>
          )}
        </div>
      </section>
      {addCandidateModalShowing && <AddCandidateModal />}
    </>
  );
};

export default ElectionDetails;
