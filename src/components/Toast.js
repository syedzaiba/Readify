export function showToast(msg, type = 'info', dur = 3000) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span>${type==='success'?'✅':type==='error'?'❌':'ℹ️'}</span> ${msg}`;
    container.appendChild(toast);
    setTimeout(() => { toast.classList.add('toast-removing');
        setTimeout(() => toast.remove(), 300); }, dur);
}