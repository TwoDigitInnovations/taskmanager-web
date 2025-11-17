/* eslint-disable react-hooks/exhaustive-deps */
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useRef, createRef, useEffect, useContext } from "react";
import { IoList, IoChevronBack, IoCloseCircleOutline } from "react-icons/io5";
import { FaAngleRight } from "react-icons/fa6";


import { IoLogOut } from "react-icons/io5";


import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Paper, { PaperProps } from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { RiOrganizationChart } from "react-icons/ri";
import Toggle from './Toggle/index'

//import Draggable from 'react-draggable';

// import {
//   BrowserView,
//   MobileView,
//   isBrowser,
//   isMobile,
// } from "react-device-detect";
import * as rdd from "react-device-detect";
import { Context, userContext } from "@/pages/_app";
import Constants from "@/src/services/constant";
import { ConfirmProvider, useConfirm } from "./confirmationModal";
import LoadingScreen from "./LodingScreen";
import api, { setApiToken } from "@/src/services/lib/api";
import Cookies from "js-cookie";
import { getAuthToken, getData, setAuthToken, setData } from "@/src/services/lib/storage";
import { Api } from "@/src/services/service";

const menuItems = [
  {
    href: "/home",
    title: "Dashbord",
    // icon: "/home1.png",
    img: 'dashboard',
    activeIcon: "/home.png",
    access: ["USER", "ORG", "ADMIN", "PROVIDER"],
    sub: false,
  },
  // {
  //   href: "/organization/organization",
  //   title: "Organization",
  //   icon: "/home1.png",
  //   activeIcon: "/home.png",
  //   access: ["ADMIN"],
  //   sub: false,
  // },
  {
    href: "/tasks/task",
    title: "Tasks",
    icon: "/home1.png",
    activeIcon: "/home.png",
    access: ["USER", "ORG", "ADMIN", "PROVIDER"],
    sub: false,
  },
  {
    href: "/clients/clientsList",
    title: "Clients",
    icon: "/home1.png",
    activeIcon: "/home.png",
    access: ["USER", "ORG", "ADMIN"],
    sub: false,
  },
  {
    href: "/projects/projectlist",
    title: "Projects",
    icon: "/home1.png",
    activeIcon: "/home.png",
    access: ["USER", "ORG", "ADMIN", "PROVIDER"],
    sub: false,
  },
  {
    href: "/note",
    title: "My Notes",
    icon: "/privacy.png",
    activeIcon: "/privacy1.png",
    access: ["PROVIDER", "ADMIN"],
    sub: false,
  },
  {
    href: "/guardList",
    title: "Developers",
    icon: "/security.png",
    activeIcon: "/security1.png",
    access: ["USER", "ORG", "ADMIN"],
    sub: false,
  },
  // {
  //   href: "/history",
  //   title: "History",
  //   icon: "/History.png",
  //   activeIcon: "/History1.png",
  //   access: ["USER", "ORG", "ADMIN"],
  // },
  {
    href: "/report",
    title: "Reports",
    icon: "/privacy.png",
    activeIcon: "/privacy1.png",
    access: ["ADMIN", "PROVIDER"],
    sub: false,
  },
  {
    href: "/holidays",
    title: "Holidays",
    icon: "/privacy.png",
    activeIcon: "/privacy1.png",
    access: ["ADMIN", "PROVIDER"],
    sub: false,
  },

  // {
  //   href: "/billing",
  //   title: "Billing",
  //   icon: "/privacy.png",
  //   activeIcon: "/privacy1.png",
  //   access: ["USER", "ORG", "ADMIN"],
  // },
  // {
  //   title: "Financials",
  //   icon: "/privacy.png",
  //   sub: true,
  //   active: false,
  //   activeIcon: "/privacy1.png",
  //   access: ["USER", "ORG", "ADMIN"],
  //   list: [
  //     {
  //       href: "/billing2",
  //       title: "Billing",
  //       icon: "/privacy.png",
  //       activeIcon: "/privacy1.png",
  //       access: ["USER", "ORG", "ADMIN"],
  //     },
  //     {
  //       href: "/payroll",
  //       title: "Payroll",
  //       icon: "/privacy.png",
  //       activeIcon: "/privacy1.png",
  //       access: ["ADMIN"],
  //     },
  //   ]
  // },
  // {
  //   href: "/archive",
  //   title: "Archive Invoices",
  //   icon: "/privacy.png",
  //   activeIcon: "/privacy1.png",
  //   access: ["ORG", "ADMIN"],
  // },
  // {
  //   href: "/notification",
  //   title: "Notification ",
  //   icon: "/notification1.png",
  //   activeIcon: "/notification.png",
  // },
  {
    href: "/editProfile",
    title: "Edit profile",
    icon: "/privacy.png",
    activeIcon: "/privacy1.png",
    access: ["ORG"],
    sub: false,
  },
  {
    href: "/setting",
    title: "Settings",
    icon: "/user.png",
    activeIcon: "/user1.png",
    access: ["ORG"],
    sub: false,
  },
  // {
  //   href: "/festaevent",
  //   title: "Festa Events",
  //   icon: "/user.png",
  //   activeIcon: "/user1.png",
  //   access: ["USER", "ORG", "ADMIN"],
  // },
];

