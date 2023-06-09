const refRooms = firebase.database().ref("Rooms")
// const refUserList = firebase.database().ref("UserList")
$("#btn-find").click(findingMatch)

const findMatchModal = document.querySelector("#findMatchModal")

firebase.auth().onAuthStateChanged((user) => {
    if (user){
        setUpProfile(user)
        
    }
})


function setUpProfile(user){

    let userProfile = {}

    refUsers.child(user.uid).once("value", (data) => {
        userProfile = data.val()
        // userEXP = userProfile.exp % 50;
        // userLevel = Math.ceil(userProfile.exp / 50);
        // $("#profile-img img").attr("src", `./img/profiles/${userProfile.img}.png`)
        $("#profile-username").html(userProfile.name)
        $("#profile-email").html(userProfile.email)
        $("#profile-win").html(`Win : ${userProfile.win}`)
        $("#profile-lose").html(`Lose : ${userProfile.lose}`)
        // $("#profile-level").html(`Level : ${userLevel}`)
        // $("#profile-next-to").html(`Next to level ${userLevel+1}`)
        // $("#profile-exp-percent").html(`${userEXP} / 50`)
        // $("#profile-exp-progress-bar").attr({
        //     style: `--exp-percent: calc(${(userEXP)}  / 50 * 100%)`
        // })
    })

}

function findingMatch(){
    const currentUser = firebase.auth().currentUser
    const category = $("#inputCategory").val()
    const category2 = $("#inputCategory2").val()

    // const refScore = firebase.database().ref("users").child(currentUser.uid).child("score");
    // refScore.once("value", function(snapshot) {
    //     const score = snapshot.val();
    //     console.log(score);
    //   });
    if (!currentUser){
        alert("Please Login!")
        return
    }
    //if player 1 winrate อยู่ระหว่าง 0-50 and player2 winrate อยู่ระหว่าง0-50ก็จับคู่กัน
    if (category && category2){

        refRooms.once("value", data => {
            data = data.val()

            if (!data){
                refRooms.push({
                    "user-x-id": currentUser.uid,
                    category: category,
                    category2: category2
                })
            }
            else{
                let joined = false
                for (const roomID in data){
                    const room = data[roomID]
                    if (room["user-x-id"] == currentUser.uid || room["user-o-id"] == currentUser.uid){
                        joined = true
                        return
                    }

                    if (room.category == category && room.category2 == category2){
                        if (!room["user-x-id"]){
                            refRooms.child(roomID).update({
                                "user-x-id": currentUser.uid
                            })
                            joined = true
                        }
                        else if (!room["user-o-id"]){
                            refRooms.child(roomID).update({
                                "user-o-id": currentUser.uid
                            })
                            joined = true
                        }
                    }

                    if (joined){
                        return
                    }
                }

                if (!joined){
                    refRooms.push({
                        "user-x-id": currentUser.uid,
                        category: category,
                        category2: category2
                    })
                }
            }
        })
    }
    else{
        alert("Choose Category!")
    }
}

// function findingMatch() {
//     const currentUser = firebase.auth().currentUser;
//     const category = $("#inputCategory").val();
//     const category2 = $("#inputCategory2").val();
  
//     if (!currentUser) {
//       alert("Please Login!");
//       return;
//     } else {
//       // อ่านค่า exp ของผู้เล่น
//       const refExp = firebase.database().ref("UserList").child(currentUser.uid).child("exp");
  
//       refExp.once("value", function(snapshot) {
//         const exp = snapshot.val();
//         console.log(exp);
  
//         // หาคู่เกมส์ที่ต้องการจับคู่
//         refRooms.once("value", data => {
//           data = data.val();
  
//           if (!data){
//               refRooms.push({
//                   "user-x-id": currentUser.uid,
//                   category: category,
//                   category2: category2,
//                   exp: exp
//               });
//           } else {
//               let joined = false;
  
//               for (const roomID in data){
//                   const room = data[roomID];
  
//                   // ถ้าผู้เล่นอยู่ในห้องเกมส์อื่นแล้ว ไม่จับคู่อีก
//                   if (room["user-x-id"] == currentUser.uid || room["user-o-id"] == currentUser.uid){
//                       joined = true;
//                       return;
//                   }
  
//                   // ค้นหาห้องเกมส์ที่เหมาะสม
//                   if (room.category == category && room.category2 == category2){
  
