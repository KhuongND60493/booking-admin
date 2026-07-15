
interface INotImplementContentProps {
    title?: string
}
export default ({title = 'Page'}:INotImplementContentProps) => {
    return <div className="p-8">
        <p className="text-xs text-gray-500 mb-6">{title} chưa được implement</p>

        <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-2xl text-sm text-gray-400">
            Chưa có dữ liệu — trang này đang ở dạng demo
        </div>
    </div>
}
