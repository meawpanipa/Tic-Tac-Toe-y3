
const loginForm = document.querySelector("#login-form");
loginForm.addEventListener("submit", loginUser);


const loginFeedback = document.querySelector("#feedback-msg-login");


function loginUser(event){
    event.preventDefault();
    
    const email = loginForm["input-email-login"].value;
    const password = loginForm["input-password-login"].value;

    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(() => {
        const user = firebase.auth().currentUser.uid;
        var database_ref = firebase.database().ref();
        loginFeedback.style = "color: green";
        loginFeedback.innerHTML = "<i class='bi bi-check-circle-fill'></i> Login success!.";
        
        localStorage.setItem("current-user",user);

        setTimeout(() => {
            // loginModal.hide();
            loginForm.reset();
            loginFeedback.innerHTML = "";
            window.location.assign("mainmenu.html");
        }, 1000);
    })
    .catch((error) => {
        loginFeedback.style = "color: crimson";
        loginFeedback.innerHTML = `<i class='bi bi-exclamation-triangle-fill'></i> ${error.message}`
        loginForm.reset();
    })
}
firebase.auth().onAuthStateChanged((user) => {
    if(user){
        console.log("User :", user);
        getList(user);

    } else {
        // User is signed out

      }
});

const btnLogout = document.querySelector("#btnLogout");
btnLogout.addEventListener("click", function(){
    firebase.auth().signOut();
    console.log("Logout completed.");

    localStorage.removeItem("current-user");
})
