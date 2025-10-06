/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/no-unknown-property */
import { useState, useEffect, useContext } from "react";
import { Api, ApiFormData } from "@/src/services/service";
import { checkForEmptyKeys } from "@/src/services/InputsNullChecker";
import LocationDropdown from "@/components/LocationDropdown";
import { userContext } from "../_app";
import { MultiSelect } from "react-multi-select-component";
import moment from "moment";
import { FaFilePdf } from "react-icons/fa";


const options = [];

const Register = (props) => {
  const { clienID } = props;
  const [submitted, setSubmitted] = useState(false);
  const [taskList, setTaskList] = useState([]);
  const [user, setUser] = useContext(userContext)
  const [clientOpt, setClientOpt] = useState([]);
  const [selectClient, setSelectClient] = useState([]);
  const [clientObj, setClientObj] = useState({
    name: "",
    amount: "",
    period: "",
    start_figma_date: "",
    description: "",
    start_dev_date: "",
    client: "",
    original_propsel: "",
    original_propsel_link: "",
    dev_propsel: "",
    dev_propsel_link: "",
    required_items: [],
    links: [],
    milestones: [],
    platforms: []
  });
  useEffect(() => {
    getClientLists();
  }, []);

  useEffect(() => {
    console.log(clientOpt)
    console.log(typeof clientOpt)
    if (clientObj?.client && clientOpt && clientOpt.length > 0) {
      let currentClient = clientOpt.find(f => f.value === clientObj.client);
      setSelectClient([currentClient])
    }
  }, [clientOpt, clientObj]);

  const getClientLists = (ids) => {
    props.loader(true);
    let url = "provider/client";
    // if (props?.organization?._id) {
    //   url = `provider/client?org_id=${props?.organization?._id}`;
    // }
    Api("get", url, "", props.router).then(
      async (res) => {
        props.loader(false);
        if (res?.status) {
          let options = [];
          res.data.clients.forEach((ele, index) => {
            options.push({
              label: ele.fullName,
              value: ele._id,
            });
            if (res.data.clients.length === index + 1) {
              setClientOpt(options);
            }
          });
          // if (ids) {
          //   let currentClient = res.data.clients.find(f => f._id === ids);
          //   setSelectClient({
          //     label: currentClient.fullName,
          //     value: currentClient._id,
          //   })
          // }
          setSelectClient([{ value: res.data.client }])
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

  useEffect(() => {

    if (!!clienID) {
      getClientList();
    }
  }, [clienID]);
  const getClientList = () => {
    props.loader(true);
    Api("get", `project/${clienID}`, "", props.router).then(
      async (res) => {
        props.loader(false);
        if (res?.status) {
          if (res.data.start_figma_date) {
            res.data.start_figma_date = moment(new Date(res.data.start_figma_date)).format('YYYY-MM-DD');
          }

          if (res.data.start_dev_date) {
            res.data.start_dev_date = moment(new Date(res.data.start_dev_date)).format('YYYY-MM-DD');
          }
          if (res.data.original_propsel) {
            res.data.original_propsel_link = res.data.original_propsel;
            res.data.original_propsel = ''
          }

          if (res.data.dev_propsel) {
            res.data.dev_propsel_link = res.data.dev_propsel;
            res.data.dev_propsel = ''
          }

          setClientObj(res.data)
          // setSelectClient([{ value: res.data.client }])
          // getClientLists(res.data.client);
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


  const submit = () => {
    // const user = localStorage.getItem("userDetail");

    // let { anyEmptyInputs } = checkForEmptyKeys(clientObj);
    // if (anyEmptyInputs.length > 0) {
    //   setSubmitted(true);
    //   return;
    // }
    const projectObj = new FormData();
    projectObj.append('name', clientObj.name)
    projectObj.append('amount', clientObj.amount)
    projectObj.append('period', clientObj.period)
    projectObj.append('client', clientObj.client)
    projectObj.append('milestones', JSON.stringify(clientObj.milestones))
    projectObj.append('client', selectClient[0].value)
    projectObj.append('platforms', JSON.stringify(clientObj.platforms))

    if (clientObj.original_propsel) {
      projectObj.append('original_propsel', clientObj.original_propsel)
    }

    if (clientObj.start_figma_date) {
      projectObj.append('start_figma_date', clientObj.start_figma_date)
    }
    if (clientObj.description) {
      projectObj.append('description', clientObj.description)
    }
    if (clientObj.start_dev_date) {
      projectObj.append('start_dev_date', clientObj.start_dev_date)
    }
    if (clientObj.required_items.length > 0) {
      projectObj.append('required_items', JSON.stringify(clientObj.required_items))
    }
    if (clientObj?.links?.length > 0) {
      projectObj.append('links', JSON.stringify(clientObj.links))
    }

    if (clientObj?.dev_propsel) {
      projectObj.append('dev_propsel', clientObj.dev_propsel)
    }

    console.log(projectObj)
    // return
    let Url = 'project/create'
    if (clienID) {
      Url = `project/update/${clienID}`
    }
    ApiFormData("post", Url, projectObj, props.router).then((res) => {
      props.loader(false);
      props.setShowForm(false);
      props.getClientList();
      if (res.status) {
        setClientObj({
          name: "",
          amount: "",
          period: "",
          start_figma_date: "",
          description: "",
          start_dev_date: "",
          client: "",
          original_propsel: "",
          dev_propsel: "",
          required_items: [],
          links: [],
          milestones: [],
          platforms: []
        });
      } else {
        props.toaster({ type: "error", message: res.message });
      }
    });
  };

  const openPdf = (pdfurl) => {

    Api("post", 'project/openpdf', { pdfurl }, props.router).then(
      async (res) => {
        props.loader(false);
        console.log()
        if (res?.url) {
          window.open(res?.url, '_blank')

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

  console.log(clientObj)
  console.log(selectClient)
  return (
    <div className=" bg-black overflow-x-auto">
      <div className="pt-16 pb-5 ">
        <div className="grid grid-cols-2 bg-stone-900 md:px-5 p-3 rounded-sm  border-t-4 border-red-700 ">
          <div>
            <p className="text-white font-bold md:text-3xl text-lg">
              {!!clienID ? "Update Project" : "Register new Project"}
            </p>
          </div>
        </div>

        <div className=" border-2 border-red-700 rounded-sm p-5">
          <div className="grid md:grid-cols-2 grid-cols-1 items-start">
            <div className="grid grid-cols-1 md:mr-2">
              <p className="text-white text-lg font-semibold">
                Project name{" "}
              </p>
              <input
                value={clientObj.name}
                onChange={(text) => {
                  setClientObj({ ...clientObj, name: text.target.value });
                }}
                className="rounded-md border-2 border-[var(--red-900)] mt-1 outline-none text-neutral-500 bg-black p-2 icncolor"
              />
              {submitted && clientObj.name === "" && (
                <p className="text-red-700 mt-1">Project Name is required</p>
              )}
            </div>
            <div className="grid grid-cols-1 ">
              <p className="text-white text-lg font-semibold">Amount</p>
              <input
                value={clientObj.amount}
                onChange={(text) => {
                  setClientObj({
                    ...clientObj,
                    amount: text.target.value,
                  });
                }}
                className="rounded-md border-2 border-[var(--red-900)] mt-1 outline-none text-neutral-500 bg-black p-2 icncolor"
              />
              {submitted && clientObj.amount === "" && (
                <p className="text-red-700 mt-1">Amount is required</p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 grid-cols-1 items-start mt-3 ">
            <div className="grid grid-cols-1 md:mr-2">
              <p className="text-white text-lg font-semibold">Period (Weeks / Months)</p>
              <input
                value={clientObj.period}
                onChange={(text) => {
                  setClientObj({ ...clientObj, period: text.target.value });
                }}
                className="rounded-md border-2 border-[var(--red-900)] mt-1 outline-none text-neutral-500 bg-black p-2 icncolor"
              />
              {submitted && clientObj.period === "" && (
                <p className="text-red-700 mt-1">period is required</p>
              )}
            </div>
            <div className="grid grid-cols-1 md:mr-2">
              <p className="text-white text-lg font-semibold">Client</p>
              {/* <select
                value={clientObj.start_dev_date}
                onChange={(text) => {
                  setClientObj({
                    ...clientObj,
                    start_dev_date: text.target.value,
                  });
                }}
                className="rounded-md border-2 border-[var(--red-900)] mt-1 outline-none text-neutral-500 bg-black p-3 icncolor"

              >
                <option>Pending</option>
                <option>Paid</option>
              </select> */}
              <MultiSelect
                options={clientOpt}
                hasSelectAll={false}
                value={selectClient}
                onChange={(text) => {
                  console.log(text);
                  if (text.length > 1) {
                    setSelectClient([text[1]]);

                  } else if (text.length === 1) {
                    setSelectClient(text)

                  } else {
                    setSelectClient([])
                  }
                }}

                labelledBy="Select Client"
                ClearSelectedIcon
                className="rounded-md border-2 border-[var(--red-900)] mt-1 outline-none text-neutral-500 bg-black  icncolor"
              />
              {submitted && clientObj.start_dev_date === "" && (
                <p className="text-red-700 mt-1">Client is required</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:mr-2  mt-3 ">
              <p className="text-white text-lg font-semibold">Design Start Date</p>
              <input
                value={clientObj.start_figma_date}
                onChange={(text) => {
                  setClientObj({
                    ...clientObj,

                    start_figma_date: text.target.value,
                  });
                }}
                type="date"
                className="rounded-md border-2 border-[var(--red-900)] mt-1 outline-none text-neutral-500 bg-black p-2 icncolor"
              />
            </div>

            <div className="grid grid-cols-1 md:mr-2  mt-3 ">
              <p className="text-white text-lg font-semibold">Devlopment Start Date</p>
              <input
                value={clientObj.start_dev_date}
                onChange={(text) => {
                  setClientObj({
                    ...clientObj,
                    start_dev_date: text.target.value,
                  });
                }}
                type="date"
                className="rounded-md border-2 border-[var(--red-900)] mt-1 outline-none text-neutral-500 bg-black p-2 icncolor"
              />
            </div>

            <div className="grid grid-cols-1 md:mr-2  mt-3 ">
              <p className="text-white text-lg font-semibold">Original Proposel</p>
              <input
                // value={clientObj.start_dev_date}
                onChange={(text) => {
                  console.log(text)
                  setClientObj({
                    ...clientObj,
                    original_propsel: text.target.files[0],
                  });
                }}
                type="file"
                className="rounded-md border-2 border-[var(--red-900)] mt-1 outline-none text-neutral-500 bg-black p-2 icncolor"
              />
              {clientObj?.original_propsel_link && <div className="mt-2 cursor-pointer" onClick={() => window.open(clientObj.original_propsel_link, '_blank')}>
                <FaFilePdf className="text-white text-8xl" />
                <p className="text-white mt-1">Original-Pdf.js</p>
              </div>}
              {submitted && clientObj.start_dev_date === "" && (
                <p className="text-red-700 mt-1">Original proposel is required</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:mr-2  mt-3 ">
              <p className="text-white text-lg font-semibold">Dev Proposel</p>
              <input
                onChange={(text) => {
                  console.log(text)
                  setClientObj({
                    ...clientObj,
                    dev_propsel: text.target.files[0],
                  });
                }}
                type="file"
                className="rounded-md border-2 border-[var(--red-900)] mt-1 outline-none text-neutral-500 bg-black p-2 icncolor"
              />
              {clientObj?.dev_propsel_link && <div className="mt-2 cursor-pointer" onClick={() =>
                openPdf(clientObj.dev_propsel_link)
              }
              >
                <FaFilePdf className="text-white text-8xl" />
                <p className="text-white mt-1">Devloper-Pdf.js</p>
              </div>}
              {submitted && clientObj.start_dev_date === "" && (
                <p className="text-red-700 mt-1">Dev proposel is required</p>
              )}
            </div>

            <div className="grid grid-cols- md:mr-2  mt-3 ">
              <p className="text-white text-lg font-semibold">Platforms</p>
              <div className="rounded-md border-2 border-[var(--red-900)] mt-1 outline-none text-neutral-500 bg-black p-2 icncolor"
              >
                <div className="flex items-center">
                  <input type='checkbox' checked={clientObj?.platforms.includes('Website')} onChange={(event) => {
                    console.log(event)
                    let d = clientObj?.platforms || []
                    if (event.target.checked) {
                      d.push('Website')
                    } else {
                      d = d.filter(f => f !== 'Website')
                    }
                    setClientObj({
                      ...clientObj,
                      platforms: d,
                    });
                  }} />
                  <p className="text-white text-base font-medium ml-3">Website</p>
                </div>
                <div className="flex items-center">
                  <input type='checkbox' checked={clientObj?.platforms.includes('Android App')} onChange={(event) => {
                    console.log(event)
                    let d = clientObj?.platforms || []
                    if (event.target.checked) {
                      d.push('Android App')
                    } else {
                      d = d.filter(f => f !== 'Android App')
                    }
                    setClientObj({
                      ...clientObj,
                      platforms: d,
                    });
                  }} />
                  <p className="text-white text-base font-medium ml-3">Android App</p>
                </div>
                <div className="flex items-center">
                  <input type='checkbox' checked={clientObj?.platforms.includes('Ios App')} onChange={(event) => {
                    console.log(event)
                    let d = clientObj?.platforms || []
                    if (event.target.checked) {
                      d.push('Ios App')
                    } else {
                      d = d.filter(f => f !== 'Ios App')
                    }
                    setClientObj({
                      ...clientObj,
                      platforms: d,
                    });
                  }} />
                  <p className="text-white text-base font-medium ml-3">Ios App</p>
                </div>
                <div className="flex items-center">
                  <input type='checkbox' checked={clientObj?.platforms.includes('Admin Panel')} onChange={(event) => {
                    console.log(event)
                    let d = clientObj?.platforms || []
                    if (event.target.checked) {
                      d.push('Admin Panel')
                    } else {
                      d = d.filter(f => f !== 'Admin Panel')
                    }
                    setClientObj({
                      ...clientObj,
                      platforms: d,
                    });
                  }} />
                  <p className="text-white text-base font-medium ml-3">Admin Panel</p>
                </div>
              </div>

            </div>
            <div className="grid grid-cols- md:mr-2  mt-3 ">
              <p className="text-white text-lg font-semibold">Description</p>
              <textarea
                value={clientObj?.description}
                rows={4}
                onChange={(text) => {
                  setClientObj({
                    ...clientObj,
                    description: text.target.value,
                  });
                }}
                className="rounded-md border-2 border-[var(--red-900)] mt-1 outline-none text-neutral-500 bg-black p-2 icncolor"
              ></textarea>
            </div>

          </div>
          <div className="grid grid-cols-1 md:mr-2 rounded-md border-2 border-[var(--red-900)] p-2 mt-5 ">
            <div className="flex justify-between">
              <p className="text-white text-lg font-semibold">Milestones</p>
              <button
                className="text-white bg-red-700 rounded-sm  text-md py-2 px-2 h-10"
                onClick={() => {
                  let mltns = clientObj.milestones;
                  mltns.push({
                    amount: "",
                    currency: "",
                    period: "",
                    tasks: "",
                    status: "unpaid"
                  })
                  setClientObj({
                    ...clientObj,
                    milestones: mltns
                  })
                }}
              >
                Add Milestone
              </button>
            </div>

            <table className="mt-5">
              {clientObj.milestones.map((item, index) => (<tr key={index} >
                <td className="p-2">   <p className="text-white text-lg font-semibold">{index + 1}</p></td>
                <td className="p-2">
                  <input
                    placeholder="Amount"
                    value={item?.amount}
                    onChange={(text) => {
                      item.amount = text.target.value
                      setClientObj({
                        ...clientObj,
                      });
                    }}
                    type="number"
                    className="rounded-md border-2 border-[var(--red-900)] mt-1 outline-none text-neutral-500 bg-black p-2 icncolor w-full"
                  />
                </td>
                <td className="p-2">
                  <input
                    placeholder="Currency"
                    value={item?.currency}
                    onChange={(text) => {
                      item.currency = text.target.value
                      setClientObj({
                        ...clientObj,
                      });
                    }}
                    type="text"
                    className="rounded-md border-2 border-[var(--red-900)] mt-1 outline-none text-neutral-500 bg-black p-2 icncolor w-full"
                  />
                </td>
                <td className="p-2">
                  <input
                    placeholder="Period"
                    value={item?.period}
                    onChange={(text) => {
                      item.period = text.target.value
                      setClientObj({
                        ...clientObj,
                      });
                    }}
                    type="text"
                    className="rounded-md border-2 border-[var(--red-900)] mt-1 outline-none text-neutral-500 bg-black p-2 icncolor w-full"
                  />
                </td>
                <td className="p-2">
                  <input
                    placeholder="List of tasks"
                    value={item?.tasks}
                    onChange={(text) => {
                      item.tasks = text.target.value
                      setClientObj({
                        ...clientObj,
                      });
                    }}
                    type="text"
                    className="rounded-md border-2 border-[var(--red-900)] mt-1 outline-none text-neutral-500 bg-black p-2 icncolor w-full"
                  />
                </td>
                <td className="p-2">
                  <select
                    value={item?.status}
                    onChange={(text) => {
                      item.status = text.target.value
                      setClientObj({
                        ...clientObj,
                      });
                    }}
                    className="rounded-md border-2 border-[var(--red-900)] mt-1 outline-none text-neutral-500 bg-black p-2 icncolor w-full"

                  >
                    <option value="unpaid">Unpaid</option>
                    <option value="paid">Paid</option>
                  </select>

                </td>
                <td className="p-2">
                  <button
                    className="text-white bg-red-700 rounded-sm  text-md py-2 px-2 h-10"
                    onClick={() => {
                      if (index > -1) {
                        let mltns = clientObj.milestones;
                        mltns.splice(index, 1)
                        console.log(mltns)
                        setClientObj({
                          ...clientObj,
                          milestones: mltns
                        })
                      }
                    }}
                  >
                    Remove
                  </button>
                </td>
              </tr>))}
            </table>
          </div>

          <div className="grid grid-cols-1 md:mr-2 rounded-md border-2 border-[var(--red-900)] p-2 mt-5 ">
            <div className="flex justify-between">
              <p className="text-white text-lg font-semibold">Links</p>
              <button
                className="text-white bg-red-700 rounded-sm  text-md py-2 px-2 h-10"
                onClick={() => {
                  let mltns = clientObj.links;
                  mltns.push({
                    linkname: "",
                    linkurl: "",
                    linkusername: "",
                    linkpassword: "",
                  })
                  setClientObj({
                    ...clientObj,
                    links: mltns
                  })
                }}
              >
                Add Links
              </button>
            </div>

            <table className="mt-5">
              {clientObj.links.map((item, index) => (<tr key={index}>
                <td className="p-2">   <p className="text-white text-lg font-semibold">{index + 1}</p></td>
                <td className="p-2">
                  <input
                    placeholder="Name"
                    value={item?.linkname}
                    onChange={(text) => {
                      item.linkname = text.target.value
                      setClientObj({
                        ...clientObj,
                      });
                    }}
                    type="text"
                    className="rounded-md border-2 border-[var(--red-900)] mt-1 outline-none text-neutral-500 bg-black p-2 icncolor w-full"
                  />
                </td>
                <td className="p-2">
                  <input
                    placeholder="Link URL"
                    value={item?.linkurl}
                    onChange={(text) => {
                      item.linkurl = text.target.value
                      setClientObj({
                        ...clientObj,
                      });
                    }}
                    type="text"
                    className="rounded-md border-2 border-[var(--red-900)] mt-1 outline-none text-neutral-500 bg-black p-2 icncolor w-full"
                  />
                </td>
                <td className="p-2">
                  <input
                    placeholder="Link Username"
                    value={item?.linkusername}
                    onChange={(text) => {
                      item.linkusername = text.target.value
                      setClientObj({
                        ...clientObj,
                      });
                    }}
                    type="text"
                    className="rounded-md border-2 border-[var(--red-900)] mt-1 outline-none text-neutral-500 bg-black p-2 icncolor w-full"
                  />
                </td>
                <td className="p-2">
                  <input
                    placeholder="Link password"
                    value={item?.linkpassword}
                    onChange={(text) => {
                      item.linkpassword = text.target.value
                      setClientObj({
                        ...clientObj,
                      });
                    }}
                    type="text"
                    className="rounded-md border-2 border-[var(--red-900)] mt-1 outline-none text-neutral-500 bg-black p-2 icncolor w-full"
                  />
                </td>

                <td className="p-2">
                  {item?.linkurl && <button
                    className="text-white bg-red-700 rounded-sm  text-md py-2 px-2 h-10"
                  >
                    View
                  </button>}
                  <button
                    className="text-white bg-red-700 rounded-sm  text-md py-2 px-2 h-10"
                    onClick={() => {
                      if (index > -1) {
                        let lnk = clientObj.links;
                        lnk.splice(index, 1)
                        console.log(lnk)
                        setClientObj({
                          ...clientObj,
                          links: lnk
                        })
                      }
                    }}
                  >
                    Remove
                  </button>

                </td>
              </tr>))}
            </table>

            {submitted && clientObj.start_dev_date === "" && (
              <p className="text-red-700 mt-1">Phone Number is required</p>
            )}
          </div>


          <div className="grid grid-cols-1 md:mr-2 rounded-md border-2 border-[var(--red-900)] p-2 mt-5 ">
            <div className="flex justify-between">
              <p className="text-white text-lg font-semibold">Required Docs</p>
              <button
                className="text-white bg-red-700 rounded-sm  text-md py-2 px-2 h-10"
                onClick={() => {
                  let mltns = clientObj.required_items;
                  mltns.push({
                    docname: "",
                    docurl: "",
                    docusername: "",
                    docpassword: "",
                  })
                  setClientObj({
                    ...clientObj,
                    required_items: mltns
                  })
                }}
              >
                Add Doc
              </button>
            </div>

            <table className="mt-5">
              {clientObj.required_items.map((item, index) => (<tr key={index}>
                <td className="p-2">   <p className="text-white text-lg font-semibold">{index + 1}</p></td>
                <td className="p-2">
                  <input
                    placeholder="Doc name"
                    value={item?.docname}
                    onChange={(text) => {
                      item.docname = text.target.value
                      setClientObj({
                        ...clientObj,
                      });
                    }}
                    type="text"
                    className="rounded-md border-2 border-[var(--red-900)] mt-1 outline-none text-neutral-500 bg-black p-2 icncolor w-full"
                  />
                </td>
                <td className="p-2">
                  <input
                    placeholder="Doc URL"
                    value={item?.docurl}
                    onChange={(text) => {
                      item.docurl = text.target.value
                      setClientObj({
                        ...clientObj,
                      });
                    }}
                    type="text"
                    className="rounded-md border-2 border-[var(--red-900)] mt-1 outline-none text-neutral-500 bg-black p-2 icncolor w-full"
                  />
                </td>
                <td className="p-2">
                  <input
                    placeholder="Doc Username"
                    value={item?.docusername}
                    onChange={(text) => {
                      item.docusername = text.target.value
                      setClientObj({
                        ...clientObj,
                      });
                    }}
                    type="text"
                    className="rounded-md border-2 border-[var(--red-900)] mt-1 outline-none text-neutral-500 bg-black p-2 icncolor w-full"
                  />
                </td>
                <td className="p-2">
                  <input
                    placeholder="Doc password"
                    value={item.docpassword}
                    onChange={(text) => {
                      item.docpassword = text.target.value
                      setClientObj({
                        ...clientObj,
                      });
                    }}
                    type="text"
                    className="rounded-md border-2 border-[var(--red-900)] mt-1 outline-none text-neutral-500 bg-black p-2 icncolor w-full"
                  />
                </td>

                <td className="p-2 flex gap-1 w-full">
                  {item?.docurl && <button
                    className="text-white bg-red-700 rounded-sm  text-md py-2 px-2 h-10"
                  >
                    View
                  </button>}
                  <button
                    className="text-white bg-red-700 rounded-sm  text-md py-2 px-2 h-10"
                    onClick={() => {
                      if (index > -1) {
                        let lnk = clientObj.required_items;
                        lnk.splice(index, 1)
                        console.log(lnk)
                        setClientObj({
                          ...clientObj,
                          required_items: lnk
                        })
                      }
                    }}
                  >
                    Remove
                  </button>

                </td>
              </tr>))}
            </table>


          </div>





          <div className="flex justify-between mt-4">
            <button
              className="text-white bg-red-700 rounded-sm  text-md py-2 w-40 h-10"
              //   onClick={props.repeat === "Update Task" ? updateJob : submit}
              onClick={!!clienID ? submit : submit}
            >
              {!!clienID ? "Update Project" : "Register New Project"}
            </button>
            <button
              className="text-white bg-red-700 rounded-sm  text-md py-2 w-36 h-10"
              onClick={() => {
                props.setShowForm(false);
                setClientObj({
                  startDate: new Date(),
                  endDate: new Date(),
                  title: "",
                  location: "",
                  latitude: "",
                  longitude: "",
                  description: "",
                  jobtype: "event",
                  amount: "",
                  jobPerson: "",
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

export default Register;
