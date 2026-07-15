import {PropsRemotePageDefault} from '@/containers/types'
import {RemoteProviders} from '@/containers/RemoteProviders'
import NotImplementContent from "@/app/components/NotImplementContent";

export default function BookingListPage(props: PropsRemotePageDefault) {
    return (
        <RemoteProviders parentPage={props.parentPage}>
            <BookingListPageInner {...props} />
        </RemoteProviders>
    )
}

function BookingListPageInner({tenantId, locale, parentPage = -1}: PropsRemotePageDefault) {
    return <NotImplementContent/>
}
