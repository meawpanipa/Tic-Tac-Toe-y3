
const playerList = [];
const c_user = localStorage.getItem("current-user");
let readList = () => {
  

  console.log(playerList);
  console.log(playerList.length);
  var ref = firebase.database().ref("users");
  ref.once("value").then((snapshot) => {
    snapshot.forEach((data) => {
      var id = data.key;
      
      ref.once("value").then((snapshot) => {
        
        const username = snapshot.child(id).child("username").val();
        const score = snapshot.child(id).child("score").val();
        const player = {username : username,score : score};
     
        playerList.push(player);
        playerList.sort((a, b) => b.score - a.score);
        
        const newDiv = `
        <div class="row">
          <div class="name">${username}</div><div class="score">${score}</div>
        </div>
        `
        const newElement= document.createRange().createContextualFragment(newDiv);
        document.getElementById("container").appendChild(newElement);
      
      });
      
    });

 

  });
};

window.onload = readList;

