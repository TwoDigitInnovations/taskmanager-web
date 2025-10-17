/* eslint-disable react-hooks/exhaustive-deps */
import Table, { indexID } from "../table";
import React, { useContext, useMemo, useState } from "react";
import { IoEyeSharp } from "react-icons/io5";
import { RiDeleteBinFill } from "react-icons/ri";
import { MdDeleteForever, MdModeEditOutline } from "react-icons/md";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { Api } from "@/src/services/service";
import { useRouter } from "next/router";
import { userContext } from "@/pages/_app";
import ProjectViewModal from "./ProjectViewModal";
import { SlGraph } from "react-icons/sl";


function ProjectTable(props) {
    const router = useRouter();
    const [open, setOpen] = useState(false)
    const [type, setType] = useState('')
    const [client, setClient] = useState({})
    const [user, setUser] = useContext(userContext)
    const [showModal, setShowModal] = useState(false);

    const columns = useMemo(
        () => [
            {
                Header: "ID",
                Cell: indexID,
                // accessor: "indexID",
            },
            {
                Header: "Name",
                accessor: "name",
            },
            {
                Header: "Period",
                accessor: "period",
            },
            {
                Header: "Closed Date",
                accessor: "createdAt",
            },
            // {
            //   Header: "Status",
            //   accessor: "status",
            //   Cell: verifyCol,

            // },
            {
                Header: "Action",
                Cell: ActionSection,
            },
        ],
        []
    );



    function verifyCol({ value }) {
        return (
            <div className="flex justify-start items-center ">
                <p className={`${value === 'Verified' ? 'text-green-700' : 'text-[var(--customYellow)]'}`}>{value}</p>
            </div>
        );
    };

    function ActionSection({ row }) {
        return (
            <div className="flex ">
                {user.type === 'ADMIN' && <div
                    className="h-7 w-9 bg-[var(--customYellow)] rounded-sm ml-2 flex justify-center items-center cursor-pointer"
                    onClick={() => {
                        router.push(`/projects/${row.original._id}`)
                    }}
                >
                    <SlGraph className="text-black h-4 w-4 " />
                </div>}
                {user.type === 'ADMIN' && <div
                    className="h-7 w-9 bg-[var(--customYellow)] rounded-sm ml-2 flex justify-center items-center cursor-pointer"
                    onClick={() => {
                        props.setClientID(row.original._id);
                        props.setShowForm(true);
                        props.goToTop();
                    }}
                >
                    <MdModeEditOutline className="text-black h-4 w-4 " />
                </div>}
                {user.type === 'ADMIN' && <div
                    className="h-7 w-9 bg-[var(--customYellow)] rounded-sm ml-2 flex justify-center items-center cursor-pointer"
                    onClick={() => {
                        props.deleteClient(row.original._id);
                    }}
                >
                    <RiDeleteBinFill className="text-black h-4 w-4 " />
                </div>}
                <div
                    className="h-7 w-9 bg-[var(--customYellow)] rounded-sm ml-2 flex justify-center items-center cursor-pointer"
                    onClick={() => {
                        setClient(row.original)
                        setShowModal(true)
                    }}
                >
                    <IoEyeSharp className="text-black h-4 w-4 " />
                </div>

            </div>
        );
    }

    function statusSection({ value }) {
        return <p className={`${"text-green-700"} text-semibold`}>Done</p>;
    }

    return (
        <>
            <Table columns={columns} data={props.data} />
            {showModal && (
                <ProjectViewModal
                    {...props}
                    project={client}
                    onClose={() => setShowModal(false)}
                />
            )}
        </>

    );


}

export default ProjectTable;
