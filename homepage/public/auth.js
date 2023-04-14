
const loginForm = document.querySelector("#login-form");
loginForm.addEventListener("submit", loginUser);

const loginFeedback = document.querySelector("#feedback-msg-login");
// const loginModal = new bootstrap.Modal(document.querySelector("#modal-login"));

function loginUser(event){
    event.preventDefault();
    
    const email = loginForm["input-email-login"].value;
    const password = loginForm["input-password-login"].value;

    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(() => {
        var user = firebase.auth().currentUser;
        var database_ref = firebase.database().ref();
        loginFeedback.style = "color: green";
        loginFeedback.innerHTML = "<i class='bi bi-check-circle-fill'></i> Login success!.";
        
        // var user_data = {
        //     last_login : Date.now()
        //   }

        // Push to Firebase Database
        // database_ref.child('users/' + user.uid).update(user_data)
        
        setTimeout(() => {
            // loginModal.hide();
            loginForm.reset();
            loginFeedback.innerHTML = "";
        }, 1000);
    })
    .catch((error) => {
        loginFeedback.style = "color: crimson";
        loginFeedback.innerHTML = `<i class='bi bi-exclamation-triangle-fill'></i> ${error.message}`
        loginForm.reset();
    })
}