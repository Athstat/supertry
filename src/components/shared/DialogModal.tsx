import { forwardRef } from 'react';
import { createPortal } from 'react-dom';
import { twMerge } from 'tailwind-merge';
import CloseButton from './buttons/CloseButton';

type Props = {
  children?: React.ReactNode;
  onClose?: () => void;
  title?: string;
  open?: boolean;
  className?: string;

  /** The hight and width of the outer view point of the modal */
  hw?: string;
  outerCon?: string;
  hideCloseButton?: boolean
};

const DialogModal = forwardRef<HTMLDivElement, Props>(
  ({ children, onClose, title, open, className, hw, outerCon, hideCloseButton }, ref) => {
    const handleOnClose = () => {
      if (onClose) {
        onClose();
      }
    };

    if (!open) {
      return;
    }

    const modalContent = (
        <div className="fixed inset-0 dark:text-white bg-black bg-opacity-70 z-[200] flex flex-col items-center justify-center">
          <div
            className={twMerge(
              'bg-black w-[95%] md:w-[80%] lg:w-2/3 max-h-[90vh] my-4 mx-auto rounded-2xl',
              hw
            )}
          >
            <div
              className={twMerge(
                'bg-white dark:bg-gray-800/70 border border-slate-300 dark:border-slate-700 w-full h-full  rounded-2xl p-6 shadow-xl overflow-y-auto flex flex-col',
                outerCon
              )}
            >
              <div ref={ref}></div>

              <div className="flex items-center justify-between mb-4">
                <h2 className="text-md lg:text-xl font-bold text-gray-900 truncate dark:text-gray-100">
                  {title}
                </h2>

                {!hideCloseButton && <CloseButton
                  onClick={handleOnClose}
                />}
              </div>

              <div className={twMerge('', className)}>{children}</div>
            </div>
          </div>
        </div>
    );

    return createPortal(modalContent, document.body);
  }
);

export default DialogModal;
