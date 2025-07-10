import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

const ConfirmDialog = ({
  open,
  title = 'Confirm',
  message = 'Are you sure?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
}) => (
  <Transition.Root show={open} as={Fragment}>
    <Dialog as="div" className="relative z-50" onClose={onCancel}>
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-200"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-black bg-opacity-40 transition-opacity" />
      </Transition.Child>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Dialog.Panel className="bg-dark-bg-2 rounded-lg shadow-xl max-w-sm w-full p-6">
            <Dialog.Title className="text-lg font-semibold text-neutral-200">{title}</Dialog.Title>
            <div className="mt-2 text-neutral-400">{message}</div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded bg-neutral-600  cursor-pointer !text-white font-semibold hover:bg-neutral-700 transition"
                onClick={onCancel}
              >
                {cancelText}
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600  cursor-pointer !text-white font-semibold hover:bg-red-700 transition"
                onClick={onConfirm}
              >
                {confirmText}
              </button>
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </div>
    </Dialog>
  </Transition.Root>
);

export default ConfirmDialog; 