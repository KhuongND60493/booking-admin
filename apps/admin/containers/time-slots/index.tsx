import { PropsRemotePageDefault } from "@/containers/types";
import { RemoteProviders } from "@/containers/RemoteProviders";
import NotImplementContent from "@/app/components/NotImplementContent";

export default function TimeSlotsPage(props: PropsRemotePageDefault) {
    return (
        <RemoteProviders parentPage={props.parentPage}>
            <TimeSlotsPageInner />
        </RemoteProviders>
    );
}

function TimeSlotsPageInner() {
    return (
        <NotImplementContent/>
    );
}
