import type { Config } from "@measured/puck";
import { OtpHeader1, OtpCodeInput1 } from "@skybooking/ui";

type Props = {
  OtpHeader1: { heading: string };
  OtpCodeInput1: Record<string, never>;
};

export const otpConfig: Config<Props> = {
  categories: {
    otp: { title: "Xác thực OTP", components: ["OtpHeader1", "OtpCodeInput1"] },
  },
  components: {
    OtpHeader1: {
      label: "Header OTP",
      fields: { heading: { type: "text" } },
      defaultProps: { heading: "Nhập mã xác thực" },
      render: ({ puck, ...props }) => <OtpHeader1 {...props} />,
    },
    OtpCodeInput1: {
      label: "Nhập mã OTP",
      fields: {},
      defaultProps: {},
      render: () => <OtpCodeInput1 />,
    },
  },
};

export default otpConfig;
