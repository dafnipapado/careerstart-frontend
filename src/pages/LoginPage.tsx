import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {type LoginCredentials, loginSchema} from "../schemas/auth.ts";
import {Field, FieldLabel} from "@/components/ui/field.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useAuth} from "@/context/AuthProvider.tsx";
import {Link, useNavigate} from "react-router";
import type {ErrorResponse} from "@/schemas/error.ts";
import {toast} from "sonner";
import FieldErrorMessage from "@/components/shared/FieldErrorMessage.tsx";
import {useEffect} from "react";
import CustomButton from "@/components/shared/CustomButton.tsx";
import {getErrorMessage} from "@/utils/errorMessages.ts";

const LoginPage = () => {

    const { isAuthenticated, loginUser, role } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate(`/${role?.toLowerCase()}/dashboard`)
        }
    }, [isAuthenticated, role, navigate]);

    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting}
    } = useForm<LoginCredentials>({
        resolver: zodResolver(loginSchema)
    })

    const onSubmit = async (data: LoginCredentials): Promise<void | ErrorResponse> => {
        try {
            await loginUser(data);
            toast.success("Logged in successfully")
        } catch (error) {
            const err = error as ErrorResponse
            toast.error(getErrorMessage(err.code))
        }
    }

    return (
        <>
            <div className="w-1/2 h-[67vh] mx-auto my-auto bg-surface p-5 mt-12 border border-gray-200 rounded-sm shadow-xl shadow-surface-elevated">
                <h1 className="font-sans font-semibold text-3xl">Welcome back!</h1>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-8 w-2/3 mx-auto pt-5"
                >
                    <Field>
                        <FieldLabel htmlFor="username" className="font-sans text-lg">Username</FieldLabel>
                        <div>
                            <Input id="username" type="text" {...register("username")}></Input>
                            <FieldErrorMessage error = {errors.username}/>
                        </div>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="password" className="font-sans text-lg">Password</FieldLabel>
                        <div>
                            <Input id="password" type="password" {...register("password")}></Input>
                            <FieldErrorMessage error = {errors.password} />
                        </div>
                    </Field>
                    <CustomButton
                        type="submit"
                        label={isSubmitting ? "Logging in..." : "Login"}
                        addClasses={`w-1/2 mx-auto! ml-0 font-sans font-semibold text-lg mt-3 ${isSubmitting ? "cursor-progress" : "cursor-pointer"}`}>
                    </CustomButton>
                </form>
                <div className="mt-5">
                    <p className="text-sm">Don't have an account?</p>
                    <div className="flex justify-center text-sm text-link-blue">
                        <Link to="/register" className="hover:underline">Sign up here</Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default LoginPage