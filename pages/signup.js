import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { IoEyeSharp } from "react-icons/io5";
import { IoEyeOffSharp } from "react-icons/io5";
import { FaCircleRight, FaSquarePhone } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";

import {
  checkForEmptyKeys,
} from "../src/services/InputsNullChecker";
import { Api } from "../src/services/service";

const SignUp = (props) => {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [userDetail, setUserDetail] = useState({
    userName: "",
    email: "",
    password: "",
    isOrganization: "false",
    phone: "",
    // organization:''
  });

  const [organization, setOrganization] = useState("");

  const submit = () => {
    let { anyEmptyInputs } = checkForEmptyKeys(userDetail);
    if (anyEmptyInputs.length > 0) {
      setSubmitted(true);
      return;
    }

    if (userDetail.phone.length !== 10) {
      props.toaster({ type: "error", message: "Your Phone number is invalid" });
      return;
    }

    if (userDetail.isOrganization === "true" && organization === "") {
      setSubmitted(true);
      return;
    }

    if (userDetail) props.loader(true);
    const data = {
      username: userDetail.userName.toLowerCase(),
      email: userDetail.email.toLowerCase(),
      password: userDetail.password,
      // isOrganization: userDetail.isOrganization,
      phone: userDetail.phone,
      type: 'PROVIDER'
    };

    if (userDetail.isOrganization === "true" && organization !== "") {
      data.organization = organization;
    } else {
      data.fullName = organization;
    }

    Api("post", "signUp", data, router).then(
      (res) => {
        props.loader(false);
        if (res.status) {
          // router.push("/");
          props.getDevlopers()
          setUserDetail({
            email: "",
            password: "",
            userName: "",
            phone: "",
          });
        } else {
          props.toaster({ type: "error", message: res?.data?.message });
        }
      },
      (err) => {
        props.loader(false);
        console.log(err);
        props.toaster({ type: "error", message: err?.data?.message });
      }
    );
  };

  return (
    <div className="flex  bg-[var(--white)] justify-center items-center mt-10">
      <div className="border-2 rounded-3xl border-[var(--mainColor)] bg-[var(--mainColor)] md:p-7 p-5 sm:w-1.5 md:w-1/3  ">

        <div className="flex bg-[var(--white)] py-2 my-4 rounded-md  md:h-14 sm:h-10 w-64 md:min-w-full ">
          <div className="flex md:mx-4 mx-2.5 justify-center md:h-10 sm:h-8 items-center ">
            <div className="relative">
              <FaUserCircle className="text-4xl text-[var(--mainColor)]" />

            </div>
          </div>
          <input
            placeholder="User Name"
            className="bg-[var(--white)] outline-none pl-2 text-black text-xs md:text-base border-l-2 border-black md:h-10 h-5"
            value={userDetail.userName}
            onChange={(text) => {
              setUserDetail({ ...userDetail, userName: text.target.value });
            }}
          />
        </div>
        {submitted && userDetail.userName === "" && (
          <p className="text-red-700 mt-1">User name is required</p>
        )}
        <div className="flex bg-[var(--white)] py-2 my-4 rounded-md  md:h-14 sm:h-10 w-64 md:min-w-full ">
          <div className="flex md:mx-4 mx-2.5 justify-center md:h-10 sm:h-8 items-center ">
            <div className="relative">
              <MdEmail className="text-4xl text-[var(--mainColor)]" />

            </div>
          </div>
          <input
            placeholder='Email Address'
            className="bg-[var(--white)] outline-none pl-2 text-black text-xs md:text-base border-l-2 border-black md:h-10 h-5"
            value={userDetail.email}
            onChange={(text) => {
              setUserDetail({ ...userDetail, email: text.target.value });
            }}
          />
        </div>

        <div className="flex bg-[var(--white)] py-2 my-4 rounded-md  md:h-14 sm:h-10 min-w-full relative items-center w-64 md:min-w-full ">
          <div className="flex md:mx-4 mx-2.5  justify-center md:h-10 sm:h-8 items-center ">
            <div className="relative">
              <FaSquarePhone className="text-4xl text-[var(--mainColor)]" />

            </div>
          </div>
          <input
            type="number"
            placeholder="Phone"
            className="bg-[var(--white)] outline-none pl-2 text-black text-xs md:text-base border-l-2 border-black md:h-10 h-5 w-[81%]"
            value={userDetail.phone}
            onChange={(text) => {
              setUserDetail({ ...userDetail, phone: text.target.value });
            }}
          />
        </div>
        {submitted && userDetail.phone === "" && (
          <p className="text-red-700 mt-1">Phone number is required</p>
        )}

        <div className="flex bg-[var(--white)] py-2 my-4 rounded-md  md:h-14 sm:h-10 min-w-full relative items-center w-64 md:min-w-full ">
          <div className="flex md:mx-4 mx-2.5  justify-center md:h-10 sm:h-8 items-center ">
            <div className=" relative">
              <RiLockPasswordFill className="text-4xl text-[var(--mainColor)]" />
            </div>
          </div>
          <input
            placeholder="Password"
            type={showPass ? "text" : "password"}
            className="bg-[var(--white)] outline-none pl-2 text-black text-xs md:text-base border-l-2 border-black md:h-10 h-5"
            value={userDetail.password}
            onChange={(text) => {
              setUserDetail({ ...userDetail, password: text.target.value });
            }}
          />
          <div
            className="absolute right-3 "
            onClick={() => setShowPass(!showPass)}
          >
            <div className=" relative">

              {showPass ? <IoEyeSharp className="text-4xl text-[var(--mainColor)]" />
                :
                <IoEyeOffSharp className="text-4xl text-[var(--mainColor)]" />
              }
            </div>
          </div>
        </div>
        {submitted && userDetail.password === "" && (
          <p className="text-red-700 mt-1">Password is required</p>
        )}





        <div className=" mt-7 grid grid-cols-2 gap-8">
          <div className="items-start">
            <p className="text-white text-left md:text-3xl text-2xl font-semibold ">
              Add
            </p>
          </div>
          <div className="flex justify-end" onClick={submit}>
            <div className="relative">
              <FaCircleRight className="text-6xl text-[var(--customYellow)]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
