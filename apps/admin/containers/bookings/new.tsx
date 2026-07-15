"use client";
import { PropsRemotePageDefault } from "@/containers/types";
import { RemoteProviders } from "@/containers/RemoteProviders";
import NotImplementContent from "@/app/components/NotImplementContent";

export default function CreateBookingPage(props: PropsRemotePageDefault) {
    return (
        <RemoteProviders parentPage={props.parentPage}>
            <CreateBookingPageInner />
        </RemoteProviders>
    );
}

function CreateBookingPageInner() {
    return (
        <NotImplementContent/>
    );
}
