const capitalize = (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1)
}

window.swal = (msg, type = 'error') => {
    Swal.fire({
        title: capitalize(type),
        text: msg,
        icon: type,
        heightAuto: false,
    })
}

window.swalConfirm = (msg, callback) => {
    Swal.fire({
        title: 'Are you sure?',
        text: msg,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, do it!',
        heightAuto: false,
    }).then((result) => {
        if (result.isConfirmed) {
            callback()
        }
    })
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

let loadingToast = null
window.showLoader = (title, text) => {
    loadingToast = Swal.fire({
        heightAuto: false,
        html: `
            <div class="p-4">
                <div class="loader"></div>
                <h2><b>${title}</b></h2>
                <p>${text}</p>
            </div>`,
        showConfirmButton: false,
    })
}

window.hideLoader = () => {
    if (loadingToast) {
        loadingToast.close()
        loadingToast = null
    }
}
