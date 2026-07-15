import { PropsRemotePageDefault } from "@/containers/types";
import { RemoteProviders } from "@/containers/RemoteProviders";
import NotImplementContent from "@/app/components/NotImplementContent";

export default function SettingsPage(props: PropsRemotePageDefault) {
    return (
        <RemoteProviders parentPage={props.parentPage}>
            <SettingsPageInner />
        </RemoteProviders>
    );
}

function SettingsPageInner() {
    return (
        <NotImplementContent/>
    );
}
