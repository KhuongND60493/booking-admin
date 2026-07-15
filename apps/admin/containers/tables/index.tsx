import { PropsRemotePageDefault } from "@/containers/types";
import { RemoteProviders } from "@/containers/RemoteProviders";
import NotImplementContent from "@/app/components/NotImplementContent";

export default function TablesPage(props: PropsRemotePageDefault) {
    return (
        <RemoteProviders parentPage={props.parentPage}>
            <TablesPageInner />
        </RemoteProviders>
    );
}

function TablesPageInner() {
    return (
        <NotImplementContent/>
    );
}
