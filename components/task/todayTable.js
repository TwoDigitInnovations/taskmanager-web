/* eslint-disable react-hooks/exhaustive-deps */
import CustomCalendarTable from "./customCalendar";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { IoChevronBack, IoChevronForward, IoRepeat } from "react-icons/io5";
import { FaUserCheck } from "react-icons/fa";
import moment from "moment";
import { MdDeleteForever, MdModeEditOutline } from "react-icons/md";
import { ImLink } from "react-icons/im";
import Tooltip from "@mui/material/Tooltip";
import { Api } from "@/src/services/service";
import Stickytables from "./stickytables";
import { userContext } from "@/pages/_app";
import { useConfirm } from "../confirmationModal";



const TodayTable = (props) => {
  const { confirm } = useConfirm();
  const [curruntDate, setCurrentDate] = useState(new Date());
  const [data, setData] = useState([]);
  const [dateObj, setDateObj] = useState(props.date);
  let [user, setUser] = useContext(userContext)

  useEffect(() => {
    if (!!props.data) {
      setDataTable();
    }
  }, [props.data]);

  const setDataTable = () => {
    const d = [];
    setData([]);
    props?.data.forEach((ele, index) => {
      // obj.event = [];
      // obj.time = [];

      // ele?.jobs?.forEach((el, i) => {
      //   obj.event.push({
      //     startTime: el.startTime,
      //     endTime: el.endTime,
      //     rate: el.amount,
      //     staff: el.startDate,
      //   });
      //   obj.time.push({
      //     startTime: moment(el.startTime, "HH:mm").format("hh:mm A"),
      //     endTime: moment(el.endTime, "HH:mm").format("hh:mm A"),
      //   });

      ele?.jobs?.forEach((el, i) => {
        if (
          moment(el.startDate).format("DD/MM/YYYY") ===
          moment(curruntDate).format("DD/MM/YYYY")
        ) {
          el = {
            ...el,
            sd: props.date.startDate,
            ed: props.date.endDate,
          };
          let obj = {};
          obj.name = i == 0 ? ele.name : "";
          obj.event = el;
          obj.time = {
            startTime: moment(el.startDate).format("hh:mm A"),
            endTime: moment(el.endDate).format("hh:mm A"),
          };
          d.push(obj);
          setData(d);
        }

        // if (ele?.jobs.length === i + 1) {
        //   d.push(obj);
        //   setData(d);
        // }
        // if (props?.data.length === index + 1) {
        //   setData(d);
        // }
      });
    });
  };

  function dateRange(startDate, endDate, steps = 1) {
    const dateArray = [];
    let currentDate = new Date(startDate);

    while (currentDate <= new Date(endDate)) {
      dateArray.push(new Date(currentDate));
      // Use UTC date to prevent problems with time zones and DST
      currentDate = moment(new Date(currentDate, "YYYY/MM/DD")).add(
        steps,
        "days"
      );
      // currentDate.setUTCDate(currentDate.getUTCDate() + steps);
    }

    return dateArray;
  }

  const columns = useMemo(
    () => [
      {
        Header: "Projects",
        accessor: "name",
        sticky: "left",
        Cell: clientsName
      },
      {
        Header: "Time",
        accessor: "time",
        Cell: timeCell,
      },
      {
        Header: "Detail",
        accessor: "event",
        Cell: eventCell,
      },
    ],
    []
  );

  function timeCell({ value, row }) {
    return (
      <div>
        {!!value ? (
          <div>
            <p>
              Time: {moment(row.original.event?.startTime).format('hh:mm A')} - {moment(row.original.event?.endTime).format('hh:mm A')}
            </p>
            <p>
              Total Hours : {row.original.event?.job_hrs}
            </p>
          </div>
        ) : null}
      </div>
    );
  }

  useEffect(() => {
    props.getAllJobs(
      // moment(new Date(new Date().setDate(new Date().getDate()))).format(
      //   "yyyy/MM/DD"
      // ),
      // moment(new Date(new Date().setDate(new Date().getDate() + 1))).format(
      //   "yyyy/MM/DD"
      // )
      moment(new Date().setHours(0, 0, 0, 0)).format(),
      moment(new Date().setHours(0, 0, 0, 0)).format()
    );
  }, []);

  const backWeek = () => {
    setCurrentDate(new Date(curruntDate.setDate(curruntDate.getDate() - 1)));
    props.getAllJobs(
      // moment(new Date(curruntDate.setDate(curruntDate.getDate()))).format(
      //   "yyyy/MM/DD"
      // ),
      // moment(new Date(curruntDate.setDate(curruntDate.getDate() + 1))).format(
      //   "yyyy/MM/DD"
      // )
      moment(new Date(curruntDate).setHours(0, 0, 0, 0)).format(),
      moment(new Date(curruntDate).setHours(0, 0, 0, 0)).format()
    );

    // props.getAllJobs(
    //   moment(curruntDate).format(),
    //   moment(new Date(curruntDate.setDate(curruntDate.getDate() + 1))).format()
    // );
  };

  const nextWeek = () => {
    setCurrentDate(new Date(curruntDate.setDate(curruntDate.getDate() + 1)));
    props.getAllJobs(
      // moment(new Date(curruntDate.setDate(curruntDate.getDate()))).format(
      //   "yyyy/MM/DD"
      // ),
      // moment(new Date(curruntDate.setDate(curruntDate.getDate() + 1))).format(
      //   "yyyy/MM/DD"
      // )
      moment(new Date(curruntDate).setHours(0, 0, 0, 0)).format(),
      moment(new Date(curruntDate).setHours(0, 0, 0, 0)).format()
    );

    // props.getAllJobs(
    //   moment(curruntDate).format(),
    //   moment(new Date(curruntDate.setDate(curruntDate.getDate() + 5))).format()
    // );
  };

  const deleteTask = async (id, task) => {
    const result = await confirm("Delete Task", "Are you sure you want to delete this?", { id });
    console.log('result-------------------->', result)
    if (result.confirm) {
      props.loader(true);
      Api("delete", `jobs/${id}`, "", props.router).then(
        async (res) => {
          props.loader(false);
          if (res.status) {
            props.getAllJobs(moment(task.sd).format(), moment(task.ed).format());
          } else {
            props.toaster({ type: "success", message: res.message });
          }
        },
        (err) => {
          props.loader(false);
          props.toaster({ type: "error", message: err.message });
          console.log(err);
        }
      );
    }
  };

  function eventCell({ value, row }) {
    console.log(row)
    // let d = value?.invites?.filter(
    //   (f) =>
    //     f.job_status === "ACTIVE" &&
    //     (f.status === "ACCEPTED" || f.status === "ASSIGNED")
    // );
    // const R = value?.invites?.filter((f) => f.status === "REJECTED");
    // let c = []
    // if (d?.length) {
    //   c = d?.filter(f => f.start)
    // }
    let ownProperty = row?.original?.event?.posted_by?._id === user?.id || user.type === 'ADMIN';
    return (
      <div className="w-32">
        {!!value ? (
          <div
            className={` ${ownProperty ? 'bg-[var(--mainColor)]' : 'bg-black'}  p-2 m-1 rounded-sm w-32`}
          >
            <p className="text-white f11">
              Name: {row?.original?.event?.posted_by?.username}
            </p>
            <p className="text-white f11">
              Start Time: {moment(value?.startTime).format("hh:mm A")}
            </p>
            <p className="text-white f11">
              End Time: {moment(value?.endTime).format("hh:mm A")}
            </p>
            {ownProperty && <div className="flex justify-start items-end mt-1">
              {/* {value?.invites?.length > 0 && !value.public && ( */}

              <Tooltip title={<p>Edit</p>} arrow>
                <div
                  className="w-4 h-4 bg-white rounded-sm flex justify-center items-center mr-1"
                  onClick={() => {
                    props.goToTop();
                    props.setShowForm(true);
                    props.setJobID(value?._id);
                    props.setRepeat("Update Task");
                  }}
                >
                  <MdModeEditOutline className="text-black text-md" />
                </div>
              </Tooltip>
              <Tooltip title={<p>Delete</p>} arrow>
                <div
                  className="w-4 h-4 bg-white rounded-sm flex justify-center items-center mr-1"
                  onClick={() => {
                    deleteTask(value?._id, row.original.event);
                    // deleteTask(value?._id);
                  }}
                >
                  <MdDeleteForever className="text-black text-md" />
                </div>
              </Tooltip>

            </div>}
          </div>
        ) : null}
      </div>
    );
  }

  // function eventCell({ value }) {
  //   return (
  //     <div>
  //       {!!value ? (
  //         <div>
  //           {value?.map((item, index) => (
  //             <div className="bg-green-700 p-2 m-1 rounded-md" key={index}>
  //               <p className="text-white">Start Time : {item?.startTime}</p>
  //               <p className="text-white">End Time : {item?.endTime}</p>
  //               <p className="text-white">Rate : {item?.rate}</p>
  //               <p className="text-white">Staff : {item?.staff}</p>
  //             </div>
  //           ))}
  //         </div>
  //       ) : null}
  //     </div>
  //   );
  // }

  // function timeCell({ value }) {
  //   return (
  //     <div>
  //       {!!value ? (
  //         <div>
  //           {value?.map((item, index) => (
  //             <p key={index}>
  //               {item?.startTime} - {item?.endTime}
  //             </p>
  //           ))}
  //         </div>
  //       ) : null}
  //     </div>
  //   );
  // }



  function clientsName({ value, row }) {
    console.log(row)
    return (
      <div>
        <p >{row.index + 1}. {value}</p>
      </div>
    );
  }

  return (
    <div className="md:mx-5 mx-3">
      <div className=" bg-[var(--mainColor)]  rounded-sm border-t-4 border-[var(--customYellow)]  relative">
        <div className="grid md:grid-cols-4 grid-cols-3 items-center bg-[var(--mainColor)] md:px-5 p-3 rounded-sm   relative">
          <div className="col-span-1">
            <div
              className="md:h-10 h-7 md:w-12 w-8 rounded-md border-2 border-[var(--customYellow)] hover:bg-[var(--customYellow)] flex items-center justify-center cursor-pointer bg-[var(--white)]"
              onClick={() => {
                backWeek();
              }}
            >
              <IoChevronBack className="text-black md:text-xl text-xs" />
            </div>
          </div>
          <div className=" md:block hidden col-span-2">
            <p className="text-white text-center text-lg ">
              {" "}
              {curruntDate.toString()}{" "}
            </p>
          </div>
          <div className="flex items-center justify-end w-full md:col-span-1 col-span-2">
            <div className="flex md:h-10 h-7 border-2 border-[var(--customYellow)] rounded-sm items-center justify-center md:mr-5 mr-1 bg-white">
              <button
                className="text-black px-3 md:h-10 h-7 hover:bg-[var(--customYellow)] md:text-md f10"
                onClick={() => {
                  props?.setShowCal("month");
                }}
              >
                Month
              </button>
              <button
                onClick={() => {
                  props?.setShowCal("week");
                }}
                className="text-black px-3 md:h-10 h-7 hover:bg-[var(--customYellow)]]  rounded-sm f10  md:text-md"
              >
                Week
              </button>
              <button className="text-black px-3 md:h-10 h-7 bg-[var(--customYellow)] border-[var(--customYellow)] md:text-md f10">
                Today
              </button>
            </div>
            <div
              className="md:h-10 h-7 md:w-12 w-8 rounded-md border-2 border-[var(--customYellow)] hover:bg-[var(--customYellow)] flex items-center justify-center cursor-pointer bg-[var(--white)]"
              onClick={nextWeek}
            >
              <IoChevronForward className="text-black md:text-xl text-xs" />
            </div>
          </div>
        </div>
        <div className=" md:hidden block">
          <p className="text-white text-center md:text-xl pb-1 f10">
            {curruntDate.toString()}
          </p>
        </div>
      </div>
      <div className=" w-full overflow-hidden ">
        <div className="h-full overflow-auto">
          <Stickytables columns={columns} data={data} type='week' />
        </div>

      </div>

      {/* <CustomCalendarTable columns={columns} data={data} /> */}
    </div>
  );
};
export default TodayTable;
