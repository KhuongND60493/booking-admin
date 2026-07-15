import { pageConfigs, toPuckData } from "@skybooking/puck-config";
import { Render } from "@measured/puck/rsc";
import { pageConfigApi, storeThemeApi, NEUTRAL_THEME } from "@skybooking/api-client";
import { TableSelectionProvider } from "@skybooking/hooks";
import { BookingPageShell } from "../../../BookingPageShell";

export default async function TableSelectionPage({
  params,
}: {
  params: Promise<{ tenant: string; storeId: string }>;
}) {
  const { tenant, storeId } = await params;
  const [theme, config] = await Promise.all([
    storeThemeApi.fetchTheme(storeId).catch(() => NEUTRAL_THEME),
    pageConfigApi.fetchConfig(storeId, "tableSelection").catch(() => null),
  ]);
  const data = toPuckData("tableSelection", config);

  return (
    <BookingPageShell tenant={tenant} storeId={storeId} theme={theme}>
      <TableSelectionProvider>
        <Render config={pageConfigs.tableSelection} data={data as any} />
      </TableSelectionProvider>
    </BookingPageShell>
  );
}
