interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer: React.ReactNode;
  loading?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  loading = false,
}: ModalProps) {
  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={handleClose}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-4xl bg-[#0D0702] rounded-2xl shadow-xl border border-[rgba(230,221,214,0.3)]">
          <div className="flex items-center justify-between p-6 border-b border-[rgba(230,221,214,0.2)]">
            <h2 className="text-2xl font-bold text-white font-['Fira_Sans']">
              {title}
            </h2>
            <button
              onClick={handleClose}
              disabled={loading}
              className="text-[#E6D8D6] hover:text-white transition-colors disabled:opacity-50"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="max-h-[80vh] overflow-y-auto">{children}</div>

          <div className="flex items-center justify-end gap-4 p-6 border-t border-[rgba(230,221,214,0.2)]">
            {footer}
          </div>
        </div>
      </div>
    </div>
  );
}
