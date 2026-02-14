
import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";
import {
  checkForEmptyKeys,
} from "../src/services/InputsNullChecker";
import { userContext } from "./_app";
import OneSignal from "react-onesignal";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { IoEyeSharp } from "react-icons/io5";
import { IoEyeOffSharp } from "react-icons/io5";
import { FaCircleRight } from "react-icons/fa6";
import api, { setApiToken } from "@/src/services/lib/api";
import { setAuthToken, setData } from "@/src/services/lib/storage";


export default function Home(props) {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [userDetail, setUserDetail] = useState({
    email: "",
    password: "",
  });
  const [user, setUser] = useContext(userContext);

  useEffect(() => {
    const user = localStorage.getItem("userDetail");
    if (!!user) {
      router.push("home");
    }
  }, [router]);

  const submit = async () => {

    // OneSignal.getUserId().then(id => console.log("OneSignal ID:", id));
    let { anyEmptyInputs } = checkForEmptyKeys(userDetail);
    if (anyEmptyInputs.length > 0) {
      setSubmitted(true);
      return;
    }
    props.loader(true);
    let data = {
      username: userDetail.email.toLowerCase(),
      password: userDetail.password,
    };
    let player_id = OneSignal.User.PushSubscription.id;
    let device_token = OneSignal.User.PushSubscription.token;
    if (player_id) {
      data.player_id = player_id;
      data.device_token = device_token
    }
    try {
      const res = await api.post('login', data);
      props.loader(false)
      console.log(res)
      if (res?.status) {
        setApiToken(res.data.token);
        setAuthToken(res.data.token)
        setData('userdetail', res.data)
        setUser(res.data);
        setUserDetail({
          email: "",
          password: "",
        });
        if (res.data.type === "PROVIDER") {
          // router.push("tasks/task");
          router.push("home");
        } else if (res.data.type === "ADMIN") {
          router.push("home");
        } else if (res.data.type === "CLIENT") {
          router.push("home");
        } else {
          props.toaster({ type: "error", message: "You have not access this portal" });
        }
      } else {
        props.toaster({ type: "error", message: res?.data?.message });
      }
    } catch (err) {
      props.loader(false);
      console.log(err);
      props.toaster({ type: "error", message: err?.data?.message });
      props.toaster({ type: "error", message: err?.message });
    }


    // Api("post", "login", data, router).then(
    //   (res) => {
    //     props.loader(false);


    //   },
    //   (err) => {

    //   }
    // );
  };

  return (
    <div className="flex min-h-screen bg-[var(--white)] justify-center items-center ">
      <div className="border-2 rounded-3xl border-[var(--mainColor)] bg-[var(--mainColor)] md:p-10 p-5 sm:w-1.5 md:w-1/3  ">
        <p className="text-white text-center md:text-4xl text-2xl font-semibold mb-10">
          Welcome
        </p>
        <div className="flex bg-[var(--white)] py-2 mt-4 rounded-md  md:h-14 sm:h-10 w-64 md:min-w-full ">
          <div className="flex md:mx-4 mx-2.5 justify-center md:h-10 sm:h-8 items-center ">
            <div className="relative">
              <MdEmail className="text-4xl text-[var(--mainColor)]" />

            </div>
          </div>
          <input
            placeholder="User Name"
            className="bg-[var(--white)] outline-none pl-2 text-black text-xs md:text-base border-l-2 border-black md:h-10 h-5"
            value={userDetail.email}
            onChange={(text) => {
              setUserDetail({ ...userDetail, email: text.target.value });
            }}
          />
        </div>
        {submitted && userDetail.email === "" && (
          <p className="text-[var(--mainColor)] mt-1">Email is required</p>
        )}

        <div className="flex bg-[var(--white)] py-2 mt-4 rounded-md  md:h-14 sm:h-10 min-w-full relative items-center w-64 md:min-w-full ">
          <div className="flex md:mx-4 mx-2.5  justify-center md:h-10 sm:h-8 items-center ">
            <div className=" relative">
              <RiLockPasswordFill className="text-4xl text-[var(--mainColor)]" />
            </div>
          </div>
          <input
            placeholder="Password"
            type={showPass ? "text" : "password"}
            className="bg-[var(--white)]s outline-none pl-2 text-black text-xs md:text-base border-l-2 border-black md:h-10 h-5"
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
          <p className="text-[var(--mainColor)] mt-1">Password is required</p>
        )}

        <div className=" mt-10 grid grid-cols-2 gap-8">
          <div className="items-start">
            <p className="text-white text-left md:text-4xl text-2xl font-semibold ">
              Sign in
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
}
