import { pageConfigs, toPuckData } from "@skybooking/puck-config";
import { Render } from "@measured/puck/rsc";
import { NEUTRAL_THEME } from "@skybooking/api-client";
import { StoreListProvider } from "@skybooking/hooks";
import { BookingPageShell } from "../BookingPageShell";

export default async function HomePage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant } = await params;
  const data = toPuckData("home", null);

  return (
    <BookingPageShell tenant={tenant} storeId={null} theme={NEUTRAL_THEME}>
      <StoreListProvider>
        <Render config={pageConfigs.home} data={data as any} />
      </StoreListProvider>
    </BookingPageShell>
  );
}
