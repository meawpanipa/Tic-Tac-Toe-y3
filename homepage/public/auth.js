const signupForm = document.querySelector("#signup-form");
signupForm.addEventListener("submit", createUser);

const signupFeedback = document.querySelector("#feedback-msg-signup");
// const signupModal = new bootstrap.Modal(document.querySelector("#modal-signup"));

function createUser(event){
    event.preventDefault();
    const email = signupForm["input-email-signup"].value;
    const password = signupForm["input-password-signup"].value;
    const username = document.getElementById('input-username-signup').value
    // const username = signupForm["input-username-signup"].value;



    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(() => {
        var user = firebase.auth().currentUser;
        var database_ref = firebase.database().ref(); // Add this user to Firebase Database
        signupFeedback.style = "color: green";
        signupFeedback.innerHTML = "<i class='bi bi-check-circle-fill'></i> Sign up completed.";
        // Create User data
        var user_data = {
            email : email,
            username : username,
            // last_login : Date.now(),
            answer : 0,
            correctNum : 0,
            round : 0,
            score : 0,
            winRound : 0
          }

      // Push to Firebase Database
          database_ref.child('users/' + user.uid).set(user_data)
        setTimeout(() => {
            // signupModal.hide();
            signupForm.reset();
            signupFeedback.innerHTML = "";
        }, 1000)
    })
    .catch((error) => {
        signupFeedback.style = "color: crimson";
        signupFeedback.innerHTML = `<i class='bi bi-exclamation-triangle-fill'></i> ${error.message}`
        signupForm.reset();
    })
}