//                       // ตรวจสอบค่า exp ของผู้เล่น ถ้าเท่ากัน จับคู่ได้
//                       if (room.exp == exp){
//                           if (!room["user-x-id"]){
//                               refRooms.child(roomID).update({
//                                   "user-x-id": currentUser.uid
//                               });
//                               joined = true;
//                           } else if (!room["user-o-id"]){
//                               refRooms.child(roomID).update({
//                                   "user-o-id": currentUser.uid
//                               });
//                               joined = true;
//                           }
//                       }
//                   }
  
//                   if (joined){
//                       return;
//                   }
//               }
  
//               if (!joined){
//                   refRooms.push({
//                       "user-x-id": currentUser.uid,
//                       category: category,
//                       category2: category2,
//                       exp: exp
//                   });
//               }
//           }
//         });
//       });
//     }
//     // alert("Choose Category!");
//   }

function searchRoom(){
    const currentUser = firebase.auth().currentUser

    let found;
    refRooms.once("value", (data) => {
        data = data.val()
        for (const d in data){
            const objData = data[d]
            if (currentUser.uid === objData["user-x-id"] || currentUser.uid === objData["user-o-id"]){
                found = objData
                found["id"] = d
                return
            }
        }
        if (found){
            return
        }
    })
    return found
}


const countTime = setInterval(() => {
    const roomInfo = searchRoom()

    if (roomInfo){
        if (roomInfo.status === "found"){
            return
        }

        if (roomInfo.time){
            refRooms.child(roomInfo.id).update({
                time: roomInfo.time + 1
            })
        }
        else{
            refRooms.child(roomInfo.id).update({
                time: 1
            })
        }
    }
}, 1000)

$("#btn-cancel-join").click(() => {
    const currentUser = firebase.auth().currentUser

    refRooms.once("value", data => {
        data = data.val()
        for (const d in data){
            const objData = data[d]
            if (currentUser.uid === objData["user-x-id"]){
                refRooms.child(d).child("user-x-id").remove()
                updateFindMatchContent("none")
                return
            }
            else if (currentUser.uid === objData["user-o-id"]) {
                refRooms.child(d).child("user-o-id").remove()
                updateFindMatchContent("none")
                return
            }
        }
    })
})

function updateFindMatchContent(cmd, room={}){
    if (cmd === "finding"){
        document.querySelectorAll(".join-default").forEach((el) => {$(el).hide()})
        document.querySelectorAll(".join-finding").forEach((el) => {$(el).show()})
        $("#inputCategory").val(room.category)
        $("#inputCategory").attr({disabled: "disabled"})
        $("#inputCategory2").attr({disabled: "disabled"})
        $("#btn-join").html(`[${room.category}] Waiting for Player(${room.time ?? 0})`)
        $(".modal-text").html(`Waiting for Player(${room.time ?? 0})`)
    }
    else if (cmd === "found") {
        const currentUser = firebase.auth().currentUser
        if (currentUser.uid == room["user-x-id"] || currentUser.uid == room["user-o-id"]){
            document.querySelectorAll(".join-default").forEach((el) => {$(el).hide()})
            document.querySelectorAll(".join-finding").forEach((el) => {$(el).show()})
            $("#btn-cancel-join").hide()
            $("#inputCategory").val(room.category)
            $("#inputCategory").attr({disabled: "disabled"})
            $("#inputCategory2").attr({disabled: "disabled"})
            $("#btn-join").html(`Starting in... 5`)
    
            refUsers.child(room["user-x-id"]).once("value", (data1) => {
                const user1 = data1.val()
                refUsers.child(room["user-o-id"]).once("value", (data2) => {
                    const user2 = data2.val()
                    $(".modal-text").html(`${user1.name} vs ${user2.name}<br><span id="countStart">Starting in... 5</span>`)
                    
                    if (!room["tables"]){
                        refRooms.child(room.uid).update({
                            turn: "X",
                            time: 59
                        })
                       
                        randomQuestion(room)
                        // randomQuestion(room)
                        // loadquestion(room)
                    }
                })
            })
    
            let count = 5;
    
            const countGoToRoom = setInterval(() => {
                count--;
                $("#countStart").html(`Starting in... ${count}`)
                $("#btn-join").html(`Starting in... ${count}`)
                if (count == 0){
                    clearInterval(countGoToRoom)
                    window.location.href = "./tictactoe.html"
                    // document.querySelector("#modal-choose").classList.add("hidden-2");
                    // document.querySelector("#overlay-choose").classList.add("hidden-2");
                }
            }, 1000)
        }
    }
    else {
        document.querySelectorAll(".join-default").forEach((el) => {$(el).show()})
        document.querySelectorAll(".join-finding").forEach((el) => {$(el).hide()})
        $("#inputCategory").removeAttr("disabled")
        $("#inputCategory2").removeAttr("disabled")
        $("#btn-join").html("Join Game")
    }
}

