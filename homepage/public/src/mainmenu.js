
const c_user = localStorage.getItem("current-user");
let readList = () => {
    var ref = firebase.database().ref("users");
    ref.once("value").then((snapshot) => {
        const users = [];
        snapshot.forEach((childSnapshot) => {
            const user = childSnapshot.val();
            user.key = childSnapshot.key;
            users.push(user);
          });
          const sortedUsers = users.sort((a, b) => b.score - a.score);
          console.log(sortedUsers);
          const playerRank = sortedUsers.findIndex(player => player.key === c_user) + 1;
            document.getElementById("player_rank").innerHTML = playerRank;
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
    const dbRef = firebase.database().ref("users");
    dbRef.orderByChild("score").limitToLast(3).once("value", (snapshot) => {
        const users = [];
        let i = 0;
        snapshot.forEach((childSnapshot) => {
          const user = childSnapshot.val();
          user.key = childSnapshot.key;
          users.push(user);
        });
        
        const sortedUsers = users.sort((a, b) => b.score - a.score);
      
        while(i<sortedUsers.length){
            i++;
        }
        document.getElementById("first").innerHTML = sortedUsers[0].username;
        document.getElementById("sec").innerHTML = sortedUsers[1].username;
        document.getElementById("third").innerHTML = sortedUsers[2].username;
      });
}

window.onload = readList;
