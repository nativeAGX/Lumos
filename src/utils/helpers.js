import toast from 'react-hot-toast';

export const showSuccessToast = (title, message) => {
  toast.success(
    <div>
      <div className="font-semibold text-slate-800">{title}</div>
      {message && <div className="text-xs text-slate-500 mt-0.5">{message}</div>}
    </div>,
    {
      style: {
        borderRadius: '10px',
        background: '#ffffff',
        color: '#0f172a',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e2e8f0',
        padding: '12px 16px',
      },
      duration: 3500,
    }
  );
};

export const showErrorToast = (title, message) => {
  toast.error(
    <div>
      <div className="font-semibold text-rose-800">{title}</div>
      {message && <div className="text-xs text-rose-600 mt-0.5">{message}</div>}
    </div>,
    {
      style: {
        borderRadius: '10px',
        background: '#fff1f2',
        color: '#9f1239',
        border: '1px solid #fecdd3',
        padding: '12px 16px',
      },
      duration: 4000,
    }
  );
};

export const showWarningToast = (title, message) => {
  toast(
    <div>
      <div className="font-semibold text-amber-800">⚠️ {title}</div>
      {message && <div className="text-xs text-amber-600 mt-0.5">{message}</div>}
    </div>,
    {
      style: {
        borderRadius: '10px',
        background: '#fffbeb',
        color: '#92400e',
        border: '1px solid #fde68a',
        padding: '12px 16px',
      },
      duration: 4000,
    }
  );
};

export const showInfoToast = (title, message) => {
  toast(
    <div>
      <div className="font-semibold text-sky-800">ℹ️ {title}</div>
      {message && <div className="text-xs text-sky-600 mt-0.5">{message}</div>}
    </div>,
    {
      style: {
        borderRadius: '10px',
        background: '#f0f9ff',
        color: '#075985',
        border: '1px solid #bae6fd',
        padding: '12px 16px',
      },
      duration: 3500,
    }
  );
};

export const downloadCSV = (filename, content) => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
