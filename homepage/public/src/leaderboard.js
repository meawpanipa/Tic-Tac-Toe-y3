const c_user = localStorage.getItem("current-user");
let readList = () => {
  var ref = firebase.database().ref("users");
  ref.once("value").then((snapshot) => {
    snapshot.forEach((data) => {
      var id = data.key;
      ref.once("value").then((snapshot) => {
        let username = snapshot.child(id).child("username").val();
        let score = snapshot.child(id).child("score").val();

        const tr = document.createElement("tr");
        const td = document.createElement("td");
        const td2 = document.createElement("td");
        const td3 = document.createElement("td");

        const div = document.createElement("div");
        const div2 = document.createElement("div");
        const div3 = document.createElement("div");

        const hUname = document.createElement("h4").innerHTML = `${username}`;
        const newUname = document.createRange().createContextualFragment(hUname);

        const hScore = document.createElement("h4").innerHTML = `${score}`;
        const newScore = document.createRange().createContextualFragment(hScore);

        const hRank = document.createElement("h4").innerHTML = "#";
        const newRank = document.createRange().createContextualFragment(hRank);

        td.classList.add("col-4");
        td2.classList.add("col-4");
        td3.classList.add("col-4");

        div.classList.add("d-flex");
        div.classList.add("justify-content-center");
        div2.classList.add("d-flex");
        div2.classList.add("justify-content-center");
        div3.classList.add("d-flex");
        div3.classList.add("justify-content-center");

        td.appendChild(div).appendChild(newUname);
        td2.appendChild(div2).appendChild(newScore);
        td3.appendChild(div3).appendChild(newRank);// Rank Config
     
        console.log(td);
        console.log(td2);
        console.log(td3);

        // const newDiv = `
        //   <td class="col-4">
        //     <div class="d-flex justify-content-center">
        //       <h4>#</h4>
        //     </div>
        //   </td>
        //   <td class="col-4">
        //     <div class="d-flex justify-content-center">
        //       <h4>${username}</h4>
        //     </div>
        //   </td>
        //   <td class="col-4">
        //     <div class="d-flex justify-content-center">
        //       <h4>${score}</h4>
        //     </div>
        //   </td>
        //     `;
            
        // const newElement = document.createRange().createContextualFragment(newDiv);
        document.getElementById("l_board").appendChild(tr).appendChild(td3);
        document.getElementById("l_board").appendChild(tr).appendChild(td);
        document.getElementById("l_board").appendChild(tr).appendChild(td2);
      });
    });
  });
};

window.onload = readList;
function sendUserToAnotherFile(user) {
  // Do something with the user object, such as sending it to an API or updating the UI
  console.log(user);
}
