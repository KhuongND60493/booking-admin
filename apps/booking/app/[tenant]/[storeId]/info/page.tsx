import { pageConfigs, toPuckData } from "@skybooking/puck-config";
import { Render } from "@measured/puck/rsc";
import { pageConfigApi, storeThemeApi, NEUTRAL_THEME } from "@skybooking/api-client";
import { BookingPageShell } from "../../../BookingPageShell";

export default async function CustomerInfoPage({
  params,
}: {
  params: Promise<{ tenant: string; storeId: string }>;
}) {
  const { tenant, storeId } = await params;
  const [theme, config] = await Promise.all([
    storeThemeApi.fetchTheme(storeId).catch(() => NEUTRAL_THEME),
    pageConfigApi.fetchConfig(storeId, "customerInfo").catch(() => null),
  ]);
  const data = toPuckData("customerInfo", config);

  return (
    <BookingPageShell tenant={tenant} storeId={storeId} theme={theme}>
      <Render config={pageConfigs.customerInfo} data={data as any} />
    </BookingPageShell>
  );
}
