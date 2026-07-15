"use client";
import {PropsRemotePageDefault} from "@/containers/types";
import { RemoteProviders } from "@/containers/RemoteProviders";
import NotImplementContent from "@/app/components/NotImplementContent";

export function WaitlistPage(props: PropsRemotePageDefault) {
    return (
        <RemoteProviders parentPage={props.parentPage}>
            <WaitlistPageInner {...props} />
        </RemoteProviders>
    );
}

function WaitlistPageInner({ tenantId, locale, parentPage = -1 }: PropsRemotePageDefault) {
    return <NotImplementContent/>}
