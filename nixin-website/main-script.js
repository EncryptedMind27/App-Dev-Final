
const dropArea = document.querySelector('.drop-section');
const listSection = document.querySelector('.list-section');
const listContainer = document.querySelector('.list');
const fileSelector = document.querySelector('.file-selector');
const fileSelectorInput = document.querySelector('.file-selector-input');

// LOGOUT

import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-storage.js";

const storage = getStorage();
// Function to handle logout
function handleLogout() {
    const auth = getAuth();
    signOut(auth)
        .then(() => {
            // Redirect to registration.html after successful logout
            window.location.href = "registration.html";
        })
        .catch((error) => {
            console.log("Error logging out:", error);
            // Handle error
        });
}

const logoutButton = document.getElementById('logout');

// Event listener for logout button
logoutButton.addEventListener('click', (e) => {
    e.preventDefault();
    console.log("Success");
    handleLogout();
});


// UPLOAD USING BROWSE BUTTON
fileSelector.onclick = () => fileSelectorInput.click();
fileSelectorInput.onchange = () => {
    [...fileSelectorInput.files].forEach((file) => {
        if(typeValidation(file.type)){
            console.log("File has been Uploaded");
            console.log(file);
            uploadFile(file);
        }
    })
}
// drag file effect
dropArea.ondragover = (e) => {
    e.preventDefault();
    [...e.dataTransfer.items].forEach((item) => {
        if(typeValidation(item.type)){
            dropArea.classList.add('drag-over-effect');
            console.log('Success');
        }
    })
}

// // drag exit
dropArea.ondragleave = () => {
    dropArea.classList.remove('drag-over-effect');
}

// chech file type
function typeValidation(type) {
    var splitType = type.split('/')[0];
    if(type == 'application/pdf' || splitType == 'image' || splitType == 'video'){
        return true
    } else {
        createToast('warning');
    }
}
// when file drop
dropArea.ondrop = (e) => {
    e.preventDefault();
    dropArea.classList.remove('drag-over-effect')
    if(e.dataTransfer.items){
        [...e.dataTransfer.items].forEach((item) => {
            if(item.kind === 'file'){
                const file = item.getAsFile();
                if(typeValidation(file.type)){
                    console.log("File has been Uploaded");
                    console.log(file);
                    uploadFile(file)
                }
            }
        })
    } else {
        [...e.dataTransfer.files].forEach((file) => {
            if(typeValidation(file.type)){
                console.log("File has been Uploaded");
                console.log(file);
                uploadFile(file)
            }
        })
    }
}

// upload file function
// upload file function
function uploadFile(file) {
    const auth = getAuth();
    const user = auth.currentUser;
    const userEmail = user.email;

    // Reference to the Firebase Storage location
    const storageRef = firebase.storage().ref().child(`${userEmail}/${file.name}`); // Use firebase.storage()

    // Upload the file to Firebase Storage
    storageRef.put(file).then((snapshot) => {
        console.log('File uploaded successfully!');
        // You can add further actions here if needed
    }).catch((error) => {
        console.error('Error uploading file:', error);
        // Handle error
    });
}
//     listContainer.prepend(li)
//     var http = new XMLHttpRequest()
//     var data = new FormData()
//     data.append('file', file)
//     http.onload = () => {
//         li.classList.add('complete')
//         li.classList.remove('in-prog')
//     }
//     http.upload.onprogress = (e) => {
//         var percent_complete = (e.loaded / e.total)*100
//         li.querySelectorAll('span')[0].innerHTML = Math.round(percent_complete) + '%'
//         li.querySelectorAll('span')[1].style.width = percent_complete + '%'
//     }
//     http.open('POST', 'sender.php', true)
//     http.send(data)
//     li.querySelector('.cross').onclick = () => http.abort()
//     http.onabort = () => li.remove()
// }

// // find icon for file
// function iconSelector(type){
//     var splitType = (type.split('/')[0] == 'application') ? type.split('/')[1] : type.split('/')[0];
//     return splitType + '.png'



const notifications = document.querySelector(".notifications"),
buttons = document.querySelectorAll(".buttons .btn");

// Object containing details for different types of toasts
const toastDetails = {
    timer: 5000,
    success: {
        icon: 'fa-circle-check',
        text: 'Success: This is a success toast.',
    },
    error: {
        icon: 'fa-circle-xmark',
        text: 'Error: This is an error toast.',
    },
    warning: {
        icon: 'fa-triangle-exclamation',
        text: 'Invalid File Type.',
    },
    info: {
        icon: 'fa-circle-info',
        text: 'Info: This is an information toast.',
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