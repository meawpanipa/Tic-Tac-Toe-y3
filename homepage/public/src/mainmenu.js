
const c_user = localStorage.getItem("current-user");
let readList = () => {
    var ref = firebase.database().ref("users");
    ref.once("value").then((snapshot) => {
        snapshot.forEach((data) => {
            var id = c_user;
            ref.once("value").then((snapshot) => {
                let username = snapshot.child(id).child("username").val();
                let winNum = snapshot.child(id).child("winRound").val();
                let answerNum = snapshot.child(id).child("answer").val();
                let correctNum = snapshot.child(id).child("correctNum").val();
                let round = snapshot.child(id).child("round").val();
                let score = snapshot.child(id).child("score").val();

                document.getElementById("username").innerHTML = username;
                document.getElementById("win_rate").innerHTML = (winNum*round)/100;
                document.getElementById("correct_rate").innerHTML = (answerNum*correctNum)/100;
                document.getElementById("player_score").innerHTML = score;
                document.getElementById("winNum").innerHTML = (winNum*round)/100;
                document.getElementById("questionNum").innerHTML = answerNum;
            })
        })
    })
}

window.onload = readList;
// function sendUserToAnotherFile(user) {
//     // Do something with the user object, such as sending it to an API or updating the UI
//     console.log(user);
//   }