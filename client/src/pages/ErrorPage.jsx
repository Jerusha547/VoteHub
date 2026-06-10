import React, { useEffect } from "react";
import Image from "../assets/404.gif";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(-1);
    }, 6000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <section className="errorPage">
      <div className="errorpage__contaniner">
        <img src={Image} alt="Page not found" />
        <h1>404</h1>
        <p>
          This page does not exist. You will be redirected to the previous page
          shortly.
        </p>
      </div>
    </section>
  );
};

export default ErrorPage;
