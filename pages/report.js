/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useMemo } from "react";

import { useRouter } from "next/router";
import ActivityList from "@/components/report/activityList";
import ActivityTable from "@/components/report/activityTable.";

import { Api } from "@/src/services/service";
import moment from "moment";
import { timeSince } from "@/src/services/service";

import AuthGuard from "./AuthGuard";
import Modal from "react-modal";
import { MultiSelect } from "react-multi-select-component";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    width: "50%",
    transform: "translate(-50%, -50%)",
    background: "black",
    borderRadius: "10px",
    // padding: "0px",
  },
};


const Report = (props) => {
  const router = useRouter();
  const [incidentList, setIncidentList] = useState([]);
  const [notificationList, setNotificationList] = useState([]);
  const [filterData, setfilterData] = useState([]);
  const [currentData, setCurrentData] = useState([]);
  const [activitytype, setActiVityType] = useState("All");
  const [page, setPage] = useState(1);
  const [title, setTitle] = useState('Incident')
  const [showForm, setShowForm] = useState(false);
  const [clientOpt, setClientOpt] = useState([]);
  const [selectClient, setSelectClient] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const limit = 10;
  useEffect(() => {
    getReport();
    // getNotification(page);
    getClientList()
  }, []);

  const [reportObj, setReportObj] = useState({
    project: '',
    details: ''
  })


  const columns = useMemo(
    () => [
      {
        Header: "Activity",
        Cell: ActivityList,
      },
    ],
    []
  );

  // useEffect(() => {
  //   if (activitytype === "All") {
  //     setfilterData(notificationList);
  //   } else {
  //     let d = [];
  //     if (activitytype === "Hour") {
  //       d = notificationList.filter(
  //         (f) =>
  //           f.time.includes("Min") ||
  //           f.time.includes("Hour") ||
  //           f.time.includes("Mins") ||
  //           f.time.includes("Hours") ||
  //           f.time.includes("1 Day")
  //       );
  //     }
  //     if (activitytype === "Day") {
  //       d = notificationList.filter(
  //         (f) =>
  //           f.time.includes("Min") ||
  //           f.time.includes("Hour") ||
  //           f.time.includes("Day") ||
  //           f.time.includes("Mins") ||
  //           f.time.includes("Hours") ||
  //           f.time.includes("Days") ||
  //           f.time.includes("1 Week")
  //       );
  //     }
  //     if (activitytype === "Week") {
  //       d = notificationList.filter(
  //         (f) =>
  //           f.time.includes("Min") ||
  //           f.time.includes("Hour") ||
  //           f.time.includes("Day") ||
  //           f.time.includes("Week") ||
  //           f.time.includes("Mins") ||
  //           f.time.includes("Hours") ||
  //           f.time.includes("Days") ||
  //           f.time.includes("Weeks") ||
  //           f.time.includes("1 Month")
  //       );
  //     }

  //     setfilterData(d);
  //   }
  // }, [activitytype]);

  const getReport = () => {
    props.loader(true);
    Api("post", "provider/getAllIncident", "", router).then(
      async (res) => {
        props.loader(false);
        if (res?.status) {
          res.data.incident.forEach((element) => {
            element.date = moment(element.createdAt).format(
              "DD/MM/yyyy hh:mm a"
            );
            element.name = element.posted_by.fullName;
          });

          setIncidentList(res.data.incident);
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

  const addReport = () => {
    if (reportObj.project === '' || reportObj.description === '') {
      setSubmitted(true)
      return
    }
    props.loader(true);
    Api("post", "provider/incident", reportObj, router).then(
      async (res) => {
        props.loader(false);
        if (res?.status) {
          setSubmitted(false)
          setShowForm(false)
          setReportObj({
            project: '',
            details: ''
          })
          getReport()
          props.toaster({ type: "success", message: res?.message });
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

  const updateReport = (id) => {
    // if (reportObj.project === '' || reportObj.description === '') {
    //   setSubmitted(true)
    //   return
    // }
    props.loader(true);
    const data = {
      status: 'Resolved'
    }
    Api("post", `provider/incident/${id}`, data, router).then(
      async (res) => {
        props.loader(false);
        if (res?.status) {
          // setSubmitted(false)
          // setShowForm(false)
          // setReportObj({
          //   project: '',
          //   details: ''
          // })
          getReport()
          props.toaster({ type: "success", message: res?.message });
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

  const getNotification = (p) => {
    // props.loader(true);
    // Api("post", "notificationPage", { page: p, limit }, router).then(
    //   async (res) => {
    //     props.loader(false);
    //     if (res?.status) {
    //       res?.data?.notifications?.forEach((ele) => {
    //         ele.time = timeSince(ele.createdAt);
    //         // if (ele?.invited_for?.status === "ACCEPTED") {
    //         //   ele.msg = `${
    //         //     ele?.message.split(" ")[0]
    //         //   } has accepted the below job.`;
    //         // }
    //         // if (ele?.message?.includes("applied")) {
    //         //   ele.msg = `${
    //         //     ele?.message.split(" ")[0]
    //         //   } has been selected for the below job.`;
    //         // }
    //         // if (ele?.invited_for?.status === "REJECTED") {
    //         //   ele.msg = `${ele?.message.split(" ")[0]} has rejected this job.`;
    //         // }
    //         // if (ele?.message?.includes("assigned")) {
    //         //   ele.msg = `${
    //         //     ele?.message.split(" ")[0]
    //         //   } has assigned a job to this person.`;
    //         // }
    //       });
    //       console.log(res?.data?.notifications)
    //       setNotificationList(res?.data?.notifications);
    //       setfilterData(res?.data?.notifications);
    //       setCurrentData(res?.data?.notifications)
    //     } else {
    //       props.toaster({ type: "success", message: res?.message });
    //     }
    //   },
    //   (err) => {
    //     props.loader(false);
    //     props.toaster({ type: "error", message: err.message });
    //     console.log(err);
    //   }
    // );
  };

  const getClientList = (client_id) => {
    props.loader(true);
    Api("get", 'project/GetAllProjectByORg', "", props.router).then(
      async (res) => {
        props.loader(false);
        if (res?.status) {
          let options = [];
          res.data.forEach((ele, index) => {
            options.push({
              label: ele.name,
              value: ele._id,
              disabled: false,

            });
            if (res.data.length === index + 1) {
              setClientOpt(options);
            }
          });
          if (client_id) {
            const singleData = res.data.find(f => f._id === client_id);
            setSelectClient([{
              label: singleData.name,
              value: singleData._id,
            }])
          }
          // setClientList(res.data.clients);
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

  const filterClock = (type) => {
    const clockin = notificationList.filter(f => f.message.toLowerCase().includes(type))
    setfilterData(clockin)
    // setActiVityType('')
  }

  const filterShiftreport = () => {
    const clockin = notificationList.filter(f => !f.message.toLowerCase().includes('clock in') && !f.message.toLowerCase().includes('clock out'))
    setfilterData(clockin)
    // setActiVityType('')
  }

  console.log(showForm)

  return (
    <AuthGuard allowedRoles={["ADMIN", "PROVIDER"]}>
      <div className="min-h-screen bg-black md:-mt-16 overflow-x-auto  pt-20">
        {/* < div className="px-5 md:pt-[89px] pt-5">
          <div className="grid md:grid-cols-3 grid-col-1 gap-3">
            <div className="border-2  border-[var(--customGray)]  border-t-red-700 border-t-4 relative flex justify-center cursor-pointer" >
              <div className="bg-[var(--customGray)] w-full flex justify-between items-center h-24 rounded-md px-5">
                <p className="font-bold text-lg text-center text-white  px-3"><span onClick={() => { filterClock('clock in'); setTitle('Clock In') }}>Clock in</span> / <span onClick={() => { filterClock('clock out'); setTitle('Clock Out') }}>Clock out</span></p>
               
              </div>
            </div>
            <div className="border-2  border-[var(--customGray)]  border-t-red-700 border-t-4    relative flex justify-center   cursor-pointer"  >
              <div className="bg-[var(--customGray)] w-full flex justify-between items-center h-24 rounded-md px-5">
                <p className="font-bold text-lg text-center text-white  px-3" onClick={() => { setTitle('Incident') }}>Incident Report</p>
            
              </div>
            </div>

            <div className="border-2  border-[var(--customGray)]  border-t-red-700 border-t-4   relative flex justify-center    cursor-pointer" >
              <div className="bg-[var(--customGray)] w-full flex justify-between items-center h-24 rounded-md px-5">
                <p className="font-bold text-lg text-center text-white  px-3" onClick={() => { filterShiftreport(); setTitle('Shift') }}>Shift Report</p>
          
              </div>
            </div>
          </div>
        </div> */}
        <div className="w-full flex justify-end pr-5">
          <button
            // disabled={props?.organization?._id === undefined ? true : false}
            className="bg-red-700 text-white p-2 rounded-sm w-40 "
            onClick={() => {
              setShowForm(true)
            }}
          >
            {/* {showForm ? "Close" : "Create New Task"} */}
            Create Report
          </button>
        </div>
        {title !== 'Incident' && <div className="pt-5 ">
          <div className="grid md:grid-cols-2 grid-cols-1 bg-stone-900 md:px-5 p-4 border-x  border-t-[5px] border-red-700 md:mx-5 m mx-5">
            <div>
              <p className="text-white font-bold md:text-3xl text-lg">
                Reports
              </p>
            </div>
            {/* <div className="flex md:justify-end justify-start items-center md:pt-0 pt-5">
            <div className="flex rounded-lg w-60 bg-black">
              <button
                className={`text-white ${activitytype === "Hour" && "bg-red-700"
                  } rounded-lg text-xs h-8  w-20 `}
                onClick={() => setActiVityType("Hour")}
              >
                Today
              </button>
              <button
                className={`text-white ${activitytype === "Day" && "bg-red-700"
                  } rounded-lg text-xs h-8  w-20 `}
                onClick={() => setActiVityType("Day")}
              >
                Week
              </button>
              <button
                className={`text-white ${activitytype === "Week" && "bg-red-700"
                  } rounded-lg text-xs h-8  w-20 `}
                onClick={() => setActiVityType("Week")}
              >
                Month
              </button>
              <button
                className={`text-white ${activitytype === "All" && "bg-red-700"
                  } rounded-lg text-xs h-8  w-20 `}
                onClick={() => setActiVityType("All")}
              >
                All
              </button>
            </div>

          </div> */}
          </div>
          <div className="px-5">
            <div className="rounded-sm border border-red-700 py-5 px-3 border-t-0">
              {filterData.map((noti) => (
                <ActivityList data={noti} key={noti._id} />
              ))}
              <div className="flex justify-between mt-5 px-5">
                <p
                  className="text-white"
                  role="button"
                  onClick={() => {
                    if (page !== 1) {
                      setPage(page - 1);
                      getNotification(page - 1);
                    }
                  }}
                >
                  Previous
                </p>
                <p
                  className="text-white"
                  role="button"
                  onClick={() => {
                    if (currentData.length < 10) {
                      return;
                    } else {
                      setPage(page + 1);
                      getNotification(page + 1);
                    }
                  }}
                >
                  Next
                </p>
              </div>
              {/* <Table columns={columns} data={filterData} /> */}

              {filterData.length === 0 && (
                <p className="text-white font-bold text-lg text-center">
                  There is no activities
                </p>
              )}
            </div>
          </div>
        </div>}
        {title === 'Incident' && <div className="pt-5 " id="incident">
          <div className="grid grid-cols-2 bg-stone-900 md:px-5 p-4  border-t-8 border-red-700 md:mx-5 m mx-3">
            <div>
              <p className="text-white font-bold md:text-3xl text-lg">
                Reports
              </p>
            </div>
            {/* <div className="flex justify-end">
            <select className="  bg-red-700 outline-none text-white rounded-full font-bold text-lg px-5 ">
              <option className="text-red-700" value="">
                Select
              </option>
            </select>
            <div className="h-8 w-8 bg-red-700 rounded-md ml-3 flex justify-center items-center">
              <IoSearch className="text-white" />
            </div>
            <div className="h-8 w-8 bg-red-700 rounded-md ml-3 flex justify-center items-center">
              <IoCalendar className="text-white" />
            </div>
          </div> */}
          </div>
          <div className="px-5">
            <ActivityTable data={incidentList} updateReport={updateReport} />
          </div>
        </div>}
      </div>

      <Modal
        isOpen={showForm}
        // onAfterOpen={afterOpenModal}
        onRequestClose={(() => setShowForm(false))}
        ariaHideApp={false}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div className=" bg-black">
          <div className="">
            <div className="grid grid-cols-2 bg-stone-900 md:px-5 p-3 rounded-sm  border-t-4 border-red-700 ">
              <div>
                <p className="text-white font-bold md:text-3xl text-lg">
                  Create Report
                </p>
              </div>
            </div>
          </div>
          <div className=" border-2 border-red-700 rounded-sm p-5">
            {/* <div className="grid grid-cols-1  ">
              <div className="grid grid-cols-2 mb-1">
                <p className="text-white text-lg font-semibold ">
                  Select Staff
                </p>
              </div>
              <MultiSelect
                options={opt}
                value={selected}
                onChange={(text) => {
                  setSelected(text);
                }}
                labelledBy="Select Staff"
                ClearSelectedIcon
              // disabled={publics}
              />
            </div> */}

            <div className="grid md:grid-cols-1 grid-cols-1 mt-3 items-start md:mr-3">
              <p className="text-white text-lg font-semibold">
                Select Project
              </p>
              <MultiSelect
                options={clientOpt}
                hasSelectAll={false}
                value={selectClient}
                onChange={(text) => {
                  console.log(text);
                  if (text.length > 1) {
                    setSelectClient([text[1]]);
                    setReportObj({
                      ...reportObj,
                      project: text[1].value,
                    });
                  } else if (text.length === 1) {
                    setSelectClient(text)
                    setReportObj({
                      ...reportObj,
                      project: text[0].value,
                    });
                  } else {
                    setSelectClient([])
                    setReportObj({
                      ...reportObj,
                      location: '',
                    });
                  }


                }}
                className="rounded-md border-2 border-[var(--red-900)] mt-1 outline-none text-neutral-500 bg-black p-1.5 "

                labelledBy="Select Client"
                ClearSelectedIcon
              />

            </div>

            <div className="grid md:grid-cols-1 grid-cols-1 mt-3 items-start">
              <p className="text-white text-lg font-semibold">
                Description
              </p>
              <textarea
                value={reportObj.details}
                onChange={(text) => {
                  setReportObj({ ...reportObj, details: text.target.value });
                }}
                min="0"
                type="number"
                rows={5}
                className="rounded-md border-2 border-[var(--red-900)] mt-1 outline-none text-neutral-500 bg-black p-2 icncolor"
              />
              {submitted && jobInfo.description === "" && (
                <p className="text-red-700 mt-1">
                  Description is required
                </p>
              )}
            </div>


            <div className="flex justify-between mt-4">
              <button
                className="text-white bg-red-700 rounded-sm  text-md  w-36 h-10"
                onClick={() => {
                  addReport()
                }}
              >
                Report
              </button>
              <button
                className="text-white bg-red-700 rounded-sm  text-md  w-36 h-10"
                onClick={() => {
                  setShowForm(false);

                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </AuthGuard>
  );
};

export default Report;
