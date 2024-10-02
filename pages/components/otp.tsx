import axios from "axios";
import { LoaderCircle } from "lucide-react";
import React from "react";
import OtpInput from "react-otp-input";
import { toast } from "sonner";

const Otp: React.FC<{
  onVerify: () => void;
}> = ({ onVerify }) => {
  const [otp, setOtp] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await axios.post("/api/auth/verify-otp", { otp });
      setLoading(false);
      toast.success("OTP verified");
      onVerify();
    } catch (error: any) {
      toast.error(error.response.data.error || "Could not verify OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-full max-w-[400px] mx-auto bg-black-001 rounded-xl px-5 py-10 flex flex-col"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="text-center text-3xl font-bold">Dropp.</h2>
      <p className="text-center text-sm">Enter the OTP sent to your email.</p>
      <div className="w-full mt-5 justify-center flex items-center">
        <OtpInput
          value={otp}
          onChange={setOtp}
          numInputs={4}
          renderSeparator={<span>-</span>}
          renderInput={(props) => (
            <input
              {...props}
              className="!size-10 text-black selection:bg-transparent outline-none font-semibold text-3xl"
            />
          )}
        />
      </div>
      <button
        className="bg-white text-black rounded-xl font-semibold p-3 mt-5 disabled:opacity-50 flex items-center justify-center disabled:cursor-not-allowed"
        type="submit"
        disabled={loading || otp.length !== 4}
        onClick={handleSubmit}
      >
        {loading ? <LoaderCircle className="animate-spin" /> : "Verify"}
      </button>
    </div>
  );
};

export default Otp;
