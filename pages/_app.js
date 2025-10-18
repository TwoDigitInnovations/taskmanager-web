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
import { Api } from "@/src/services/service";
import Link from "next/link";
import Head from "next/head";
import { ConfirmProvider } from "@/components/confirmationModal";


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
      setOpen(true);
      Api("get", "me", "", router).then(
        async (res) => {
          setOpen(false);
          if (res?.status) {
            localStorage.setItem("userDetail", JSON.stringify(res.data));
            setUser(res.data);

          } else {
            setToast({ type: "success", message: res?.message });
          }
        },
        (err) => {
          setOpen(false);
          setToast({ type: "error", message: err.message });
          console.log(err);
        }
      );
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
      <Head>
        <link rel="icon" href='https://2digitinnovations.com/icon/2digitinnovations_logo1.png' />
      </Head>


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
          <ConfirmProvider>
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
          </ConfirmProvider>
        </Context.Provider>
      </userContext.Provider>
    </>
  );
}

export default MyApp;
