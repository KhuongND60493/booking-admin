import { PropsRemotePageDefault } from "@/containers/types";
import { RemoteProviders } from "@/containers/RemoteProviders";

export default function SettingsPage(props: PropsRemotePageDefault) {
    return (
        <RemoteProviders parentPage={props.parentPage}>
            <SettingsPageInner />
        </RemoteProviders>
    );
}

function SettingsPageInner() {
    return (
        <div className="p-8">
            <h1 className="font-heading text-xl font-bold text-gray-900 mb-1">Cấu hình</h1>
            <p className="text-xs text-gray-500 mb-6">Demo — cấu hình chung của module booking sẽ hiển thị ở đây</p>

            <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-2xl text-sm text-gray-400">
                Chưa có dữ liệu — trang này đang ở dạng demo, chưa nối API.
            </div>
        </div>
    );
}
