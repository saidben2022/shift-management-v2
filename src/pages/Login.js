import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useToast } from "../components/ui/use-toast";
import { useAuth } from "../context/AuthContext";
import { Card, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { api } from "../lib/api";
import { Spinner } from "@/components/ui/spinner";
export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();
    const { login } = useAuth();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await api.post('/api/auth/login', { username, password });
            if (response.data) {
                // First set the token and update auth state
                await login(response.data.token);
                toast({
                    title: "Success",
                    description: "Successfully logged in!",
                    variant: "success",
                });
                // Navigate after state is updated
                navigate("/dashboard", { replace: true });
            }
        }
        catch (error) {
            console.error("Login error:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "An error occurred while logging in. Please try again.",
            });
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50/30", children: _jsxs(Card, { className: "w-[350px] border border-indigo-100 overflow-hidden bg-white/80 backdrop-blur-sm", children: [_jsxs(CardHeader, { className: "space-y-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-6", children: [_jsx("div", { className: "flex justify-center mb-6", children: _jsx("img", { src: "/logo.png", alt: "Workers Management System", className: "h-16 w-auto" }) }), _jsx(CardTitle, { className: "text-2xl text-center font-semibold", children: "Login" }), _jsx(CardDescription, { className: "text-center text-indigo-100", children: "Enter your credentials to access your account" })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6 p-8", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "username", className: "text-gray-700", children: "Username" }), _jsx(Input, { id: "username", type: "text", value: username, onChange: (e) => setUsername(e.target.value), className: "w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500", required: true })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "password", className: "text-gray-700", children: "Password" }), _jsx(Input, { id: "password", type: "password", value: password, onChange: (e) => setPassword(e.target.value), className: "w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500", required: true })] }), _jsxs(Button, { type: "submit", className: "w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 transition-all duration-200", disabled: isLoading, children: [isLoading ? (_jsx(Spinner, { size: "sm", className: "mr-2" })) : null, isLoading ? "Logging in..." : "Login"] })] })] }) }));
}
