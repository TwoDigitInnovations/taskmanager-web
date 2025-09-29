import Payroll from "@/components/billing2/payroll";
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