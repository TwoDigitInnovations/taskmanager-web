import { userContext } from "@/pages/_app";
import moment from "moment";
import { useContext, useState } from "react";
import ReactClipboard from 'react-clipboardjs-copy';
import { IoCopy } from "react-icons/io5";
import { FaExternalLinkSquareAlt } from "react-icons/fa";





export default function ProjectViewModal({ project, onClose, toaster }) {
    const [user, setUser] = useContext(userContext)
    if (!project) return null;

    const CopyText = ({ text }) => {
        return (
            <ReactClipboard action='copy' text={text} onSuccess={(e) => { console.log(e) }} onError={() => { }}>
                <button
                    className="ml-5 cursor-pointer"
                    onClick={() => {
                        toaster({ type: "success", message: 'Copied' })
                    }}
                >
                    <IoCopy className=" text-red-700 text-xl" />
                </button>
            </ReactClipboard>
        )
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white rounded-2xl shadow-xl w-11/12 max-w-4xl p-6 overflow-y-auto max-h-[90vh] pt-10">
                {/* Header */}
                <div className="flex justify-between items-center border-b pb-3">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Project Details
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-red-500"
                    >
                        ✕
                    </button>
                </div>

                {/* Project Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm">
                    <div>
                        <p className="font-semibold">Project Name:</p>
                        <p>{project.name}</p>
                    </div>
                    {user.type === "ADMIN" && <div>
                        <p className="font-semibold">Amount:</p>
                        <p>{project.amount}</p>
                    </div>}
                    <div>
                        <p className="font-semibold">Period:</p>
                        <p>{project.period}</p>
                    </div>
                    {user.type === "ADMIN" && <div>
                        <p className="font-semibold">Client:</p>
                        <p>{project.client_obj.fullName}</p>
                    </div>}
                    <div>
                        <p className="font-semibold">Design Start Date:</p>
                        {project.start_figma_date && <p>{moment(project.start_figma_date).format('DD/MM/YYYY')}</p>}
                    </div>
                    <div>
                        <p className="font-semibold">Development Start Date:</p>
                        {project.start_dev_date && <p>{moment(project.start_dev_date).format('DD/MM/YYYY')}</p>}
                    </div>
                </div>

                {/* Description */}
                <div className="mt-4">
                    <p className="font-semibold">Description:</p>
                    <p className="whitespace-pre-wrap">{project.description}</p>
                </div>

                {/* Platforms */}
                <div className="mt-4">
                    <p className="font-semibold">Platforms:</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                        {project.platforms?.map((p, i) => (
                            <span
                                key={i}
                                className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                            >
                                {p}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Milestones */}
                <div className="mt-6">
                    <p className="font-semibold mb-2">Milestones:</p>
                    <div className="space-y-3">
                        {project.milestones?.map((m, i) => (
                            <div key={i} className="p-3 border rounded-lg bg-gray-50">
                                {user.type === "ADMIN" && < p >
                                    <span className="font-semibold">Amount:</span> {m.amount}{" "}
                                    {m.currency}
                                </p>}
                                <p>
                                    <span className="font-semibold">Period:</span> {m.period}
                                </p>
                                <p>
                                    <span className="font-semibold">Tasks:</span> {m.tasks}
                                </p>
                                {user.type === "ADMIN" && <p>
                                    <span className="font-semibold">Status:</span> {m.status}
                                </p>}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Links */}
                <div className="mt-6">
                    <p className="font-semibold mb-2">Links:</p>
                    <ul className="space-y-2">
                        {project.links?.map((l, i) => (
                            <li key={i} className="p-2 border rounded-lg bg-gray-50">
                                {l?.linkname && <p>
                                    <span className="font-semibold">Name:</span> {l.linkname}
                                </p>}
                                {l?.linkurl && <p className="flex justify-start items-center">
                                    <span className="font-semibold">URL:</span>{" "}
                                    {l.linkurl}
                                    <button
                                        className="ml-5 cursor-pointer"
                                        onClick={() => {
                                            window.open(l.linkurl, '_blank')
                                        }}
                                    >
                                        <FaExternalLinkSquareAlt className=" text-red-700 text-xl" />
                                    </button>
                                </p>}
                                {l?.linkusername && <p className="flex justify-start items-center">
                                    <span className="font-semibold">Username:</span> {l.linkusername}
                                    <CopyText text={l.linkusername} />
                                </p>}
                                {l?.linkpassword && <p className="flex justify-start items-center">
                                    <span className="font-semibold">Password:</span> {l.linkpassword}
                                    <CopyText text={l.linkpassword} />
                                </p>}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Docs */}
                {user.type === "ADMIN" && <div className="mt-6">
                    <p className="font-semibold mb-2">Required Docs:</p>
                    <ul className="space-y-2">
                        {project.required_items?.map((d, i) => (
                            <li key={i} className="p-2 border rounded-lg bg-gray-50">
                                {d?.docname && <p>
                                    <span className="font-semibold">Doc Name:</span> {d.docname}
                                </p>}
                                {d?.docurl && <p className="flex justify-start items-center">
                                    <span className="font-semibold">URL:</span>{" "}

                                    {d.docurl}
                                    <button
                                        className="ml-5 cursor-pointer"
                                        onClick={() => {
                                            window.open(d.docurl, '_blank')
                                        }}
                                    >
                                        <FaExternalLinkSquareAlt className=" text-red-700 text-xl" />
                                    </button>
                                </p>}
                                {d?.docusername && <p className="flex justify-start items-center">
                                    <span className="font-semibold">Username:</span> {d?.docusername}
                                    <CopyText text={d?.docusername} />
                                </p>}
                                {d?.docpassword && <p className="flex justify-start items-center">
                                    <span className="font-semibold">Password:</span> {d?.docpassword}
                                    <CopyText text={d?.docpassword} />
                                </p>}
                            </li>
                        ))}
                    </ul>
                </div>}

                {/* Footer */}
                <div className="flex justify-end mt-6 border-t pt-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div >
    );
}
