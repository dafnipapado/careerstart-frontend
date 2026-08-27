import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {type LoginCredentials, loginSchema} from "../schemas/auth.ts";
import {Field, FieldLabel} from "@/components/ui/field.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useAuth} from "@/context/AuthProvider.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Link, useNavigate} from "react-router";
import type {ErrorResponse} from "@/schemas/error.ts";
import {toast} from "sonner";

const LoginPage = () => {

    const { loginUser } = useAuth();
    const role = useAuth().role?.toLowerCase().replace("_", "");
    const navigate = useNavigate();

    if (useAuth().isAuthenticated) {
        navigate(`/${role}/dashboard`)
    }

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
            navigate(`/${role}/dashboard`)
        } catch (error) {
            const err = error as ErrorResponse
            toast.error(err.message)
        }
    }

    return (
        <>
            <div className="w-1/2 h-[67vh] mx-auto my-auto bg-white p-5 border-2 rounded-sm">
                <h1 className="font-sans font-semibold text-3xl text-font-dark-purple">Login</h1>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-8 w-2/3 mx-auto pt-5"
                >
                    <Field>
                        <FieldLabel htmlFor="username" className="font-sans text-lg">Username</FieldLabel>
                        <Input id="username" type="text" {...register("username")}></Input>
                        <div className="h-1 text-sm/0 text-start text-error-dark-red">
                            {errors.username && (
                                <div>{errors.username.message}</div>
                            )}
                        </div>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="password" className="font-sans text-lg">Password</FieldLabel>
                        <Input id="password" type="password" {...register("password")}></Input>
                        <div className="h-1 text-sm/0 text-start text-error-dark-red">
                            {errors.password && (
                                <div>{errors.password.message}</div>
                            )}
                        </div>
                    </Field>
                    <Button type="submit" className="w-1/2 mx-auto font-sans font-semibold text-lg bg-font-dark-purple hover:bg-hover-dark-purple py-5 mt-3 cursor-pointer">
                        {isSubmitting ? <span className="cursor-progress">"Logging in..."</span> : "Login"}
                    </Button>
                </form>
                <div className="mt-5">
                    <p className="text-sm">Don't have an account?</p>
                    <div className="flex justify-center gap-5 text-sm text-font-link-blue">
                        <Link to="/" className="hover:underline">Sign up as a job seeker</Link>
                        <Link to="/" className="hover:underline">Sign up as an employer</Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default LoginPage