window.onload = function() {
    const form = document.querySelector("#signupForm")

    form.onsubmit = function() {
        const password = document.querySelector("#password")
        const passwordConfirm = document.querySelector("#password-confirm")

        if(password.value != passwordConfirm.value) {
            const unMatch = document.querySelector("#pwd-unMatch")
        }
    }
}