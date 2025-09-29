import AuthGuard from "@/components/AuthGuard"
import AuthGuard from "./AuthGuard";

const payroll = (props) => {
    return (
        <AuthGuard allowedRoles={["ADMIN"]}>
            <div className="min-h-screen bg-black overflow-x-auto py-5 md:mt-0 mt-0">
                <Payroll {...props} />
            </div>
        </AuthGuard>
    )
}

export default payroll