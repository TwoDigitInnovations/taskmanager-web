/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Api } from "@/src/services/service";
import Register from "./register";
import { MultiSelect } from "react-multi-select-component";
import { IoSearch, IoCalendar } from "react-icons/io5";
import CountUp from "react-countup";
import ProjectTable from "@/components/projects/projecttable";
import { userContext } from "../_app";
import AuthGuard from "../AuthGuard";

const ProjectsList = (props) => {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [jobID, setJobID] = useState("");
  const [repeat, setRepeat] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [opt, setOpt] = useState([]);
  const [selected, setSelected] = useState([]);
  // const [asignId, setAssignId] = useState([]);
  const [clientlist, setClientList] = React.useState([]);
  const [mainList, setMainList] = React.useState([]);
  const [clienID, setClientID] = useState("");
  const [clientData, setClientData] = useState({})
  const [user, setUser] = useContext(userContext)

  useEffect(() => {
    getClientList();
  }, []);

  const getClientList = () => {
    props.loader(true);
    let url = "project/GetAllProjectByORg";
    if (props?.organization?._id) {
      url = `provider/client?org_id=${props?.organization?._id}`;
    }
    Api("get", url, "", router).then(
      async (res) => {
        props.loader(false);
        if (res?.status) {
          setClientList(res.data);
          setMainList(res.data);
        } else {
          props.toaster({ type: "success", message: res?.message });
        }
      },
      (err) => {
        props.loader(false);
        props.toaster({ type: "error", message: err.message });
        console.log(err);
      }
    );
  };

  const searchList = async (text) => {
    if (text.length > 0) {
      const data = await mainList.filter((f) =>
        f.name.toLowerCase().includes(text.toLowerCase())
      );
      data.forEach((ele, index) => {
        ele.indexID = index + 1;
      });
      setClientList(data);
    } else {
      setClientList(mainList);
    }
  };

  const deleteClient = (id) => {
    props.loader(true);
    Api("delete", `provider/client/${id}`, "", router).then(
      async (res) => {
        props.loader(false);
        if (res?.status) {
          props.toaster({
            type: "success",
            message: "Client deleted successfully",
          });
          getClientList();
        } else {
          props.toaster({ type: "success", message: res?.message });
        }
      },
      (err) => {
        props.loader(false);
        props.toaster({ type: "error", message: err.message });
        console.log(err);
      }
    );
  };

  const goToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AuthGuard allowedRoles={["ADMIN", "PROVIDER"]}>
      <div className="min-h-screen  md:pt-3 overflow-x-auto bg-[var(--white)] ">
        {user.type === "ADMIN" && < div className="px-5 md:mt-0 mt-5">
          <div className="grid md:grid-cols-3 grid-col-1 gap-3">
            <div className="border-2  border-[var(--mainColor)]  border-t-[var(--customYellow)] border-t-4 relative flex justify-center    cursor-pointer" onClick={() => setClientList(mainList)} >
              <div className="bg-[var(--mainColor)] w-full flex justify-between items-center h-16 px-5">
                <p className="font-bold text-lg text-center text-white  px-3">Total Number of Client</p>
                <p className="text-[var(--customYellow)] md:text-3xl text-2xl font-bold text-center">
                  <CountUp end={mainList?.length || 0} />
                </p>
              </div>
            </div>
            <div className="border-2  border-[var(--mainColor)]  border-t-[var(--customYellow)] border-t-4    relative flex justify-center cursor-pointer" onClick={() => setClientList(clientData?.verified)}>
              <div className="bg-[var(--mainColor)] w-full flex justify-between items-center h-16 px-5">
                <p className="font-bold text-lg text-center text-white  px-3">Verified Client</p>
                <p className="text-[var(--customYellow)] md:text-3xl text-2xl font-bold text-center">
                  <CountUp end={clientData?.verified?.length || 0} />
                </p>
              </div>
            </div>

            <div className="border-2  border-[var(--mainColor)]  border-t-[var(--customYellow)] border-t-4   relative flex justify-center cursor-pointer" onClick={() => setClientList(clientData?.suspended)}>
              <div className="bg-[var(--mainColor)] w-full flex justify-between items-center h-16 px-5">
                <p className="font-bold text-lg text-center text-white  px-3">Suspended Client</p>
                <p className="text-[var(--customYellow)] md:text-3xl text-2xl font-bold text-center">
                  <CountUp end={clientData?.suspended?.length || 0} />
                </p>
              </div>
            </div>
          </div>
        </div>}
        <div className="md:px-5 px-3">
          {showForm && (
            <Register
              {...props}
              // router={router}
              setShowForm={setShowForm}
              getClientList={getClientList}
              setClientID={setClientID}
              clienID={clienID}
              router={router}
            />
          )}
          {!showForm && user.type === "ADMIN" && (
            <button
              // disabled={props?.organization?._id === undefined ? true : false}
              className="bg-[var(--mainColor)] text-white p-2 md:ml-0 ml-2 rounded-sm mt-3"
              onClick={() => {
                // if (
                //   props?.organization?._id === undefined &&
                //   props?.user?.type === "ADMIN"
                // ) {
                //   props.toaster({
                //     type: "warning",
                //     message: "Please select any organization",
                //   });
                //   return;
                // }
                if (!showForm) {
                  setClientID("");
                }
                setRepeat("Create New Task");
                setShowForm(!showForm);
              }}
            >
              Register New Projects
            </button>
          )}
        </div>
        <div className="px-5 overflow-visible mt-3">
          <div className="grid md:grid-cols-2 grid-cols-1 bg-[var(--mainColor)] p-3  border-t-4 border-[var(--customYellow)] ">
            <div>
              <p className="text-white font-bold md:text-3xl text-lg">
                Projects List
              </p>
            </div>
            <div className="flex items-center justify-end md:mt-0 mt-2 ">

              <input
                className="  rounded-md border-2 border-[var(--customYellow)] outline-none ml-2 text-black bg-[var(--white)] w-72 p-1.5 "
                onChange={(text) => {
                  searchList(text.target.value);
                }}
              />
              <div className="h-10 w-10 bg-[var(--customYellow)] rounded-md ml-3 flex justify-center items-center">
                <IoSearch className="text-black text-xl" />
              </div>
            </div>
          </div>

          <ProjectTable
            data={clientlist}
            setClientID={setClientID}
            setShowForm={setShowForm}
            deleteClient={deleteClient}
            goToTop={goToTop}
            {...props}
            getClientList={getClientList}
          />
        </div>

        {openDialog ? (
          <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
              <div className="relative w-auto my-6 mx-auto max-w-3xl">
                {/*content*/}
                <div className="border-0 rounded-md shadow-lg relative flex flex-col w-full bg-black outline-none focus:outline-none">
                  {/*header*/}
                  <div className="flex items-start justify-between p-5   rounded-t">
                    <h3 className="text-2xl font-semibold text-white">
                      Assign Job
                    </h3>
                  </div>
                  {/*body*/}
                  <div className="px-5 pt-5 pb-5 border-2  border-[var(--red-900)] bg-black relative  md:h-auto w-80">
                    <MultiSelect
                      options={opt}
                      value={selected}
                      onChange={(text) => {
                        setSelected(text);
                      }}
                      labelledBy="Select Staff"
                      ClearSelectedIcon
                    />
                  </div>
                  {/*footer*/}
                  <div className="flex items-center justify-end p-3  bg-black rounded-b">
                    <button
                      className="text-green-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => {
                        setOpenDialog(false);
                        assignJob();
                      }}
                    >
                      Assign
                    </button>
                    <button
                      className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => {
                        setOpenDialog(false);
                        setSelected([]);
                      }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        ) : null}
      </div>
    </AuthGuard>
  );
};

export default ProjectsList;
