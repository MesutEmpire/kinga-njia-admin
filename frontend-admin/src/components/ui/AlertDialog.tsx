import React, { createContext, useContext, useState, useCallback } from 'react';
import { AlertCircle, CheckCircle, XCircle, Info, X } from 'lucide-react';

interface AlertDialogContextType {
    showAlert: (options: AlertOptions) => void;
    hideAlert: () => void;
}

interface AlertOptions {
    title?: string;
    message: string;
    type?: 'success' | 'error' | 'warning' | 'info';
    onConfirm?: () => void;
    confirmText?: string;
    cancelText?: string;
}

const AlertDialogContext = createContext<AlertDialogContextType | undefined>(undefined);

export const useAlertDialog = () => {
    const context = useContext(AlertDialogContext);
    if (!context) {
        throw new Error('useAlertDialog must be used within AlertDialogProvider');
    }
    return context;
};

export const AlertDialogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [options, setOptions] = useState<AlertOptions>({
        message: '',
        type: 'info',
    });

    const showAlert = useCallback((opts: AlertOptions) => {
        setOptions(opts);
        setIsOpen(true);
    }, []);

    const hideAlert = useCallback(() => {
        setIsOpen(false);
    }, []);

    const handleConfirm = () => {
        if (options.onConfirm) {
            options.onConfirm();
        }
        hideAlert();
    };

    const getIcon = () => {
        switch (options.type) {
            case 'success':
                return <CheckCircle className="w-6 h-6 text-green-600" />;
            case 'error':
                return <XCircle className="w-6 h-6 text-red-600" />;
            case 'warning':
                return <AlertCircle className="w-6 h-6 text-yellow-600" />;
            default:
                return <Info className="w-6 h-6 text-blue-600" />;
        }
    };

    const getColorClasses = () => {
        switch (options.type) {
            case 'success':
                return 'bg-green-50 border-green-200';
            case 'error':
                return 'bg-red-50 border-red-200';
            case 'warning':
                return 'bg-yellow-50 border-yellow-200';
            default:
                return 'bg-blue-50 border-blue-200';
        }
    };

    return (
        <AlertDialogContext.Provider value={{ showAlert, hideAlert }}>
            {children}

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={hideAlert}
                    />

                    <div className="relative bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 animate-in fade-in zoom-in duration-200">
                        <div className={`p-6 rounded-t-lg border ${getColorClasses()}`}>
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0">
                                    {getIcon()}
                                </div>
                                <div className="flex-1">
                                    {options.title && (
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            {options.title}
                                        </h3>
                                    )}
                                    <p className="text-sm text-gray-700">
                                        {options.message}
                                    </p>
                                </div>
                                <button
                                    onClick={hideAlert}
                                    className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end gap-3">
                            {options.onConfirm && (
                                <button
                                    onClick={hideAlert}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    {options.cancelText || 'Cancel'}
                                </button>
                            )}
                            <button
                                onClick={handleConfirm}
                                className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${options.type === 'error'
                                        ? 'bg-red-600 hover:bg-red-700'
                                        : options.type === 'success'
                                            ? 'bg-green-600 hover:bg-green-700'
                                            : options.type === 'warning'
                                                ? 'bg-yellow-600 hover:bg-yellow-700'
                                                : 'bg-blue-600 hover:bg-blue-700'
                                    }`}
                            >
                                {options.confirmText || 'OK'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AlertDialogContext.Provider>
    );
};
