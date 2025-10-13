/* eslint-disable react-hooks/exhaustive-deps */
import "../styles/globals.css";
import "../styles/Home.module.css";
import "@fullcalendar/common/main.css";
// import "@fullcalendar/daygrid/main.css";
// import "@fullcalendar/timegrid/main.css";
// import "@fullcalendar/timeline/main.css";
import "react-advanced-datetimerange-picker/dist/style/DateTimeRange.css";


import { useEffect, useState, createContext } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Layout from "@/components/layouts";
import Loader from "@/components/loader";
import Toaster from "@/components/toaster";
import Script from "next/script";
import OneSignal from 'react-onesignal';


// const Phaser = dynamic(() => import("@ion-phaser/react"), { ssr: false });

export const Context = createContext();
export const userContext = createContext();

function MyApp({ Component, pageProps }) {
  const [initial, setInitial] = useState({});
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState({});
  const [pageURL, setPageURL] = useState("");
  const [isNativeShare, setNativeShare] = useState(false);
  const [toast, setToast] = useState({
    type: "",
    message: "",
  });

  const router = useRouter();
  // useEffect(async () => (window.Phaser = await import(`phaser`)), []);

  useEffect(() => {
    setOpen(open);
  }, [open]);

  // useEffect(() => {
  //   setPageURL(window.location.href);
  //   if (navigator.share) {
  //     setNativeShare(true);
  //   }
  // }, []);

  useEffect(() => {
    setToast(toast);
    if (!!toast.message) {
      setTimeout(() => {
        setToast({ type: "", message: "" });
      }, 5000);
    }
  }, [toast]);

  useEffect(() => {
    getUserDetail();
  }, []);

  const getUserDetail = () => {
    const user = localStorage.getItem("userDetail");
    if (!!user) {
      setUser(JSON.parse(user));

      // if (JSON.parse(user)?.id === "6450e9bef4d2cc08c2ec0431") {
      //   router.push("/festaevent");
      // } else {
      //   if (router.route === "/") {
      // router.push("/home");
      //   }
      // }
      // if (router.route === "/") {
      //   if (JSON.parse(user).type === "PROVIDER") {
      //     // router.push("tasks/task");
      //     router.push("home");
      //   } else if (JSON.parse(user).type === "ADMIN") {
      //     router.push("home");
      //   } else {
      //     props.toaster({ type: "error", message: "You have not access this portal" });
      //   }
      // } else {
      //   // if (JSON.parse(user).type === "PROVIDER") {
      //   //   let paths = ['/tasks/task', '/projects/projectlist', '/home']
      //   //   if (!paths.includes(router.asPath)) {
      //   //     router.push("home");
      //   //     // router.push("tasks/task");
      //   //   }
      //   // }
      // }
      // if (router.route === "/") {
      // router.replace("/home");
      // }
    } else {
      if (router.route !== "/" && router.route !== "/signup") {
        router.push("/");
      }
    }
  };

  useEffect(() => {
    // Ensure this code runs only on the client side
    if (typeof window !== 'undefined') {
      OneSignal.init({
        appId: '816afcdf-9739-4852-9f10-43035ecb17d2',
        // You can add other initialization options here
        notifyButton: {
          enable: true,
        }
      });
    }
  }, []);

  return (
    <>


      {/* <Script
        async
        src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
      ></Script>
      <Script
        id="gtag"
        dangerouslySetInnerHTML={{
          __html: `  window.OneSignalDeferred = window.OneSignalDeferred || [];
            OneSignalDeferred.push(async function(OneSignal) {
              await OneSignal.init({
                appId: "816afcdf-9739-4852-9f10-43035ecb17d2",
              });
            });`,
        }}
      /> */}

      <userContext.Provider value={[user, setUser]}>
        <Context.Provider value={[initial, setInitial]}>
          <Loader open={open} />
          <div className="fixed right-5 top-10 min-w-max z-50">
            {!!toast.message && (
              <Toaster type={toast.type} message={toast.message} />
            )}
          </div>
          <Layout loader={setOpen} toaster={setToast}>
            <Loader open={open} />

            <Component
              {...pageProps}
              loader={setOpen}
              toaster={setToast}
              organization={initial}
              user={user}
            />
          </Layout>
        </Context.Provider>
      </userContext.Provider>
    </>
  );
}

export default MyApp;
