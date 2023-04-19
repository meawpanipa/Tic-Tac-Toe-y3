

let leaderBoard = () => {
  const dbRef = firebase.database().ref("users");

dbRef.orderByChild("score").once("value", (snapshot) => {
  const users = [];
  let i = 0;
  snapshot.forEach((childSnapshot) => {
    const user = childSnapshot.val();
    user.key = childSnapshot.key;
    users.push(user);
  });
  
  const sortedUsers = users.sort((a, b) => b.score - a.score);

  while(i<sortedUsers.length){
    console.log(sortedUsers[i]);
    
    const newDiv = `
        <div class="row">
        <div class="name">${sortedUsers[i].username}</div><div class="score">${sortedUsers[i].score}</div>
        </div>
        `
        const newElement= document.createRange().createContextualFragment(newDiv);
        document.getElementById("container").appendChild(newElement);
        
        i++;
  }


  

});
const c_user = localStorage.getItem("current-user");

    var ref = firebase.database().ref("users");
    ref.once("value").then((snapshot) => {
        snapshot.forEach((data) => {
            var id = c_user;
            ref.once("value").then((snapshot) => {
                let username = snapshot.child(id).child("username").val();
                let score = snapshot.child(id).child("score").val();

                document.getElementById("yourName").innerHTML = username;
               
                document.getElementById("yourScore").innerHTML = score;

            })
        })
    })

};

window.onload = leaderBoard;


