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

// Module Federation expose (next.config.js: './WaitlistPage') + host (loadWebpackRemote)
// đều lấy component qua module.default — thiếu default export khiến host nhận nguyên module
// namespace object thay vì component, React ném "Element type is invalid" (minified #306).
// Các container khác đều export default, giữ nhất quán convention.
export default WaitlistPage;

function WaitlistPageInner({ tenantId, locale, parentPage = -1 }: PropsRemotePageDefault) {
    return <NotImplementContent/>}
