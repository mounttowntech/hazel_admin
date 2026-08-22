import { useRef } from "react";

const OTPInput = ({ otp, setOtp }) => {
  const inputRefs = useRef([]);

  const handleChange = (value, index) => {
    if (!/^\d*$/.test(value)) {
      return;
    }

    const newOtp = otp.split("");

    newOtp[index] = value.slice(-1);

    const updatedOtp = newOtp.join("").slice(0, 6);

    setOtp(updatedOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (event, index) => {
    if (
      event.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();

    const pastedData = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    setOtp(pastedData);

    if (pastedData.length > 0) {
      const lastIndex = Math.min(pastedData.length - 1, 5);
      inputRefs.current[lastIndex]?.focus();
    }
  };

  return (
    <div className="otp-input-container">
      {Array.from({ length: 6 }).map((_, index) => (
        <input
          key={index}
          ref={(element) => {
            inputRefs.current[index] = element;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={otp[index] || ""}
          onChange={(event) =>
            handleChange(event.target.value, index)
          }
          onKeyDown={(event) =>
            handleKeyDown(event, index)
          }
          onPaste={handlePaste}
          className="otp-input"
          aria-label={`OTP digit ${index + 1}`}
        />
      ))}
    </div>
  );
};

export default OTPInput;