;import {PropsRemotePageDefault} from "@/containers/types";
import { RemoteProviders } from "@/containers/RemoteProviders";
import NotImplementContent from "@/app/components/NotImplementContent";


export default function EditLayoutIndexPage(props: PropsRemotePageDefault) {
    return (
        <RemoteProviders parentPage={props.parentPage}>
            <EditLayoutIndexPageInner />
        </RemoteProviders>
    );
}

function EditLayoutIndexPageInner() {
    return (
    <NotImplementContent/>
);
}
