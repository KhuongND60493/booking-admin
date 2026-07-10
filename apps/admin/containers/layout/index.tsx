import Link from "next/link";
import { PAGE_KEYS } from "@skybooking/api-client";
import { PAGE_LABELS } from "./pageLabels";
import {PropsRemotePageDefault} from "@/containers/types";


export default function EditLayoutIndexPage(props: PropsRemotePageDefault) {
    return (
        <div className="p-8">
            <h1 className="font-heading text-xl font-bold text-gray-900 mb-1">Chỉnh sửa layout trang booking</h1>
            <p className="text-xs text-gray-500 mb-6">Chọn 1 trang để tuỳ chỉnh giao diện, hoặc cấu hình theme dùng chung</p>

            <Link
                href="/edit-layout/theme"
                className="block bg-white border-2 border-amber-400 rounded-lg p-4 max-w-2xl mb-4 hover:bg-amber-50"
            >
                <div className="text-sm font-semibold text-amber-600">🎨 Theme (màu &amp; font)</div>
                <div className="text-[10px] text-gray-400 mt-1">Cấu hình chung cho toàn bộ store</div>
            </Link>

            <div className="grid grid-cols-2 gap-3 max-w-2xl">
                {PAGE_KEYS.map((page) => (
                    <Link
                        key={page}
                        href={`/edit-layout/${page}`}
                        className="bg-white border border-gray-200 rounded-lg p-4 hover:border-amber-400"
                    >
                        <div className="text-sm font-semibold text-gray-900">{PAGE_LABELS[page]}</div>
                        <div className="text-[10px] text-gray-400 font-mono mt-1">{page}</div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
