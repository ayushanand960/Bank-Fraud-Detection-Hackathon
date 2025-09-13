import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import "./Home.css"; // for custom animations

const Home = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axiosInstance.get("/users/profile/");
                setUser(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchProfile();
    }, []);

    return (
        <div>
            {/* Hero Section */}
            <section className="hero d-flex align-items-center justify-content-center text-center">
                <div className="hero-content text-white">
                    <h1 className="display-4 animate__animated animate__fadeInDown">
                        Welcome to Bank Fraud Detection Mini System
                    </h1>
                    <h4 className="animate__animated animate__fadeInDown mt-2">
                        By <span style={{ color: "#FFD700" }}>PARA DUO</span>
                    </h4>
                    <p className="lead animate__animated animate__fadeInUp mt-3">
                        Build amazing solutions in hours. Innovate. Create. Win!
                    </p>
                    {/* {!user && (
                        <div className="mt-4 animate__animated animate__zoomIn">
                            <Link to="/login" className="btn btn-light btn-lg mx-2">
                                Login
                            </Link>
                            <Link to="/register" className="btn btn-outline-light btn-lg mx-2">
                                Register
                            </Link>
                        </div>
                    )} */}

                    <div className="mt-4 animate__animated animate__zoomIn text-center">
                        <Link to="/login" className="btn btn-light btn-lg mx-2">
                            Login
                        </Link>
                        <Link to="/register" className="btn btn-outline-light btn-lg mx-2">
                            Register
                        </Link>
                    </div>
                </div>

            </section>

            {/* Features Section */}
            <section className="container my-5">
                <h2 className="text-center mb-4">What We Can Do</h2>
                <div className="row text-center">
                    <div className="col-md-4 mb-3">
                        <div className="card p-3 shadow animate__animated animate__fadeInLeft">
                            <img
                                src="https://img.icons8.com/color/96/000000/code.png"
                                className="card-img-top mx-auto"
                                style={{ width: "80px" }}
                                alt="Build"
                            />
                            <div className="card-body">
                                <h5 className="card-title">Build Fast</h5>
                                <p className="card-text">
                                    Building ready-to-use frontend and backend setups.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 mb-3">
                        <div className="card p-3 shadow animate__animated animate__fadeInUp">
                            <img
                                src="https://img.icons8.com/color/96/000000/idea.png"
                                className="card-img-top mx-auto"
                                style={{ width: "80px" }}
                                alt="Innovate"
                            />
                            <div className="card-body">
                                <h5 className="card-title">Innovate</h5>
                                <p className="card-text">
                                    Implement creative solutions and impress the judges.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 mb-3">
                        <div className="card p-3 shadow animate__animated animate__fadeInRight">
                            <img
                                src="https://img.icons8.com/color/96/000000/trophy.png"
                                className="card-img-top mx-auto"
                                style={{ width: "80px" }}
                                alt="Win"
                            />
                            <div className="card-body">
                                <h5 className="card-title">Win Prizes</h5>
                                <p className="card-text">
                                    Showcase your solution and grab exciting rewards!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* User Info Section */}
            {/* {user && (
                <section className="container my-5">
                    <h3 className="text-center mb-3">Hello, {user.username}</h3>
                    <div className="card p-3 shadow">
                        <pre>{JSON.stringify(user, null, 2)}</pre>
                    </div>
                </section> */}
            {/* )} */}
        </div>
    );
};

export default Home;
