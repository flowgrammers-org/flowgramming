const capitalize = (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1)
}

window.swal = (msg, type = 'error') => {
    Swal.fire(capitalize(type), msg, type)
}

window.toast = (title) => {
    Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true,
        icon: 'success',
        title,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        },
    }).fire()
}