const Layout = ({ children, loader, toaster, organization }) => {
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [pageShow, setPageShow] = useState(false);
  const [orgList, setOrgList] = useState([]);
  const [userDetail, setUserDetail] = useState({});
  const [initial, setInitial] = useContext(Context);
  const [user, setUser] = useContext(userContext);
  const [userName, setUserName] = useState("ADMIN");
  const [menulist, setMenulist] = useState(menuItems)
  const router = useRouter();
  const { confirm } = useConfirm();
  const [isAuth, setIsuAth] = useState(true);

  const [open, setOpen] = useState(false);
  const [organizationOpen, setOrganizationOpen] = useState(false);

  useEffect(() => {
    console.log('hello')
    getUserDetail()
  }, [])

  const handleClickOpen = async () => {
    const result = await confirm("Logout", "Do you really want to logout?", {});
    if (result.confirm) {
      router.push("/");
      localStorage.clear();
      setUser({});
      setToggleDrawer(true)
      setInitial({});
    }
  };


  const handleClose = () => {
    setOpen(false);
    setOrganizationOpen(false);
  };

  useEffect(() => {
    setMobile(rdd.isMobile);
    if (rdd.isBrowser) {
      setToggleDrawer(true);
    }
    getUserDetail();
  }, [mobile]);



  const getUserDetail = async () => {
    console.log(isAuth)
    // setIsuAth(true);
    const user = await getData('userdetail');
    console.log(user)
    if (user) {
      const token = await getAuthToken();
      setApiToken(token);
      console.log(token)
      try {
        const res = await api.get('me');
        setTimeout(() => {
          setIsuAth(false);
        }, 5000);
        if (res.status) {
          setApiToken(res.data.token);
          setAuthToken(res.data.token);
          setUser(res.data);
          setUserDetail(res.data)
          await setData('userdetail', res.data);

          if (router.route === "/") {
            router.push("/home");
          }
        } else {
          setToast({ type: "success", message: res?.message });
        }
      } catch (error) {
        setTimeout(() => {
          setIsuAth(false);
        }, 5000);
        if (router.route !== "/" && router.route !== "/signup") {
          router.push("/");
        }
        toaster({ type: "error", message: error.message });
        console.log(error);
      }
      // Api("get", "me", "", router).then(
      //   async (res) => {

      //     if (res?.status) {
      //       localStorage.setItem("userDetail", JSON.stringify(res.data));
      //       setUser(res.data);
      //       setUserDetail(res.data)

      //     } else {
      //       setToast({ type: "success", message: res?.message });
      //     }
      //   },
      //   (err) => {
      //     setTimeout(() => {
      //       setIsuAth(false);
      //     }, 1000);
      //     toaster({ type: "error", message: err.message });
      //     console.log(err);
      //   }
      // );
    } else {
      setTimeout(() => {
        setIsuAth(false);
      }, 5000);
      if (router.route !== "/" && router.route !== "/signup") {
        router.push("/");
      }
    }
  };

  useEffect(() => {
    getusername();
    router.events.on("routeChangeComplete", () => {
      setMenulist(menuItems)
    });
    setMenulist(menuItems)
  }, [user, initial]);

  const getOrg = () => {
    loader(true);
    Api("get", "organizations", "", router).then(
      async (res) => {
        loader(false);
        // ;
        if (res?.status) {
          let d = [{ _id: '', username: 'ADMIN' }, ...res.data.users]
          setOrgList(d);
        } else {
          toaster({ type: "success", message: res?.message });
        }
      },
      (err) => {
        loader(false);
        toaster({ type: "error", message: err.message });
        console.log(err);
      }
    );
  };

  const getusername = () => {
    if (user.type !== "ADMIN") {
      setUserName(user.username);
    } else if (user.type === "ADMIN") {
      if (!!initial) {
        setUserName(initial.username);
      }
    }
    if (user.type === "ADMIN" && initial.username === undefined) {
      setUserName("ADMIN");
    }
  };

  return (
    <>
      <LoadingScreen isLoading={isAuth} />

      {!isAuth && <div className={`md:min-h-screen flex sm:flex-1 flex-col ${isAuth ? "opacity-0" : "opacity-100 transition-opacity duration-500"}`}>

        {router.route !== "/" && router.route !== "/signup" && (
          <header
            className={`bg-[var(--mainColor)] fixed top-0 w-full h-16 flex  font-semibold uppercase  z-30 ${toggleDrawer && user?.id !== "6450e9bef4d2cc08c2ec0431"
              ? "ml-60"
              : "ml-0"
              }`}
          >
            <div className="flex justify-center items-center  ">
              {/* {mobile && ( */}
              <IoList
                className="text-[var(--white)] h-8 w-8 mx-5"
                onClick={() => {
                  setToggleDrawer(!toggleDrawer);
                }}
              />
              {/* )} */}
              <div
                className={`flex-1  justify-center items-center ${toggleDrawer ? "hidden md:flex" : "flex"
                  }`}
              >
                <div className="md:h-12 md:w-12 h-8 w-8 relative ml-0 md:ml-10  ">
                  <Image
                    src={user?.profile || "/images.png"}
                    alt="icon"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-full"
                  ></Image>
                </div>
                <h2 className="md:text-base text-sm text-[var(--white)] font-semibold ml-2 uppercase ">
                  {userName}

                </h2>
                {!!user && user.type === "ADMIN" && (
                  <div
                    className="ml-5 h-7 w-7 flex justify-center items-center bg-[var(--white)] rounded-md"
                    onClick={() => {
                      setOrganizationOpen(true);
                      getOrg();
                    }}
                  >
                    <RiOrganizationChart className="text-[var(--mainColor)] text-xl" />
                  </div>
                )}
              </div>

              <div
                className={`flex-2  fixed right-5 justify-end ${toggleDrawer ? "hidden md:flex" : "flex"
                  }`}
              >
                <div className="flex items-center">
                  <button
                    className=" flex  justify-between items-center cursor-pointer border-2 border-[var(--white)] px-2 rounded-sm"
                    onClick={handleClickOpen}
                  >
                    <p className="md:text-base text-sm text-white font-semibold mt-0.5 capitalize py-2">
                      Signout
                    </p>
                    <div className="mx-2    flex items-center justify-center item-center border-[var(--white)]">
                      <IoLogOut className="md:h-8 md:w-8 text-[var(--white)]" />

                    </div>

                  </button>
                </div>
              </div>
            </div>
          </header>
        )}
        {router.route !== "/" &&
          router.route !== "/signup" &&
          toggleDrawer &&
          user?.id !== "6450e9bef4d2cc08c2ec0431" && (
            /*bg-stone-800*/
            <aside
              className={`bg-[var(--mainColor)] w-60 fixed  min-h-screen z-40 border-r-2 border-[var(--mainColor)]`}
            >
              <div className=" w-full justify-center text-center border-b-4 border-[var(--mainColor)]">
                <Image
                  src="/2digit/04.png"
                  width="180"
                  height="180"
                  alt="icon"
                  layout="fixed"
                  className=" w-fit h-fit"
                ></Image>
              </div>

              <nav>
                <ul>
                  {menulist.map((item) => (
                    <div key={item.title} className={`${router.asPath === item.href && 'bg-[var(--customYellow)] hover:bg-[var(--customYellow)] '}`} >

                      {!item.sub && <div className="hover:bg-[var(--customYellow)]" >
                        {item?.access?.includes(user?.type) && (
                          <li
                            className="py-4  flex  px-5 border-b-2 border-[var(--white)] align-middle group"
                            onClick={() => {
                              router.push(item.href);
                              setMenulist([...menulist])
                              if (mobile) {
                                setToggleDrawer(!toggleDrawer);
                              }
                            }}
                          >
                            <Link href={item.href}>
                              <p
                                className={`flex ml-2 font-bold group-hover:text-[var(--mainColor)] cursor-pointer text-md ${router.asPath === item.href
                                  ? "text-[var(--mainColor)]"
                                  : "text-white"
                                  }`}
                              >
                                {item.title}
                              </p>
                            </Link>
                            <div className=" flex-1 flex justify-end">
                              <FaAngleRight className={`text-xl  group-hover:text-[var(--mainColor)] ${router.asPath === item.href
                                ? "text-[var(--mainColor)]"
                                : "text-white"}`} />
                            </div>
                          </li>
                        )}


                      </div>}

                      {item.sub && <div className="border-b-2 border-stone-800 " >
                        {item?.access?.includes(user?.type) && (
                          <li
                            className={`py-5  flex  px-5  border-stone-800 align-middle   ${item.active && 'bg-[var(--customGray)] '}`}

                            // className={`py-2  flex  px-5  border-stone-800 align-middle }`}
                            onClick={() => {
                              item.active = !item.active;
                              setMenulist([...menulist])
                            }}
                          >

                            {/* {Constants[item?.title.replace(' ', '')](item.active ? '#FB1913' : '#ffffff', 18)} */}
                            <div>
                              <a
                                className={`flex ml-2 font-bold hover:text-white cursor-pointer text-md ${item.active
                                  ? "text-[var(--mainColor)]"
                                  : "text-white"
                                  }`}
                              >
                                {item.title}
                              </a>
                            </div>
                            <div className="text-right flex-1 ">
                              <FaAngleRight className={`text-xl  group-hover:text-[var(--mainColor)] ${router.asPath === item.href
                                ? "text-[var(--mainColor)]"
                                : "text-black"}`} />
                            </div>
                          </li>
                        )}
                        {item?.active && item?.list.map((submenu, inx) => (<div key={inx} >
                          {item?.access?.includes(user?.usertype) && (
                            <li
                              className={`py-2  flex  px-5  border-stone-800 align-middle  bg-[var(--customGray)] ${router.asPath === submenu.href && 'bg-[var(--customGray)] '}`}
                              onClick={() => {
                                router.push(submenu.href);
                                // if (mobile) {
                                // setToggleDrawer(!toggleDrawer);
                                // }
                              }}
                            >
                              {/* <div className="justify-center align-middle ">
                              <Image
                                src={
                                  router.asPath === item.href
                                    ? item.activeIcon
                                    : item.icon
                                }
                                width="15"
                                height="15"
                                alt="icon"
                                layout="fixed"
                              ></Image>
                            </div> */}
                              <Link href={submenu.href}>
                                <p
                                  className={`flex ml-2 font-bold hover:text-white cursor-pointer text-sm ${router.asPath === submenu.href
                                    ? "text-[var(--mainColor)]"
                                    : "text-white"
                                    }`}
                                >
                                  {submenu.title}
                                </p>
                              </Link>
                              <div className="text-right flex-1 ">
                                <Image
                                  src={
                                    router.asPath === submenu.href
                                      ? "/fwd-red.png"
                                      : "/fwd-white.png"
                                  }
                                  width="8"
                                  height="15"
                                  alt="icon"
                                  layout="fixed"
                                ></Image>
                              </div>
                            </li>
                          )}
                        </div>))}
                      </div>}
                    </div>

                  ))}
                </ul>
              </nav>
            </aside>
          )}
        <div className="flex flex-col md:flex-row z-0 h-screen">
          <main
            className={
              router.route !== "/" &&
                router.route !== "/signup" ?
                toggleDrawer &&
                  user?.id !== "6450e9bef4d2cc08c2ec0431"
                  ? " md:pl-60 md:w-full  md:pt-16"
                  : mobile ? 'flex-1 pt-16' : "flex-1 md:pt-16" : 'flex-1  md:pt-0'
            }
          >
            {/* {pageShow ? children : loader(true)} */}
            {children}
            {/* <ConfirmProvider>{children}</ConfirmProvider> */}
          </main>
        </div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="draggable-dialog-title"
        >
          <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
            Alert
          </DialogTitle>
          <DialogContent>
            <DialogContentText>Do you want to logout ?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                router.push("/");
                localStorage.clear();
                setOpen(false);
                setUser({});
                setToggleDrawer(true)
                setInitial({});
              }}
            >
              Logout
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={organizationOpen} onClose={handleClose}>
          <div className="px-5 pt-20 pb-5 border-2  border-[var(--mainColor)] bg-[var(--mainColor)] relative overflow-hidden w-80">
            <IoCloseCircleOutline
              className="text-[var(--mainColor)] h-8 w-8 absolute right-2 top-2"
              onClick={handleClose}
            />
            <p className="text-white text-lg font-semibold">Devlopers</p>
            <select
              className="w-full bg-white text-black border-2 border-[var(--mainColor)] rounded-md p-2 mt-2 outline-none"
              value={JSON.stringify(initial)}
              onChange={(text) => {
                setInitial(JSON.parse(text.target.value));
                handleClose();
              }}
            >
              <option value={JSON.stringify({})}>Select</option>
              {orgList.map((item) => (
                <option value={JSON.stringify(item)} key={item._id}>
                  {item.username}
                </option>
              ))}
            </select>
          </div>
        </Dialog>
      </div>}
    </>

  );
};

export default Layout;
