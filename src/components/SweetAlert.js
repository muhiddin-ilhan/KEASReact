import Swal from "sweetalert2";

function SwAlertToast({ icon, title }) {
    Swal.fire({
        icon: icon,
        title: title,
        toast: true,
        position: 'top-end',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        showDenyButton: false,
        showCancelButton: false
    });
}

async function SwAlert({ icon, title, text }) {
    return await Swal.fire({
        icon: icon,
        title: title,
        text: text,
        showConfirmButton: true,
        showCancelButton: true,
        cancelButtonText: "İptal",
        confirmButtonText: "Tamam",
    })
}

export { SwAlertToast, SwAlert };