/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unknown-property */
import { useState, useEffect } from "react";
import { Api } from "@/src/services/service";
import { checkForEmptyKeys } from "@/src/services/InputsNullChecker";
import moment from "moment";
import { MultiSelect } from "react-multi-select-component";
import JobFilter from "../JobFilter";
import _, { isEmpty, map } from 'underscore';
import TimePicker from "../TimePicker";

const CreateTask = (props) => {
  const jobID = props?.jobId
  const [clientlist, setClientList] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [jobInfo, setJobInfo] = useState({
    startDate: moment(new Date()).format().slice(0, 16),
    startTime: "",
    endTime: "",
    job_hrs: "",
    description: "",
    work_type: "",
    work_role: "",
    project: "",
  });

  const [clientOpt, setClientOpt] = useState([]);
  const [selectClient, setSelectClient] = useState([]);
  const [isOrg, setIsOrg] = useState(false);
  const [isPast, setIsPast] = useState(false);

  let startt = moment(new Date());
  let ends = moment(new Date());
  let [start, setstart] = useState(startt);
  let [end, setend] = useState(ends);

  const getJobHour = async (startTime, endTime) => {
    const hr = await JobFilter({ startDate: startTime, endDate: endTime })
    console.log(hr)
    setJobInfo({
      ...jobInfo,
      job_hrs: parseFloat(await JobFilter({ startDate: startTime, endDate: endTime })).toFixed(2),
      startTime,
      endTime
    });
  };

  useEffect(() => {
    if (props?.organization?._id || props.user.isOrganization) {
      setIsOrg(true);
    }
    setJobInfo({
      startDate: moment(new Date()).format().slice(0, 16),
      startTime: "",
      endTime: "",
      job_hrs: "",
      description: "",
      work_type: "",
      work_role: "",
      project: "",
    });
    getClientList("");
  }, []);

  useEffect(() => {
    if (props?.organization?._id || props.user.isOrganization) {
      setIsOrg(true);
    }
    setJobInfo({
      startDate: moment(new Date()).format().slice(0, 16),
      startTime: "",
      endTime: "",
      job_hrs: "",
      description: "",
      work_type: "",
      work_role: "",
      project: "",
    });
    if (props?.jobId) {
      getJobDetail(props?.jobId)
    }
  }, [jobID]);

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
          setClientList(res.data.clients);
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






  const getJobDetail = (id, o, guard) => {
    // props.loader(true);

    Api("get", `jobs/${id}`, "", props.router).then(async (res) => {
      props.loader(false);
      if (res.status) {
        delete res?.data?.job?.__v
        delete res?.data?.job?.createdAt
        delete res?.data?.job?.updatedAt
        setJobInfo(res?.data?.job);
        setSelectClient([{ value: res?.data?.job.project }])
        let now = new Date(res?.data?.job?.startDate);
        let startt = moment(now);
        let end = new Date(res?.data?.job?.endDate);
        let ends = moment(end);
        setstart(startt);
        setend(ends);
        getClientList(res?.data?.job.project);
      } else {
        props.toaster({ type: "error", message: res.message });
      }
    });
  };


  // function isEmptyObjectRobust(obj) {
  //   return obj && Object.keys(obj).length === 0;
  // }
  const submit = async (type) => {
    // const user = ;
    let { anyEmptyInputs } = checkForEmptyKeys(jobInfo);
    if (anyEmptyInputs && anyEmptyInputs.length > 0) {
      console.log(anyEmptyInputs)
      props.toaster({ type: "error", message: 'Please fill all details' });
      return
    }
    let url = 'jobs/create'
    if (props?.jobId) {
      url = `jobs/${props?.jobId}`
    }

    // if (!!user) {

    Api(
      "post",
      url,
      jobInfo,
      props.router
    ).then((res) => {
      props.loader(false);
      if (res.status) {
        props.setShowForm(false);
        props.getJobs();
        props.updateTask();
        setIsPast(false);
        setJobInfo({
          startDate: moment(new Date()).format().slice(0, 16),
          startTime: "",
          endTime: "",
          job_hrs: "",
          description: "",
          work_type: "",
          work_role: "",
          project: "",
        });
      } else {
        props.toaster({ type: "error", message: res.message });
      }
    });
    // }
  };



  useEffect(() => {
    if (jobInfo.endDate) {
      if (new Date().getTime() > new Date(jobInfo.endDate).getTime()) {
        setIsPast(true);
      } else {
        setIsPast(false);
      }
    }
  }, [jobInfo]);

  return (
    <div className=" bg-[var(--mainLightColor)] ">
      <div className="mb-5 ">
        <div className="grid grid-cols-2 bg-[var(--mainColor)] md:px-5 p-3   border-t-4 border-[var(--customYellow)] ">
          <div>
            <p className="text-white font-bold md:text-3xl text-lg">
              {props.repeat}
            </p>
          </div>
        </div>

        <div className=" border-2 border-[var(--mainColor)] rounded-sm p-5">
          <div className="grid md:grid-cols-2 grid-cols-1 items-start">
            <div className="grid grid-cols-1 md:mr-2">
              <p className="text-black text-lg font-semibold">Task Date</p>
              <input
                value={moment(jobInfo?.startDate).format('YYYY-MM-DD')}
                onChange={(text) => {
                  const newDate = moment(text.target.value, 'YYYY-MM-DD').format()
                  let dd = text.target.value.split('-')[2]
                  let m = text.target.value.split('-')[1]
                  let y = text.target.value.split('-')[0]
                  let ndata = {
                    startDate: newDate
                  }
                  if (jobInfo?.startTime) {
                    let d = moment(jobInfo?.startTime).format();
                    let nd = new Date(new Date(d).setDate(dd))
                    let nm = new Date(new Date(nd).setMonth(m - 1))
                    let ny = new Date(new Date(nm).setFullYear(y))
                    ndata.startTime = moment(new Date(ny), 'YYYY-MM-DD').format()
                  }
                  if (jobInfo?.endTime) {
                    let d = moment(jobInfo?.endTime).format();
                    let nd = new Date(new Date(d).setDate(dd))
                    let nm = new Date(new Date(nd).setMonth(m - 1))
                    let ny = new Date(new Date(nm).setFullYear(y))
                    ndata.endTime = moment(new Date(ny), 'YYYY-MM-DD').format()
                  }
                  setJobInfo({ ...jobInfo, ...ndata });
                }}
                type="date"
                className="rounded-md border-2 border-[var(--mainColor)] mt-1 outline-none text-black bg-[var(--white)] p-3 "
              />
              {submitted && jobInfo.title === "" && (
                <p className="text-[var(--mainColor)] mt-1">Task Name is required</p>
              )}
            </div>

            <div className="grid md:grid-cols-2 grid-cols-1">
              <div className="grid grid-cols-1">
                <p className="text-black text-lg font-semibold">
                  {"Start Time"}
                </p>


                {/* <input
                  value={moment(jobInfo?.startTime).format('HH:mm')}
                  max={jobInfo.endTime}
                  onChange={(text) => {
                    let h = text.target.value.split(':')[0]
                    let m = text.target.value.split(':')[1]
                    let nee = new Date(jobInfo?.startDate)
                    let newhrs = new Date(nee.setHours(h))
                    let newDate = new Date(newhrs.setMinutes(m))
                    setJobInfo({ ...jobInfo, startTime: newDate });
                    getJobHour(newDate, jobInfo.endTime);
                  }}
                  type="time"
                  className="rounded-md border-2 border-[var(--mainColor)] mt-1 outline-none text-black bg-[var(--white)] p-3 "
                /> */}
                <div className="rounded-md border-2 border-[var(--mainColor)] mt-1 outline-none text-black bg-[var(--white)] p-3 "
                >
                  <TimePicker date={moment(new Date(jobInfo.startDate)).format()} value={moment(jobInfo?.startTime || new Date()).format('HH:mm A')} onChange={(e) => {
                    console.log(e)
                    setJobInfo({ ...jobInfo, startTime: e });
                    getJobHour(moment(new Date(e)).format(), jobInfo.endTime);
                  }} />
                </div>
              </div>

              <div className="grid grid-cols-1">
                <p className="text-black text-lg font-semibold">
                  {"End Time"}
                </p>
                <div className="rounded-md border-2 border-[var(--mainColor)] mt-1 outline-none text-black bg-[var(--white)] p-3 "
                >
                  <TimePicker date={moment(new Date(jobInfo.startDate)).format()} value={moment(jobInfo?.endTime || new Date()).format('HH:mm A')} onChange={(e) => {
                    console.log(e)
                    setJobInfo({ ...jobInfo, endTime: e });
                    getJobHour(jobInfo.startTime, moment(new Date(e)).format());
                  }} />
                </div>
                {/* <input
                  value={moment(jobInfo.endTime).format('HH:mm')}
                  // min={jobInfo.startTime}
                  onChange={(text) => {
                    // const newDate = moment(text.target.value, 'HH:mm').format()
                    let h = text.target.value.split(':')[0]
                    let m = text.target.value.split(':')[1]
                    let nee = new Date(jobInfo?.startDate)
                    let newhrs = new Date(nee.setHours(h))
                    let newDate = new Date(newhrs.setMinutes(m))
                    setJobInfo({ ...jobInfo, endTime: newDate });
                    getJobHour(jobInfo.startTime, newDate);
                  }}
                  type="time"
                  className="rounded-md border-2 border-[var(--mainColor)] mt-1 outline-none text-black bg-[var(--white)] p-3 "
                /> */}

              </div>
            </div>
          </div>

          <div
            className={`grid ${isOrg ? "md:grid-cols-2 " : "md:grid-cols-1"
              } md:grid-cols-2 grid-cols-1 mt-3 items-start`}
          >
            <div className="grid md:grid-cols-1 grid-cols-1 mt-3 items-start md:mr-3">
              <p className="text-black text-lg font-semibold">
                Select Project
              </p>
              <MultiSelect
                options={clientOpt}
                hasSelectAll={false}
                value={selectClient}
                onChange={(text) => {
                  if (text.length > 1) {
                    setSelectClient([text[1]]);
                    setJobInfo({
                      ...jobInfo,
                      project: text[1].value,
                    });
                  } else if (text.length === 1) {
                    setSelectClient(text)
                    setJobInfo({
                      ...jobInfo,
                      project: text[0].value,
                    });
                  } else {
                    setSelectClient([])
                    setJobInfo({
                      ...jobInfo,
                      location: '',
                    });
                  }


                }}
                className="rounded-md border-2 border-[var(--mainColor)] mt-1 outline-none text-black bg-[var(--white)] p-1.5 "

                labelledBy="Select Client"
                ClearSelectedIcon
              />

            </div>

            <div className="grid md:grid-cols-1 grid-cols-1 mt-3 items-start">
              <p className="text-black text-lg font-semibold">Hours</p>
              <input
                readOnly
                value={jobInfo?.job_hrs}
                onChange={(text) => {
                  setJobInfo({ ...jobInfo, job_hrs: text.target.value });
                }}
                min="0"
                type="number"
                placeholder="00"
                className="rounded-md border-2 border-[var(--mainColor)] mt-1 outline-none text-black bg-[var(--white)] p-3 icncolor"
              />
            </div>

          </div>

          <div className="grid md:grid-cols-2 grid-cols-1 mt-3 items-start">
            <div className="grid grid-cols-1 md:mr-2 ">
              <div className="grid grid-cols-2 mb-1">
                <p className="text-black text-lg font-semibold ">
                  Work Type
                </p>

              </div>
              <select value={jobInfo?.work_type}
                onChange={(text) => {
                  setJobInfo({ ...jobInfo, work_type: text.target.value });
                }} className="rounded-md border-2 border-[var(--mainColor)] mt-1 outline-none text-black bg-[var(--white)] p-3 "
              >
                <option value=''>Slelect work type</option>
                <option value='Regular'>Regular</option>
                <option value='Maintenance'>Maintenance</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:mr-2 ">
              <div className="grid grid-cols-2 mb-1">
                <p className="text-black text-lg font-semibold ">
                  Work Rele
                </p>

              </div>
              <select value={jobInfo?.work_role}
                onChange={(text) => {
                  setJobInfo({ ...jobInfo, work_role: text.target.value });
                }} className="rounded-md border-2 border-[var(--mainColor)] mt-1 outline-none text-black bg-[var(--white)] p-3 "
              >
                <option value=''>Slelect work type</option>
                <option value='Designer'>Designer</option>
                <option value='Development'>Developer</option>
                <option value='Tester'>Tester</option>
                <option value='SEO'>SEO</option>
              </select>
            </div>
          </div>



          <div className="grid md:grid-cols-1 grid-cols-1 mt-3 items-start">
            <p className="text-black text-lg font-semibold">
              Task list
            </p>
            <textarea
              value={jobInfo.description}
              onChange={(text) => {
                setJobInfo({ ...jobInfo, description: text.target.value });
              }}
              min="0"
              type="number"
              rows={5}
              className="rounded-md border-2 border-[var(--mainColor)] mt-1 outline-none text-black bg-[var(--white)] p-2 icncolor"
            />
            {submitted && jobInfo.description === "" && (
              <p className="text-[var(--mainColor)] mt-1">
                Job Responsibility is required
              </p>
            )}
          </div>

          <div className="flex justify-between mt-4">
            <div className="flex gap-5">
              <button
                className={`text-white ${isPast ? "bg-[var(--mainColor)]" : "bg-[var(--mainColor)]"
                  } rounded-sm  text-md w-36 h-10`}
                onClick={submit}
              >
                {props.repeat === "Create New Task" ? "Create" : props.repeat}
              </button>

            </div>

            <button
              className="text-white bg-[var(--mainColor)] rounded-sm  text-md  w-36 h-10"
              onClick={() => {
                props.setShowForm(false);
                setJobInfo({
                  startDate: moment(new Date()).format().slice(0, 16),
                  startTime: "",
                  endTime: "",
                  job_hrs: "",
                  description: "",
                  work_type: "",
                  work_role: "",
                  project: "",
                });
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTask;
