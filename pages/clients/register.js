/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/no-unknown-property */
import { useState, useEffect, useContext } from "react";
import { Api } from "@/src/services/service";
import { checkForEmptyKeys } from "@/src/services/InputsNullChecker";
import LocationDropdown from "@/components/LocationDropdown";
import { userContext } from "../_app";

const options = [];

const Register = (props) => {
  const { clienID } = props;
  const [submitted, setSubmitted] = useState(false);
  const [taskList, setTaskList] = useState([]);
  const [user, setUser] = useContext(userContext)
  const [clientObj, setClientObj] = useState({
    fullName: "",
    billingName: "",
    email: "",
    phoneNumber: "",
  });

  useEffect(() => {
    const getClientList = () => {
      props.loader(true);
      Api("get", `provider/client/${clienID}`, "", props.router).then(
        async (res) => {
          props.loader(false);
          if (res?.status) {
            const client = res.data.clients.find((c) => c._id === clienID);
            setClientObj({
              fullName: client.fullName,
              billingName: client.billingName,
              email: client.email,
              phoneNumber: client.phoneNumber,
            });
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
    if (!!clienID) {
      getClientList();
    }
    getConfig()
  }, [clienID, props]);

  const getConfig = () => {
    Api("get", "user/config", "", props.router).then((res) => {
      if (res.status) {
        setTaskList(res.data.title);
      } else {
        props.toaster({ type: "error", message: res.message });
      }
    });
  };
  const submit = () => {
    // const user = localStorage.getItem("userDetail");

    let { anyEmptyInputs } = checkForEmptyKeys(clientObj);
    if (anyEmptyInputs.length > 0) {
      setSubmitted(true);
      return;
    }
    const Client = {
      ...clientObj,
      organization: user.id
    };

    console.log(Client)
    Api("post", "provider/regClient", Client, props.router).then((res) => {
      props.loader(false);
      props.setShowForm(false);
      props.getClientList();
      if (res.status) {
        setClientObj({
          fullName: "",
          billingName: "",
          email: "",
          phoneNumber: "",
        });
      } else {
        props.toaster({ type: "error", message: res.message });
      }
    });
  };

  const Update = () => {

    let { anyEmptyInputs } = checkForEmptyKeys(clientObj);
    console.log(anyEmptyInputs);
    if (anyEmptyInputs.length > 0) {
      if (anyEmptyInputs.includes("VAT") || anyEmptyInputs.includes("VAT")) {
      } else {
        setSubmitted(true);
        return;
      }
    }

    const Client = {
      ...clientObj,
      organization: user.isOrganization ? user._id : undefined
    };

    Api("put", `provider/client/${clienID}`, Client, props.router).then(
      (res) => {
        props.loader(false);
        props.setShowForm(false);
        props.getClientList();
        if (res.status) {
          setClientObj({
            fullName: "",
            billingName: "",
            email: "",
            phoneNumber: "",
          });
        } else {
          props.toaster({ type: "error", message: res.message });
        }
      }
    );
  };


  return (
    <div className=" bg-white overflow-x-auto">
      <div className="mt-16 mb-5 bg-[var(--mainLightColor)]">
        <div className="grid grid-cols-2 bg-[var(--mainColor)] md:px-5 p-3 rounded-sm  border-t-4 border-[var(--customYellow)] ">
          <div>
            <p className="text-white font-bold md:text-3xl text-lg">
              {!!clienID ? "Update Client" : "Register new client"}
            </p>
          </div>
        </div>

        <div className=" border-2 border-[var(--mainColor)] rounded-sm p-5">
          <div className="grid md:grid-cols-2 grid-cols-1 items-start">
            <div className="grid grid-cols-1 md:mr-2">
              <p className="text-black text-lg font-semibold">
                Client name{" "}
              </p>
              <input
                value={clientObj.fullName}
                onChange={(text) => {
                  setClientObj({ ...clientObj, fullName: text.target.value });
                }}
                className="rounded-md border-2 border-[var(--mainColor)] mt-1 outline-none text-neutral-500 bg-[var(--white)] p-2 icncolor"
              />
              {submitted && clientObj.fullName === "" && (
                <p className="text-[var(--mainColor)] mt-1">Full Name is required</p>
              )}
            </div>
            <div className="grid grid-cols-1 ">
              <p className="text-black text-lg font-semibold">Billing Name</p>
              <input
                value={clientObj.billingName}
                onChange={(text) => {
                  setClientObj({
                    ...clientObj,
                    billingName: text.target.value,
                  });
                }}
                className="rounded-md border-2 border-[var(--mainColor)] mt-1 outline-none text-black bg-[var(--white)] p-2 icncolor"
              />
              {submitted && clientObj.billingName === "" && (
                <p className="text-[var(--mainColor)] mt-1">Billing Name is required</p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 grid-cols-1 items-start mt-3 ">
            <div className="grid grid-cols-1 md:mr-2">
              <p className="text-black text-lg font-semibold">Email</p>
              <input
                value={clientObj.email}
                onChange={(text) => {
                  setClientObj({ ...clientObj, email: text.target.value });
                }}
                className="rounded-md border-2 border-[var(--mainColor)] mt-1 outline-none text-black bg-[var(--white)] p-2 icncolor"
              />
              {submitted && clientObj.email === "" && (
                <p className="text-[var(--mainColor)] mt-1">Email is required</p>
              )}
            </div>
            <div className="grid grid-cols-1 md:mr-2">
              <p className="text-black text-lg font-semibold">Phone Number</p>
              <input
                value={clientObj.phoneNumber}
                onChange={(text) => {
                  setClientObj({
                    ...clientObj,
                    phoneNumber: text.target.value,
                  });
                }}
                type="number"
                className="rounded-md border-2 border-[var(--mainColor)] mt-1 outline-none text-black bg-[var(--white)] p-2 icncolor"
              />
              {submitted && clientObj.phoneNumber === "" && (
                <p className="text-[var(--mainColor)] mt-1">Phone Number is required</p>
              )}
            </div>
          </div>


          <div className="flex justify-between mt-4">
            <button
              className="text-white bg-[var(--mainColor)] rounded-sm  text-md py-2 w-40 h-10"
              //   onClick={props.repeat === "Update Task" ? updateJob : submit}
              onClick={!!clienID ? Update : submit}
            >
              {!!clienID ? "Update client" : "Register new client"}
            </button>
            <button
              className="text-white bg-[var(--mainColor)] rounded-sm  text-md py-2 w-36 h-10"
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
