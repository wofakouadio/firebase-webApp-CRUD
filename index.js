// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-app.js";
import { getDatabase, ref, set, child, get, onValue, update, remove } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-database.js";
// import { v4 as uuidv4 } from './node_modules/uuid/dist/v4.js';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC7sHDeT5xzxnmMI4XSiHs09vHuoSC7eMU",
    authDomain: "fb-webapp-one.firebaseapp.com",
    databaseURL: "https://fb-webapp-one-default-rtdb.firebaseio.com",
    projectId: "fb-webapp-one",
    storageBucket: "fb-webapp-one.appspot.com",
    messagingSenderId: "678522288335",
    appId: "1:678522288335:web:beff48993077e1b6ff1fba"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Alerts
$(".msg-main").hide();
$(".msg-aud").hide();

//add user using firebase
$("#AddUserForm").on("submit", (e) => {

    e.preventDefault();

    let name = $("#user-name").val().toUpperCase();
    let contact = $("#user-contact").val();
    let email = $("#user-email").val();
    let address = $("#user-address").val();
    let user_id = Math.random().toString(36).slice(2);

    if (name == "" || contact == "" || email == "" || address == "") {

        $(".msg-aud").show().addClass("alert alert-danger").html("Please fill all the fields");

    } else {

        set(ref(db, 'users/' + user_id), {

            user_id: user_id,
            user_name: name,
            user_contact: contact,
            user_email: email,
            user_address: address

        }).then(() => {
            $(".msg-main").show().addClass("alert alert-success").text("User added successfully");
            $("#AddUserModal").modal("hide");
            ReadAllUsers();
        }).catch((error) => {
            $(".msg-main").show().addClass("alert alert-warning").text("User added unsuccessfully. Error:" + error);
            $("#AddUserModal").modal("hide");
        })
    }
})

// list all users using firebase
function ReadAllUsers() {

    const ReadAll = ref(db, 'users/');

    onValue(ReadAll, (snapshot) => {

        snapshot.forEach((childSnapshot) => {

            const AllUsers = childSnapshot.val();

            // console.log(AllUsers);

            let tbody = document.querySelector("tbody");

            let tr = `
                <tr>
                    <td>${AllUsers.user_name}</td>
                    <td>${AllUsers.user_email}</td>
                    <td>${AllUsers.user_contact}</td>
                    <td>${AllUsers.user_address}</td>
                    <td>
                        <button class='btn btn-sm btn-info' data-bs-toggle='modal' data-bs-target='#EditUserModal' data-user_id='${AllUsers.user_id}'>Edit</button>
                        <button class='btn btn-sm btn-danger' data-bs-toggle='modal' data-bs-target='#DeleteUserModal' data-user_id='${AllUsers.user_id}'>Delete</button>
                    </td>
                </tr>
            `;

            tbody.innerHTML += tr;
        });
    });
}

// load all users using firebase
window.onload = ReadAllUsers();

// get one user using firebase
$("#EditUserModal").on("show.bs.modal", (event) => {

    let str = $(event.relatedTarget);

    let edit_user_id = str.data("user_id").toString();

    if (edit_user_id === "") {

        $("#EditUserModal").modal("hide");
        $(".msg-main").show().addClass("alert alert-danger").text("User data not available");

    } else {

        const ReadOne = ref(db, 'users/' + edit_user_id);

        onValue(ReadOne, (snapshot) => {
            const data = snapshot.val();

            $("#EditUserModal").find("input[name=edit-user-id]").val(edit_user_id);
            $("#EditUserModal").find("input[name=edit-user-name]").val(data.user_name);
            $("#EditUserModal").find("input[name=edit-user-contact]").val(data.user_contact);
            $("#EditUserModal").find("input[name=edit-user-email]").val(data.user_email);
            $("#EditUserModal").find("input[name=edit-user-address]").val(data.user_address);

            // $("#DeleteUserModal").find("input[name=delete-user-id]").val(edit_user_id);
            // $("#DeleteUserModal").find("#DeleteNotice").html("<h4>Are you sure of deleting " + data.user_name + " Data? </h4>");

            // console.log(data);
        })
    }

})

// update user data using firebase
$("#EditUserForm").on("submit", (e) => {

    e.preventDefault();

    let edit_name = $("#edit-user-name").val().toUpperCase();
    let edit_contact = $("#edit-user-contact").val();
    let edit_email = $("#edit-user-email").val();
    let edit_address = $("#edit-user-address").val();
    let e_user_id = $("#edit-user-id").val();

    update(ref(db, 'users/' + e_user_id), {

        user_name: edit_name,
        user_contact: edit_contact,
        user_email: edit_email,
        user_address: edit_address

    }).then(() => {
        $(".msg-main").show().addClass("alert alert-success").text("User updated successfully");
        $("#EditUserModal").modal("hide");
        ReadAllUsers();
    }).catch((error) => {
        $(".msg-main").show().addClass("alert alert-warning").text("User updated unsuccessfully. Error:" + error);
        $("#EditUserModal").modal("hide");
    })
})

// show user info delete modal using firebase
$("#DeleteUserModal").on("show.bs.modal", (event) => {

    let str = $(event.relatedTarget);

    let delete_user_id = str.data("user_id").toString();

    if (delete_user_id === "") {

        $("#DeleteUserModal").modal("hide");
        $(".msg-main").show().addClass("alert alert-danger").text("User data not available");

    } else {

        const ReadOne = ref(db, 'users/' + delete_user_id);

        onValue(ReadOne, (snapshot) => {
            const data = snapshot.val();

            $("#DeleteUserModal").find("input[name=delete-user-id]").val(delete_user_id);
            $("#DeleteUserModal").find("#DeleteNotice").html("Are you sure of deleting " + data.user_name + " Data?");

            // console.log(data);
        })
    }

})

// delete user data using firebase
$("#DeleteUserForm").on("submit", (e) => {

    e.preventDefault();

    let delete_user_id = $("#delete-user-id").val();

    remove(ref(db, 'users/' + delete_user_id)).then(() => {
        $(".msg-main").show().addClass("alert alert-success").text("User deleted successfully");
        $("#DeleteUserModal").modal("hide");
        ReadAllUsers();
    }).catch((error) => {
        $(".msg-main").show().addClass("alert alert-warning").text("User deleted unsuccessfully. Error:" + error);
        $("#DeleteUserModal").modal("hide");
    })

})


// $(document).ready(() => {
//     //load list
//     ReadAllUsers();

// })