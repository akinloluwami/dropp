import axios from "axios";
import { LoaderCircle } from "lucide-react";
import React from "react";
import { toast } from "sonner";

const ForgotPassword: React.FC<{
  onPasswordReset: () => void;
}> = ({ onPasswordReset }) => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [isPasswordResetTokenSent, setIsPasswordResetTokenSent] =
    React.useState(false);

  const [passwordChangePayload, setPasswordChangePayload] = React.useState<{
    email: string;
    password: string;
    passwordConfirm: string;
    resetToken: string;
  }>({
    email: "",
    password: "",
    passwordConfirm: "",
    resetToken: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isPasswordResetTokenSent) {
        if (!passwordChangePayload.resetToken) {
          setError("Please enter an OTP");
          return;
        }

        if (
          passwordChangePayload.password !==
          passwordChangePayload.passwordConfirm
        ) {
          setError("Passwords do not match");
          return;
        }
        if (passwordChangePayload.password.length < 8) {
          setError("Password should be at least 8 characters");
          return;
        }
        await axios.post("/api/auth/reset-password", passwordChangePayload);
        onPasswordReset();
        toast.success("Password reset successfully");
        setTimeout(() => {
          toast.info("Please login with your new password");
        }, 400);
      } else {
        await axios.post("/api/auth/forgot-password", {
          email: passwordChangePayload.email,
        });
        setIsPasswordResetTokenSent(true);
      }
    } catch (error: any) {
      setError(error.response.data.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <form
      className="w-full max-w-[400px] mx-auto bg-black-001 rounded-xl px-5 py-10 flex flex-col"
      onSubmit={handleSubmit}
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="text-center text-3xl font-bold">Dropp.</h2>
      {isPasswordResetTokenSent && (
        <p className="text-center text-sm">Create a new password</p>
      )}

      {isPasswordResetTokenSent ? (
        <>
          <input
            type="text"
            name="otp"
            placeholder="OTP"
            value={passwordChangePayload.resetToken}
            className="bg-[#242424]/40 p-3 rounded-xl mt-5 outline-none"
            onChange={(e) => {
              setPasswordChangePayload({
                ...passwordChangePayload,
                resetToken: e.target.value,
              });
            }}
          />

          <input
            type="password"
            placeholder="Password"
            value={passwordChangePayload.password}
            className="bg-[#242424]/40 p-3 rounded-xl mt-5 outline-none"
            onChange={(e) => {
              setPasswordChangePayload({
                ...passwordChangePayload,
                password: e.target.value,
              });
            }}
          />
          <input
            type="password"
            placeholder="Password Confirmation"
            value={passwordChangePayload.passwordConfirm}
            className="bg-[#242424]/40 p-3 rounded-xl mt-5 outline-none"
            onChange={(e) => {
              setPasswordChangePayload({
                ...passwordChangePayload,
                passwordConfirm: e.target.value,
              });
            }}
          />
          <button
            className="bg-white text-black rounded-xl font-semibold p-3 mt-5 w-full disabled:opacity-50 flex items-center justify-center disabled:cursor-not-allowed"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              "Update Password"
            )}
          </button>
        </>
      ) : (
        <>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={passwordChangePayload.email}
            onChange={(e) => {
              setPasswordChangePayload({
                ...passwordChangePayload,
                email: e.target.value,
              });
            }}
            className="bg-[#242424]/40 p-3 rounded-xl mt-7 outline-none"
          />
          <button
            className="bg-white text-black rounded-xl font-semibold p-3 mt-5 w-full disabled:opacity-50 flex items-center justify-center disabled:cursor-not-allowed"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              "Reset Password"
            )}
          </button>
        </>
      )}
      {error && <p className="text-red-500 text-center mt-2">{error}</p>}
    </form>
  );
};

export default ForgotPassword;
