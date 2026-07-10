import type { Config } from "@measured/puck";
import { WaitlistIntro1, WaitlistFormFields1 } from "@skybooking/ui";

type Props = {
  WaitlistIntro1: Record<string, never>;
  WaitlistFormFields1: { heading: string };
};

export const waitlistConfig: Config<Props> = {
  categories: {
    waitlist: { title: "Waitlist", components: ["WaitlistIntro1", "WaitlistFormFields1"] },
  },
  components: {
    WaitlistIntro1: {
      label: "Banner hết bàn",
      fields: {},
      defaultProps: {},
      render: () => <WaitlistIntro1 />,
    },
    WaitlistFormFields1: {
      label: "Form đăng ký chờ bàn",
      fields: { heading: { type: "text" } },
      defaultProps: { heading: "Đăng ký chờ bàn" },
      render: ({ puck, ...props }) => <WaitlistFormFields1 {...props} />,
    },
  },
};

export default waitlistConfig;
