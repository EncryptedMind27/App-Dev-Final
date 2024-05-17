// import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
// const signUpForm = document.querySelector('.sign-up-form');

// signUpForm.addEventListener('submit', (e) => {
//     e.preventDefault();

//     const username = signUpForm['sign-up-username'].value;
//     const email = signUpForm['sign-up-email'].value;
//     const password = signUpForm['sign-up-password'].value;

//     const auth = getAuth();
//     createUserWithEmailAndPassword(auth, email, password)
//     .then((userCredential) => {
//         // Signed up 
//         const user = userCredential.user;
//         signUpForm.reset();
//         // ...
//     })
//     .catch((error) => {
//         const errorCode = error.code;
//         const errorMessage = error.message;
//         console.log(errorCode,errorMessage);
//         // ..
//     });
// })

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
// Function to handle successful signup
function handleSignUp(email, password) {
    const auth = getAuth();
    return createUserWithEmailAndPassword(auth, email, password);
}

// Function to handle successful login
function handleLogin(email, password) {
    const auth = getAuth();
    return signInWithEmailAndPassword(auth, email, password);
}

const signUpForm = document.querySelector('.sign-up-form');
const signInForm = document.querySelector('.sign-in-form');

// Event listener for signup form submission
signUpForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const username = signUpForm['sign-up-username'].value;
    const email = signUpForm['sign-up-email'].value;
    const password = signUpForm['sign-up-password'].value;

    handleSignUp(email, password)
        .then(() => {
            // Redirect to main.html after successful signup
            createToast('info');
            window.location.href = "main.html";
        })
        .catch((error) => {

            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
            createToast('warning');
            // Handle error
        });
});

// Event listener for signin form submission
signInForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = signInForm['sign-in-email'].value;
    const password = signInForm['sign-in-password'].value;

    handleLogin(email, password)
        .then(() => {
            // Redirect to main.html after successful login
            createToast('success');
            window.location.href = "main.html";
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
            createToast('error');
            // Handle error
        });
});

// LOG OUT FUNCTION

const notifications = document.querySelector(".notifications"),
buttons = document.querySelectorAll(".buttons .btn");

// Object containing details for different types of toasts
const toastDetails = {
    timer: 5000,
    success: {
        icon: 'fa-circle-check',
        text: 'Success: Welcome back!.',
    },
    error: {
        icon: 'fa-circle-xmark',
        text: 'Error: Invalid Email or Password.',
    },
    warning: {
        icon: 'fa-triangle-exclamation',
        text: 'Email or Username is already taken.',
    },
    info: {
        icon: 'fa-circle-info',
        text: 'You have created an account.',
    }
}

const removeToast = (toast) => {
    toast.classList.add("hide");
    if(toast.timeoutId) clearTimeout(toast.timeoutId); // Clearing the timeout for the toast
    setTimeout(() => toast.remove(), 500); // Removing the toast after 500ms
}

const createToast = (id) => {
    // Getting the icon and text for the toast based on the id passed
    const { icon, text } = toastDetails[id];
    const toast = document.createElement("li"); // Creating a new 'li' element for the toast
    toast.className = `toast ${id}`; // Setting the classes for the toast
    // Setting the inner HTML for the toast
    toast.innerHTML = `<div class="column">
                         <i class="fa-solid ${icon}"></i>
                         <span>${text}</span>
                      </div>
                      <i class="fa-solid fa-xmark" onclick="removeToast(this.parentElement)"></i>`;
    notifications.appendChild(toast); // Append the toast to the notification ul
    // Setting a timeout to remove the toast after the specified duration
    toast.timeoutId = setTimeout(() => removeToast(toast), toastDetails.timer);
}

// Adding a click event listener to each button to create a toast when clicked
buttons.forEach(btn => {
    btn.addEventListener("click", () => createToast(btn.id));
});