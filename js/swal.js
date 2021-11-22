/*
 # *************************************************************************************
 # Copyright (C) 2021 Ritwik Murali, Harshit Agarwal, Rajkumar S, Gali Mary Sanjana,
 # Adithi Narayan, Aishwarya B, Adithi Giridharan.
 # This file is part of Flowgramming <https://github.com/flowgrammers-org/flowgramming>.
 #
 # Flowgramming is free software: you can redistribute it and/or modify
 # it under the terms of the GNU General Public License as published by
 # the Free Software Foundation, either version 3 of the License, or
 # (at your option) any later version.
 #
 # Flowgramming is distributed in the hope that it will be useful,
 # but WITHOUT ANY WARRANTY; without even the implied warranty of
 # MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 # GNU General Public License for more details.
 #
 # You should have received a copy of the GNU General Public License
 # along with Flowgramming.  If not, see <http://www.gnu.org/licenses/>.
 # *************************************************************************************
 */

const capitalize = (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1)
}

window.swal = (msg, type = 'error') => {
    Swal.fire({
        title: capitalize(type),
        html: msg,
        icon: type,
        heightAuto: false,
    })
}

window.swalConfirm = (msg, callback) => {
    Swal.fire({
        title: 'Are you sure?',
        html: msg,
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
