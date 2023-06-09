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
    const playerRank =
      sortedUsers.findIndex((player) => player.key === c_user) + 1;
    document.getElementById("player_rank").innerHTML = playerRank;
    snapshot.forEach((data) => {
      var id = c_user;
      ref.once("value").then((snapshot) => {
        let username = snapshot.child(id).child("name").val();
        let winNum = snapshot.child(id).child("winRound").val();
        let answerNum = snapshot.child(id).child("answer").val();
        let correctNum = snapshot.child(id).child("correctNum").val();
        let round = snapshot.child(id).child("round").val();
        let score = snapshot.child(id).child("score").val();
        

        let correctRate = ((correctNum * 100) / answerNum).toFixed(2); 
        let winRate = ((winNum * 100) / round).toFixed(2);
        
        if(answerNum == 0 ){
          correctRate = 0;
        }
        if(round == 0 ){
          winRate = 0;
        }
        console.log(correctRate);
        document.getElementById("username").innerHTML = username;
        document.getElementById("round").innerHTML = round;
        document.getElementById("win_rate").innerHTML = String(winRate)+ " %";
        document.getElementById("correct_rate").innerHTML = String(correctRate) + " %";  
        document.getElementById("player_score").innerHTML = score;
        document.getElementById("winNum").innerHTML = winNum;
        document.getElementById("questionNum").innerHTML = answerNum;
      });
    });
  });
  const dbRef = firebase.database().ref("users");
  dbRef
    .orderByChild("score")
    .limitToLast(3)
    .once("value", (snapshot) => {
      const users = [];
      let i = 0;
      snapshot.forEach((childSnapshot) => {
        const user = childSnapshot.val();
        user.key = childSnapshot.key;
        users.push(user);
      });

      const sortedUsers = users.sort((a, b) => b.score - a.score);

      while (i < sortedUsers.length) {
        i++;
      }
      document.getElementById("first").innerHTML = sortedUsers[0].username;
      document.getElementById("sec").innerHTML = sortedUsers[1].username;
      document.getElementById("third").innerHTML = sortedUsers[2].username;
    });
};

window.onload = readList;

// modal section
const modal = document.querySelector("#modal-choose");
const overlay = document.querySelector("#overlay-choose");
const btnStart = document.querySelector("#btn-start")
// const closeModalBtn = document.querySelector(".btn-close");

// close modal function
const closeModal = function () {
  modal.classList.add("hidden-2");
  overlay.classList.add("hidden-2");
};

//เคลียร์ form ยังไม่ได้
const btnClose = document.getElementById("btn-close");
// btnClose.addEventListener("click", () => {
//   const form1 = document.getElementById("inputCategory");
//   const form2 = document.getElementById("inputCategory2");
//   form1.reset();
//   form2.reset();
// });

// close the modal when the close button and overlay is clicked
// closeModalBtn.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

// open modal function
const openModalMatch = function () {
  modal.classList.remove("hidden-2");
  overlay.classList.remove("hidden-2");
  document.getElementById("modal-title").innerHTML = "Select Subject and difficulty";
};

// open modal event
btnStart.addEventListener("click", openModalMatch);


const inputCategory = document.getElementById('inputCategory');
const inputCategory2 = document.getElementById('inputCategory2');

inputCategory.addEventListener('change', function() {
  if (inputCategory.value === 'Social') {
    inputCategory2.innerHTML = `
      <option selected disabled>Choose a difficulty</option>
      <option value="M6">M6</option>
    `;
  } else {
    inputCategory2.innerHTML = `
      <option selected disabled>Choose a difficulty</option>
      <option value="M3">M3</option>
      <option value="M6">M6</option>
    `;
  }
});

// const element = document.getElementById("searchBtn");
// element.addEventListener("click", function () {
//   const dbRef = firebase.database().ref("users");
//   var searchInput = document.getElementById("searchInput");
//   var searchText = searchInput.value;

//   const users = [];
//   dbRef.once("value").then((snapshot) => {
//     snapshot.forEach((childSnapshot) => {
//       const user = childSnapshot.val();
//       user.key = childSnapshot.key;
//       users.push(user);
//     });
//     console.log(users.length);
//     let i = 0;
//     console.log(searchText);
//     while (i < users.length) {
//       if (searchText == users[i].username) {
//         console.log("True");
//         const newDiv = `
//         <div
//                   class="container bg-warning requestblock"
                  
//                 >
//                   <div class="row" id="requestblock">
//                     <div
//                       class="col-4 d-flex justify-content-center"
//                       id="friend_pic"
//                     >
//                       Picture
//                     </div>
//                     <div class="col-6">
//                       <div class="row fs-4" id="friend_name">${users[i].username}</div>
//                       <div class="row fs-4 mt-2">
//                         <div class="btn btn-success col-5 mx-1" id="addbtn">
//                           Add
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//         `;
//         const newElement = document.createRange().createContextualFragment(newDiv);
//         document.getElementById("addFriend").appendChild(newElement);
//         i++;
//       } else {
//         i++;
//       }
//     }
//   });
// });
