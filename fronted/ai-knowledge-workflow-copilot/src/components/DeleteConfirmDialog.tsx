import * as AlertDialog from '@radix-ui/react-alert-dialog'

type DeleteConfirmDialogProps = {
  filename: string
  isDeleting: boolean
  disabled: boolean
  onConfirm: () => void
}

function DeleteConfirmDialog({
  filename,
  isDeleting,
  disabled,
  onConfirm,
}: DeleteConfirmDialogProps) {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <button
          className="rounded-lg px-2.5 py-1 text-xs font-medium text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:text-slate-400"
          type="button"
          disabled={disabled}
        >
          {isDeleting ? '删除中...' : '删除'}
        </button>
      </AlertDialog.Trigger>

      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm" />
        <AlertDialog.Content className="fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl outline-none">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-xl text-rose-600">
            !
          </div>

          <AlertDialog.Title className="text-lg font-bold text-slate-950">
            确认删除文档？
          </AlertDialog.Title>

          <AlertDialog.Description className="mt-2 text-sm leading-6 text-slate-500">
            删除后，文档会从当前知识库移除。文件名：
            <span className="font-semibold text-slate-800">{filename}</span>
          </AlertDialog.Description>

          <div className="mt-6 flex justify-end gap-3">
            <AlertDialog.Cancel asChild>
              <button
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                type="button"
              >
                取消
              </button>
            </AlertDialog.Cancel>

            <AlertDialog.Action asChild>
              <button
                className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700"
                type="button"
                onClick={onConfirm}
              >
                确认删除
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
}

export default DeleteConfirmDialog
