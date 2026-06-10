import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { voteActions } from "../store/vote-slice";

const Login = () => {
  const [error, setError] = useState("");
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    password: "",
    password2: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  // function to change controlled inputs
  const changeInputHandler = (e) => {
    setUserData((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  };

  const loginVoter = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/voters/login`,
        userData
      );
      const newVoter = await response.data;
      // save new voter in local storage and update in redux store
      localStorage.setItem("currentUser", JSON.stringify(newVoter));
      dispatch(voteActions.changeCurrentVoter(newVoter));
      navigate("/results");
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  return (
    <section className="register">
      <div className="container register__container">
        <h2>Sign In</h2>
        <form onSubmit={loginVoter}>
          {error && <p className="form__error-message">{error}</p>}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            autoComplete="true"
            onChange={changeInputHandler}
            autoFocus
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="true"
            onChange={changeInputHandler}
          />

          <p>
            Don't have an account? <Link to="/register">Sign up</Link>
          </p>
          <button type="submit" className="btn primary">
            Login
          </button>
        </form>
      </div>
    </section>
  );
};

export default Login;
