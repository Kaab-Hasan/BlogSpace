import Swal from 'sweetalert2';

export const AlertService = {
  // Success alert
  success: (title: string, message?: string) => {
    return Swal.fire({
      icon: 'success',
      title,
      text: message,
      confirmButtonText: 'OK',
      confirmButtonColor: '#16a34a',
      background: '#ffffff',
      color: '#111827',
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
      allowOutsideClick: true,
      allowEscapeKey: true,
      showClass: { popup: '' }, // Remove animations
      hideClass: { popup: '' }, // Remove animations
      customClass: {
        popup: 'swal2-popup-custom',
        title: 'swal2-title-custom',
        confirmButton: 'swal2-confirm-custom'
      }
    });
  },

  // Error alert
  error: (title: string, message?: string) => {
    return Swal.fire({
      icon: 'error',
      title,
      text: message,
      confirmButtonText: 'OK',
      confirmButtonColor: '#ef4444',
      background: '#ffffff',
      color: '#111827',
      allowOutsideClick: true,
      allowEscapeKey: true,
      focusConfirm: true,
      showClass: { popup: '' }, // Remove animations
      hideClass: { popup: '' }, // Remove animations
      customClass: {
        popup: 'swal2-popup-custom',
        title: 'swal2-title-custom',
        confirmButton: 'swal2-confirm-custom'
      }
    });
  },

  // Warning alert
  warning: (title: string, message?: string) => {
    return Swal.fire({
      icon: 'warning',
      title,
      text: message,
      confirmButtonText: 'OK',
      confirmButtonColor: '#f97316',
      background: '#ffffff',
      color: '#111827',
      allowOutsideClick: true,
      allowEscapeKey: true,
      focusConfirm: true,
      showClass: { popup: '' }, // Remove animations
      hideClass: { popup: '' }, // Remove animations
      customClass: {
        popup: 'swal2-popup-custom',
        title: 'swal2-title-custom',
        confirmButton: 'swal2-confirm-custom'
      }
    });
  },

  // Info alert
  info: (title: string, message?: string) => {
    return Swal.fire({
      icon: 'info',
      title,
      text: message,
      confirmButtonText: 'OK',
      confirmButtonColor: '#3b82f6',
      background: '#ffffff',
      color: '#111827',
      allowOutsideClick: true,
      allowEscapeKey: true,
      focusConfirm: true,
      showClass: { popup: '' }, // Remove animations
      hideClass: { popup: '' }, // Remove animations
      customClass: {
        popup: 'swal2-popup-custom',
        title: 'swal2-title-custom',
        confirmButton: 'swal2-confirm-custom'
      }
    });
  },

  // Confirmation dialog
  confirm: (title: string, message?: string, confirmText = 'Yes', cancelText = 'Cancel') => {
    return Swal.fire({
      icon: 'question',
      title,
      text: message,
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      confirmButtonColor: '#2e5a2e',
      cancelButtonColor: '#6b7280',
      background: '#ffffff',
      color: '#111827',
      reverseButtons: true,
      allowOutsideClick: true,
      allowEscapeKey: true,
      focusConfirm: true,
      showClass: { popup: '' }, // Remove animations
      hideClass: { popup: '' }, // Remove animations
      customClass: {
        popup: 'swal2-popup-custom',
        title: 'swal2-title-custom',
        confirmButton: 'swal2-confirm-custom',
        cancelButton: 'swal2-cancel-custom'
      }
    });
  },

  // Loading alert
  loading: (title: string, message?: string) => {
    return Swal.fire({
      title,
      text: message,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      background: '#ffffff',
      color: '#111827',
      showClass: { popup: '' }, // Remove animations
      hideClass: { popup: '' }, // Remove animations
      didOpen: () => {
        Swal.showLoading();
      },
      customClass: {
        popup: 'swal2-popup-custom',
        title: 'swal2-title-custom'
      }
    });
  },

  // Close loading alert
  close: () => {
    Swal.close();
  },

  // Toast notification
  toast: {
    success: (message: string) => {
      return Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: message,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: '#dcfce7',
        color: '#15803d',
        showClass: { popup: '' }, // Remove animations for instant display
        hideClass: { popup: '' }, // Remove animations for instant hide
        customClass: {
          popup: 'swal2-toast-custom'
        }
      });
    },

    error: (message: string) => {
      return Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: message,
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
        background: '#fef2f2',
        color: '#dc2626',
        showClass: { popup: '' }, // Remove animations for instant display
        hideClass: { popup: '' }, // Remove animations for instant hide
        customClass: {
          popup: 'swal2-toast-custom'
        }
      });
    },

    warning: (message: string) => {
      return Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'warning',
        title: message,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: '#fef3c7',
        color: '#ea580c',
        showClass: { popup: '' }, // Remove animations for instant display
        hideClass: { popup: '' }, // Remove animations for instant hide
        customClass: {
          popup: 'swal2-toast-custom'
        }
      });
    },

    info: (message: string) => {
      return Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'info',
        title: message,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: '#dbeafe',
        color: '#2563eb',
        showClass: { popup: '' }, // Remove animations for instant display
        hideClass: { popup: '' }, // Remove animations for instant hide
        customClass: {
          popup: 'swal2-toast-custom'
        }
      });
    }
  },

  // Input dialog
  input: (title: string, inputType: 'text' | 'email' | 'password' | 'textarea' = 'text', placeholder?: string) => {
    return Swal.fire({
      title,
      input: inputType,
      inputPlaceholder: placeholder,
      showCancelButton: true,
      confirmButtonText: 'Submit',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#2e5a2e',
      cancelButtonColor: '#6b7280',
      background: '#ffffff',
      color: '#111827',
      allowOutsideClick: true,
      allowEscapeKey: true,
      showClass: { popup: '' }, // Remove animations
      hideClass: { popup: '' }, // Remove animations
      inputValidator: (value) => {
        if (!value) {
          return 'Please enter a value!';
        }
      },
      customClass: {
        popup: 'swal2-popup-custom',
        title: 'swal2-title-custom',
        confirmButton: 'swal2-confirm-custom',
        cancelButton: 'swal2-cancel-custom'
      }
    });
  },

  // Custom HTML content
  html: (title: string, htmlContent: string, showCancel = false) => {
    return Swal.fire({
      title,
      html: htmlContent,
      showCancelButton: showCancel,
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#2e5a2e',
      cancelButtonColor: '#6b7280',
      background: '#ffffff',
      color: '#111827',
      allowOutsideClick: true,
      allowEscapeKey: true,
      showClass: { popup: '' }, // Remove animations
      hideClass: { popup: '' }, // Remove animations
      customClass: {
        popup: 'swal2-popup-custom',
        title: 'swal2-title-custom',
        confirmButton: 'swal2-confirm-custom',
        cancelButton: 'swal2-cancel-custom'
      }
    });
  }
};

// Network error helper
export const showNetworkError = (error: any) => {
  const message = error?.response?.data?.message || error?.message || 'Network error occurred';
  AlertService.error('Connection Error', message);
};

// Validation error helper
export const showValidationErrors = (errors: Record<string, string[]>) => {
  const errorMessages = Object.values(errors).flat().join('\n');
  AlertService.error('Validation Error', errorMessages);
};

export default AlertService;