import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserDataContext } from "../context/UserContext";



const UserSignup = () => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [userData, setUserData] = useState({});

  const navigate = useNavigate();

  const { user, setUser } = useContext(UserDataContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    const newUser = {
      fullname: {
        firstname: firstname,
        lastname: lastname,
      },
      email: email,
      password: pass
    };
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, newUser)

    if (response.status === 201) {
      const data = response.data;
      setUser(data.user);
      localStorage.setItem('token', data.token)
      navigate("/Tripform");
    }

    setEmail("");
    setFirstname("");
    setLastname("");
    setPass("");
  };


  return (
    <div className="p-7 h-screen flex flex-col justify-between">
      <div>
        <img
          className=" w-20 mb-10"
          src="https://imgs.search.brave.com/76mmh10uQydO5wRM5Uaxyu2Efx1lReMlQiA6l_B_mDw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzA1LzQxLzA5Lzkz/LzM2MF9GXzU0MTA5/OTMwN19tQWFWaFlY/WjdJS2pEcmF5dFJq/cVdMYlNwME9ub3gy/aS5qcGc"
          alt="IMG"
        />

        <form
          onSubmit={(e) => {
            submitHandler(e);
          }}
        >
          <h3 className="text-lg font-medium mb-1">Enter your Name</h3>
          <div className="flex gap-2 mb-3">
            <input
              required
              value={firstname}
              onChange={(e) => {
                setFirstname(e.target.value);
              }}
              className="bg-[#eeeeee] w-1/2 rounded px-4 py-1 border text-lg placeholder:text-sm"
              type="text"
              placeholder="First-name"
            />
            <input
              required
              value={lastname}
              onChange={(e) => {
                setLastname(e.target.value);
              }}
              className="bg-[#eeeeee] w-1/2 rounded px-4 py-2 border text-lg placeholder:text-sm"
              type="text"
              placeholder="Last-name"
            />
          </div>

          <h3 className="text-lg font-medium mb-1">Enter your Email</h3>
          <input
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            className="bg-[#eeeeee] mb-5 rounded px-4 py-2 border text-lg placeholder:text-sm w-full"
            type="email"
            placeholder="email@example.com"
          />
          <h3 className="text-lg font-medium mb-1">Enter Password</h3>
          <input
            required
            value={pass}
            onChange={(e) => {
              setPass(e.target.value);
            }}
            className="bg-[#eeeeee] mb-5 rounded px-4 py-2 border text-lg placeholder:text-sm w-full"
            type="password"
            placeholder="Password"
          />

          <button className="bg-[#111111] text-white mb-3 rounded px-4 py-2 border text-lg  w-full">
            Create Account
          </button>
        </form>
        <p className=" text-center">
          Already have an Account?..
          <Link to={"/login"} className="text-blue-500">
            Login Here
          </Link>
        </p>
      </div>
      <div>
        <p className="text-[8px] leading-tight">
          By proceeding you accept our{" "}
          <span className="text-blue-600 underline"> Terms & Conditions </span>
          ,you consent to get calls,WhatsApp or SMS, including automated means,
          from Uber and its affiliates to the number provided
        </p>
      </div>
    </div>
  );
};

export default UserSignup;
