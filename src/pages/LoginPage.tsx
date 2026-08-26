import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {type LoginCredentials, loginSchema} from "../schemas/auth.ts";
import {Field, FieldLabel} from "@/components/ui/field.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useAuth} from "@/context/AuthProvider.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useNavigate} from "react-router";
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
            <form
                onSubmit={handleSubmit(onSubmit)}
            >
                <Field>
                    <FieldLabel htmlFor="username">Username</FieldLabel>
                    <Input id="username" type="text" {...register("username")}></Input>
                    {errors.username && (
                        <div>{errors.username.message}</div>
                    )}
                </Field>
                <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input id="password" type="password" {...register("password")}></Input>
                    {errors.password && (
                        <div>{errors.password.message}</div>
                    )}
                </Field>
                <Button type="submit">
                    {isSubmitting ? "Logging in..." : "Login"}
                </Button>
            </form>
        </>
    )
}

export default LoginPage