refRooms.on("value", (data) => {
    data = data.val()
    const currentUser = firebase.auth().currentUser
    updateFindMatchContent("none")
    for (const d in data){
        const objData = data[d]

        if (!objData["user-x-id"] && !objData["user-o-id"]){
            refRooms.child(d).remove()
        }

        if (!objData.status && objData["user-x-id"] && objData["user-o-id"]){
            if (!objData.status){
                refRooms.child(d).update({
                    status: "found"
                })
            }
            updateFindMatchContent("found", objData)
            return
        }

        if (!objData.uid){
            refRooms.child(d).update({
                uid: d
            })
        }

        if (!objData.status && (currentUser.uid === objData["user-x-id"] || currentUser.uid === objData["user-o-id"])){
            updateFindMatchContent("finding", objData)
            return
        }
        else if (objData.status == "found" || objData.status == "start"){
            updateFindMatchContent("found", objData)
        }
        else{
            updateFindMatchContent("none")
        }
    }
})

function randomQuestion(room){
    let rdmQuestion = [];
    const category = $("#inputCategory").val()
    const category2 = $("#inputCategory2").val()
    let allQuestion = []; // ตัวแปรเก็บคำศัพท์ทั้งหมดจากไฟล์ JSON
    if(category2 == "M3"){
    $.getJSON("data/MiddleSchool.json", function(result){
        allQuestion = result[room.category]; // อ่านคำศัพท์ทั้งหมดจากไฟล์ JSON และเก็บไว้ในตัวแปร allQuestion
        // const vocabs = result[room.category]
        while (rdmQuestion.length != 11){
            let rdm = Math.floor((Math.random() * (allQuestion.length - 1)));
                if (!rdmQuestion.includes(allQuestion[rdm])){
                    rdmQuestion.push(allQuestion[rdm])
            }
        }
        if (rdmQuestion) {
            refRooms.child(room.uid).child("tables").update({
                "row-1-col-1": rdmQuestion[0],
                "row-1-col-2": rdmQuestion[1],
                "row-1-col-3": rdmQuestion[2],
                "row-2-col-1": rdmQuestion[3],
                "row-2-col-2": rdmQuestion[4],
                "row-2-col-3": rdmQuestion[5],
                "row-3-col-1": rdmQuestion[6],
                "row-3-col-2": rdmQuestion[7],
                "row-3-col-3": rdmQuestion[8],
                "replace-btn": rdmQuestion[9],
                "swap-btn": rdmQuestion[10]
            })
        }
        const filteredQuestion = allQuestion.filter(function(question) {
            return !rdmQuestion.includes(question);
          });
          refRooms.child(room.uid).child("questions-left").set(filteredQuestion);
    });
    }
    else if(category2 == "M6"){
        $.getJSON("data/HighSchool.json", function(result){
            allQuestion = result[room.category]; // อ่านข้อสอบทั้งหมดจากไฟล์ JSON และเก็บไว้ในตัวแปร allQuestion
            while (rdmQuestion.length != 11){
                let rdm = Math.floor((Math.random() * (allQuestion.length - 1)));
                    if (!rdmQuestion.includes(allQuestion[rdm])){
                        rdmQuestion.push(allQuestion[rdm])
                }
            }
            if (rdmQuestion) {
                refRooms.child(room.uid).child("tables").update({
                    "row-1-col-1": rdmQuestion[0],
                    "row-1-col-2": rdmQuestion[1],
                    "row-1-col-3": rdmQuestion[2],
                    "row-2-col-1": rdmQuestion[3],
                    "row-2-col-2": rdmQuestion[4],
                    "row-2-col-3": rdmQuestion[5],
                    "row-3-col-1": rdmQuestion[6],
                    "row-3-col-2": rdmQuestion[7],
                    "row-3-col-3": rdmQuestion[8],
                    "replace-btn": rdmQuestion[9],
                    "swap-btn": rdmQuestion[10]
                })
            }
            const filteredQuestion = allQuestion.filter(function(question) {
                return !rdmQuestion.includes(question);
              });
              refRooms.child(room.uid).child("questions-left").set(filteredQuestion);
        });
        }
    
}
