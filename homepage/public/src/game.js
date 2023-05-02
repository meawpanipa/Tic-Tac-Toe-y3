const refRooms = firebase.database().ref("Rooms")
let roomInfo = {}
// let player1TotalAnswer = 0;
// let player2TotalAnswer = 0;
refRooms.on("value", data => {
    data = data.val()
    const currentUser = firebase.auth().currentUser
    for (const d in data){
        const rInfo = data[d]
        if (rInfo["user-x-id"] === currentUser.uid || rInfo["user-o-id"] === currentUser.uid){
            roomInfo = rInfo
            if (rInfo.status == "found"){
                refRooms.child(rInfo.uid).update({
                    status: "start",
                })
            }
            setUpGame(rInfo)
            checkWinner(rInfo)
        }
    }
})

function setUpGame(room){
    const currentUser = firebase.auth().currentUser
    for (const player of ["x", "o"]){
        refUsers.child(room[`user-${player}-id`]).once("value", data => {
            const user = data.val()
            $(`#game-info-user-${player} .game-user-img img`).attr({
                src: `./img/profiles/${user.img}.png`
            })
            // $(`.game-user-name`).html(user.name)
            // $(`#game-info-user-${player} .game-user-level`).html(`Level : ${Math.ceil((user.exp) / 50)}`)
            
            if (!room.winner && room.turn.toLowerCase() === player){
                $("#game-info-turn span").html(room[`user-${room.turn.toLowerCase()}-id`] == currentUser.uid ? "YOU!" : user.name)
                $("#user-block").css("background-color", room[`user-${room.turn.toLowerCase()}-id`] == currentUser.uid ? "rgb(255, 148, 166)" : "rgb(254, 81, 110)");
                $("#user-block2").css("background-color", room[`user-${room.turn.toLowerCase()}-id`] !== currentUser.uid ? "rgb(255, 148, 166)" : "rgb(254, 81, 110)");
               
            }

            //แสดงusernameของทั้งสองผู้เล่น
            Promise.all([
                refUsers.child(room[`user-x-id`]).once("value"),
                refUsers.child(room[`user-o-id`]).once("value")
              ])
                .then((snapshots) => {
                  const xUser = snapshots[0].val();
                  const oUser = snapshots[1].val();
              
                  if (currentUser && room[`user-x-id`] === currentUser.uid) {
                        $(`.game-user-name2`).html(`X : ${xUser.name}`);
                        $(`.game-user-name`).html(`O : ${oUser.name}`);
                    }
                if (currentUser && room[`user-o-id`] === currentUser.uid){
                    $(`.game-user-name2`).html(`O : ${oUser.name}`);
                    $(`.game-user-name`).html(`X :${xUser.name}`);
                    
                  }
                })
                .catch((error) => {
                  console.error(error);
                });
            
        })
    }
    $(`#game-info-category`).html(`${room.category}`)
    $(`#game-info-time`).html(`Time: ${room.time}`)

    if (room.winner === "draw"){
        $(`#game-info-player`).html("")
        $("#game-info-turn").html(`<span> DRAW </span>`)
        setTimeout(() => {
            finishGame()
        }, 2000)
    }
    else if (room.winner == "stop")
    {
        finishGame()
    }
    else if (room.winner){
        $(`#game-info-player`).html("")
        refUsers.child(room[`user-${room.winner.toLowerCase()}-id`]).once("value", (data) => {
            const user = data.val()
            $("#game-info-turn").html(`Winner is <span>${user.name}</span>`)
        })
        setTimeout(() => {
            finishGame()
        }, 2000)
    }
    else{
        $(`#game-info-player span`).html(room.turn)
    }
    $("#questionModalLabel .questionModal-time").html(`Time : ${room.time}`)
    
    //ถ้าตารางมีเข้าของเเล้วจะใส่ x หรือ o ที่เป็นเจ้าของ
    //ถ้ายังไม่มีจะใส่รูปคำถาม
    for (const xoBox in room["tables"]){
        const xo = room["tables"][xoBox]

        if (xo.own){
            $(`#${xoBox} img`).attr({
                src: `./img/${xo.own}.png`
            })
            // $(`#${xoBox}>div>div>div`).html(xo["nameTH"])
            // $(`#${xoBox}>div>div>div`).each((i, el) => {
                // console.log(el);
            //     if (i == 0){
            //         $(el).html(xo.name)
            //     }
            //     else{
            //         $(el).html(xo["nameTH"])
            //     }
            // })
        }
        else{
            $(`#${xoBox} img`).attr({
                src: xo.img
            })
        }
        // else{
        //     $(`#${xoBox} img`).attr('src', '');
        // }
    }
}

//เก็บจำนวนคำถามที่ผู้เล่นตอบ
function countAnswer(roomInfo) {
    const currentUser = firebase.auth().currentUser;
    if (currentUser.uid === roomInfo["user-x-id"]) {
        refUsers.child(roomInfo["user-x-id"]).once("value", (snapshot) => {
          const user = snapshot.val();
          refUsers.child(roomInfo["user-x-id"]).update({
            answer: user.answer + 1
          });
        });
      } else if (currentUser.uid === roomInfo["user-o-id"]) {
        refUsers.child(roomInfo["user-o-id"]).once("value", (snapshot) => {
          const user = snapshot.val();
          refUsers.child(roomInfo["user-o-id"]).update({
            answer: user.answer + 1
          });
        });
      }
  }
  //เก็บจำนวนคำถามที่ผู้เล่นตอบ
  function correctNum(roomInfo) {
    const currentUser = firebase.auth().currentUser;
    if (currentUser.uid === roomInfo["user-x-id"]) {
        refUsers.child(roomInfo["user-x-id"]).once("value", (snapshot) => {
          const user = snapshot.val();
          refUsers.child(roomInfo["user-x-id"]).update({
            correctNum: user.correctNum + 1
          });
        });
      } else if (currentUser.uid === roomInfo["user-o-id"]) {
        refUsers.child(roomInfo["user-o-id"]).once("value", (snapshot) => {
          const user = snapshot.val();
          refUsers.child(roomInfo["user-o-id"]).update({
            correctNum: user.correctNum + 1
          });
        });
      }
  }
//กดช่องตอบคำถาม
let pos = null;
document.querySelectorAll(".table-block div").forEach(el => {
    $(el).click(() => {
        if (event.target !== el){
            return;
        }

        const currentUser = firebase.auth().currentUser
        if (currentUser.uid !== roomInfo[`user-${roomInfo.turn.toLowerCase()}-id`]){
            showDialog("Not your turn!")
            return
        }
        
        if(currentUser.uid == roomInfo["user-x-id"]){
            currentUser.uid
        }
        if (roomInfo.winner){
            return
        }

        pos = el.parentNode.id
        // console.log(pos)
        $("#question").html(roomInfo["tables"][pos].question)
        const choices = roomInfo["tables"][pos].choices
            for (let i = 0; i < choices.length; i++) {
                $(`#choice${i+1}`).html(choices[i])
            }

        // if (roomInfo["tables"][pos].own){
        //     showDialog("Change Table!")
        //     return
        // }
        $("#questionModal").modal({
            backdrop: "static",
            keyboard: false
        });
        $("#questionModalLabel").val(pos)
        // $("#questionModalLabel .questionModal-table").html(pos)
        $("#questionModal").modal("show")
        
    })
})
$(".choice").click(function() {
            const correctAnswer = roomInfo["tables"][pos]["answer"];
            countAnswer(roomInfo);
            // ตรวจสอบว่าตัวเลือกที่ผู้ใช้เลือกตรงกับคำตอบที่ถูกต้องหรือไม่
            if ($(this).text() === correctAnswer) {
                correctNum(roomInfo)
                refRooms.child(roomInfo.uid).child("tables").child($('#questionModalLabel').val()).update({
                    own : roomInfo.turn
                })
                refRooms.child(roomInfo.uid).update({
                    turn: roomInfo.turn === "X" ? "O" : "X",
                    time: 59
                })
                // answerFeedback.innerText = `NameTH : ${roomInfo["tables"][$("#questionModalLabel").val()]["nameTH"]}`;
                // answerFeedback.style = `color:green`;
                // setTimeout(() => {
                // $("#questionModal").val("")
                $("#questionModal").modal("hide")
                // }, 2000)
            }
            if ($(this).text() !== correctAnswer) {
                console.log("incorrect")
                refRooms.child(roomInfo.uid).update({
                    turn: roomInfo.turn === "X" ? "O" : "X",
                    time: 59
                })
                showDialog(`คำตอบที่ถูกคือ:<br>${correctAnswer}`)
                // $("#questionModal").val("")
                $("#questionModal").modal("hide")

                //ลบคำถามในช่องนั้นออกแล้วแทนที่ด้วยคำถามใหม่
                updateQuestion(roomInfo, pos)
            }
        });

const btnReplace = document.getElementById("btn-replace");
const specialfx = document.getElementsByClassName("specialfx");

const imgElements = document.querySelectorAll(".table-block img");
let isBtnReplaceDisabled = false; 
btnReplace.addEventListener("click", () => {
    $("#replaceModal").modal({
        backdrop: "static",
        keyboard: false
    });
    const currentUser = firebase.auth().currentUser
        if (currentUser.uid !== roomInfo[`user-${roomInfo.turn.toLowerCase()}-id`] && isBtnReplaceDisabled == false){
            showDialog("Not your turn!")
            return
        }

        if (roomInfo.winner){
            return
        }
        if(isBtnReplaceDisabled === false){
        showDialog("เลือกช่องของฝั่งตรงข้ามที่ต้องการลงทับ")
        }
        // isBtnReplaceDisabled = true;
        // refRooms.child(roomInfo.uid).child("tables").update({
        //     replace : {X:null, O: null}
        //   });
       
    imgElements.forEach(img => {
    img.addEventListener("click", (event) => {

        if (isBtnReplaceDisabled) {
            return;
          }
        const tableBlock = event.target.parentElement.parentElement.closest(".table-block");
        
        console.log("click");
        console.log(event.target.src);
        // const pic = event.target.src
        
        // console.log(roomInfo.time);
        // refRooms.child(roomInfo.uid).update({
        //     time: Math.ceil(roomInfo.time / 2)
        //   });
        if (event.target.src.endsWith("O.png")) {
            console.log("O");
            if(roomInfo.turn == "X"){
                refRooms.child(roomInfo.uid).update({
                    time: Math.ceil(roomInfo.time / 2)
                  });
                console.log("replace")
                $("#question-replace").html(roomInfo["tables"]["replace-btn"].question)
                    const choices = roomInfo["tables"]["replace-btn"].choices
                    for (let i = 0; i < choices.length; i++) {
                        $(`#choiceR${i+1}`).html(choices[i])
                    }
                $("#replaceModal").modal("show")
                console.log(choices)
                $(".choice-replace").click(function() {
                    const correctAnswer = roomInfo["tables"]["replace-btn"]["answer"];
                    console.log(correctAnswer)
                    countAnswer(roomInfo);
                    // ตรวจสอบว่าตัวเลือกที่ผู้ใช้เลือกตรงกับคำตอบที่ถูกต้องหรือไม่
                    if ($(this).text() === correctAnswer) {
                        correctNum(roomInfo)
                        refRooms.child(roomInfo.uid).child("tables").child(tableBlock.id).update({
                            own : roomInfo.turn
                        })
                        refRooms.child(roomInfo.uid).child("tables").update({
                            replace_X: true
                          });
                        refRooms.child(roomInfo.uid).update({
                            turn: "O",
                            time: 59
                          });
                        $("#replaceModal").modal("hide")
                        updateQuestion(roomInfo, "replace-btn")
                    }
                    if ($(this).text() !== correctAnswer) {
                        console.log("incorrect replace")
                        refRooms.child(roomInfo.uid).update({
                            turn: "O",
                            time: 59
                        });
                        showDialog(`คำตอบที่ถูกคือ:<br>${correctAnswer}`)
                        // $("#questionModal").val("")
                        $("#replaceModal").modal("hide")
        
                        //ลบคำถามในช่องนั้นออกแล้วแทนที่ด้วยคำถามใหม่
                        updateQuestion(roomInfo, "replace-btn")
                    }
                });
               
                isBtnReplaceDisabled = true;
                btnReplace.classList.add("disabled"); 
                specialfx.classList.add("disabled");

            }
            else{
                showDialog("โปรดเลือกสัญลักษณ์ของฝั่งตรงข้าม")
            }
          }
          else if (event.target.src.endsWith("X.png")) {
            console.log("X");
            if(roomInfo.turn == "O"){
                refRooms.child(roomInfo.uid).update({
                    time: Math.ceil(roomInfo.time / 2)
                  });
                console.log("replace")
                $("#question-replace").html(roomInfo["tables"]["replace-btn"].question)
                    const choices = roomInfo["tables"]["replace-btn"].choices
                    for (let i = 0; i < choices.length; i++) {
                        $(`#choiceR${i+1}`).html(choices[i])
                    }
                $("#replaceModal").modal("show")
                console.log(choices)
                $(".choice-replace").click(function() {
                    const correctAnswer = roomInfo["tables"]["replace-btn"]["answer"];
                    console.log(correctAnswer)
                    countAnswer(roomInfo);
                    // ตรวจสอบว่าตัวเลือกที่ผู้ใช้เลือกตรงกับคำตอบที่ถูกต้องหรือไม่
                    if ($(this).text() === correctAnswer) {
                        correctNum(roomInfo)
                        refRooms.child(roomInfo.uid).child("tables").child(tableBlock.id).update({
                            own : roomInfo.turn
                        })
                        refRooms.child(roomInfo.uid).child("tables").update({
                            replace_O: true
                          });
                        refRooms.child(roomInfo.uid).update({
                            turn: "X",
                            time: 59
                          });
                        $("#replaceModal").modal("hide")
                        updateQuestion(roomInfo, "replace-btn")
                    }
                    if ($(this).text() !== correctAnswer) {
                        console.log("incorrect replace")
                        refRooms.child(roomInfo.uid).update({
                            turn: "X",
                            time: 59
                        });
                        showDialog(`คำตอบที่ถูกคือ:<br>${correctAnswer}`)
                        // $("#questionModal").val("")
                        $("#replaceModal").modal("hide")
        
                        //ลบคำถามในช่องนั้นออกแล้วแทนที่ด้วยคำถามใหม่
                        updateQuestion(roomInfo, "replace-btn")
                    }
                });
               
                isBtnReplaceDisabled = true;
                btnReplace.classList.add("disabled");     
                specialfx.classList.add("disabled");

            }
            else{
                showDialog("โปรดเลือกสัญลักษณ์ของฝั่งตรงข้าม")
            }
          }
        // console.log(roomInfo["tables"][pos]["own"])
        // isBtnReplaceDisabled = true;  
        
        
    });
  });
  
});



const btnSwap = document.getElementById("btn-swap");
let isBtnSwapDisabled = false;
let selectedO = 0;
let selectedX = 0;
btnSwap.addEventListener("click", () => {
    $("#swapModal").modal({
        backdrop: "static",
        keyboard: false
    });
    const currentUser = firebase.auth().currentUser;
    if (currentUser.uid !== roomInfo[`user-${roomInfo.turn.toLowerCase()}-id`] && !isBtnSwapDisabled) {
        showDialog("Not your turn!")
        return
    }
    if (roomInfo.winner) {
        return
    }
    if(isBtnSwapDisabled === false){
    showDialog("เลือกช่องของคุณและข่องของฝั่งตรงข้ามที่ต้องการสลับที่")
    }
    // if (selectedO < 1 || selectedX < 1) {
    //     showDialog("Please select both O and X images first!")
    //     return
    // }
    // imgElements.forEach(img => {
    //     img.removeEventListener("click", handleImageClick);
    // });
    let selectedO = null;
    let selectedX = null;
    imgElements.forEach(img => {
    img.addEventListener("click", (event) => {
        if (isBtnSwapDisabled) {
            return;
        }
        const tableBlock = event.target.parentElement.parentElement.closest(".table-block");
        const pic = event.target.src;
        if (pic.endsWith("O.png")) {
            if (selectedO !== null) {
                return;
            }
            console.log("click O")
            selectedO = tableBlock.id;
        } 
        if (pic.endsWith("X.png")) {
            if (selectedX !== null) {
                return;
            }
            console.log("click X")
            selectedX = tableBlock.id;
        }
        if (selectedO !== null && selectedX !== null) {
            refRooms.child(roomInfo.uid).update({
                time: Math.ceil(roomInfo.time / 2)
              });
            console.log("swap")
            $("#question-swap").html(roomInfo["tables"]["swap-btn"].question)
                const choices = roomInfo["tables"]["swap-btn"].choices
                for (let i = 0; i < choices.length; i++) {
                    $(`#choiceS${i+1}`).html(choices[i])
                }
            $("#swapModal").modal("show")
            console.log(choices)
            $(".choice-swap").click(function() {
                const correctAnswer = roomInfo["tables"]["swap-btn"]["answer"];
                console.log(correctAnswer)
                countAnswer(roomInfo);
                // ตรวจสอบว่าตัวเลือกที่ผู้ใช้เลือกตรงกับคำตอบที่ถูกต้องหรือไม่
                if ($(this).text() === correctAnswer) {
                    correctNum(roomInfo)
                    refRooms.child(roomInfo.uid).child("tables").child(selectedO).update({
                        own: "X"
                    });
                    refRooms.child(roomInfo.uid).child("tables").child(selectedX).update({
                        own: "O"
                    });
                    refRooms.child(roomInfo.uid).update({
                        turn: roomInfo.turn === "X" ? "O" : "X",
                        time: 59
                    });
                    // refRooms.child(roomInfo.uid).child("tables").update({
                    //     swap_O: true
                    //   });
                    $("#swapModal").modal("hide")
                    updateQuestion(roomInfo, "swap-btn")
                }
                if ($(this).text() !== correctAnswer) {
                    console.log("incorrect swap")
                    refRooms.child(roomInfo.uid).update({
                        turn: roomInfo.turn === "X" ? "O" : "X",
                        time: 59
                    });
                    showDialog(`คำตอบที่ถูกคือ:<br>${correctAnswer}`)
                    // $("#questionModal").val("")
                    $("#swapModal").modal("hide")
    
                    //ลบคำถามในช่องนั้นออกแล้วแทนที่ด้วยคำถามใหม่
                    updateQuestion(roomInfo, "swap-btn")
                }
            });
            isBtnSwapDisabled = true;
            btnSwap.classList.add("disabled");  
            specialfx.classList.add("disabled");
        }
    });
});

    })


//ลบคำถามในช่องนั้นออกแล้วแทนที่ด้วยคำถามใหม่
function updateQuestion(roomInfo, pos) {
        refRooms.child(roomInfo.uid).child("questions-left").once("value", snapshot => {
            const questionsLeft = snapshot.val();
            const randomQuestion = Math.floor(Math.random() * questionsLeft.length);
            const randomQuestionData = questionsLeft[randomQuestion];
            
            // Remove the selected question from the "questions-left" list
            questionsLeft.splice(randomQuestion, 1);
            refRooms.child(roomInfo.uid).child("questions-left").set(questionsLeft);
    
            // Update the selected question in the "tables" list
            const updates = {};
            updates[pos] = randomQuestionData;
            console.log(updates)
            refRooms.child(roomInfo.uid).child("tables").update(updates);
        })
    }

function checkWinner(room){
    const currentUser = firebase.auth().currentUser
    refRooms.child(room.uid).once("value", (data) => {
        data = data.val()
        if (data.winner){
            return
        }
       
       
        for (const turn of ["X", "O"]){
            win1 = data["tables"]["row-1-col-1"]["own"] == turn && data["tables"]["row-1-col-2"]["own"] == turn && data["tables"]["row-1-col-3"]["own"] == turn 
            win2 = data["tables"]["row-2-col-1"]["own"] == turn && data["tables"]["row-2-col-2"]["own"] == turn && data["tables"]["row-2-col-3"]["own"] == turn 
            win3 = data["tables"]["row-3-col-1"]["own"] == turn && data["tables"]["row-3-col-2"]["own"] == turn && data["tables"]["row-3-col-3"]["own"] == turn 
            win4 = data["tables"]["row-1-col-1"]["own"] == turn && data["tables"]["row-2-col-1"]["own"] == turn && data["tables"]["row-3-col-1"]["own"] == turn 
            win5 = data["tables"]["row-1-col-2"]["own"] == turn && data["tables"]["row-2-col-2"]["own"] == turn && data["tables"]["row-3-col-2"]["own"] == turn 
            win6 = data["tables"]["row-1-col-3"]["own"] == turn && data["tables"]["row-2-col-3"]["own"] == turn && data["tables"]["row-3-col-3"]["own"] == turn 
            win7 = data["tables"]["row-1-col-1"]["own"] == turn && data["tables"]["row-2-col-2"]["own"] == turn && data["tables"]["row-3-col-3"]["own"] == turn 
            win8 = data["tables"]["row-1-col-3"]["own"] == turn && data["tables"]["row-2-col-2"]["own"] == turn && data["tables"]["row-3-col-1"]["own"] == turn 

            if ((win1 || win2 || win3 || win4 || win5 || win6 || win7 || win8)){
                refRooms.child(room.uid).update({
                    status: "finish",
                    winner: turn
                })
                const idWin = data[`user-${turn.toLowerCase()}-id`]
                const idLose = data[`user-${turn === "X" ? "o" : "x"}-id`]
                if (!room.scoreupdate){
                    refUsers.child(idWin).once("value", (data) => {
                        user = data.val()
                        refUsers.child(idWin).update({
                            winRound: parseInt(user.winRound) + 1,
                            round: parseInt(user.round) + 1
                        })
                        
                    })
                    refUsers.child(idLose).once("value", (data) => {
                        user = data.val()
                        refUsers.child(idLose).update({
                            // lose: parseInt(user.lose) + 1,
                            round: parseInt(user.round) + 1
                        })
                        
                    })
                    refRooms.child(room.uid).update({
                        scoreupdate: "true"
                    })
                }
                return
            }
            //เสมอ
            if (data["tables"]["row-1-col-1"]["own"] && data["tables"]["row-1-col-2"]["own"] && data["tables"]["row-1-col-3"]["own"] && data["tables"]["row-2-col-1"]["own"] && data["tables"]["row-2-col-2"]["own"] && data["tables"]["row-2-col-3"]["own"] && data["tables"]["row-3-col-1"]["own"] && data["tables"]["row-3-col-2"]["own"] && data["tables"]["row-3-col-3"]["own"]){
                refRooms.child(room.uid).update({
                    status: "finish",
                    winner: "draw"
                })
            }
        }
    })
}

let countTime = setInterval(() => {
    const currentUser = firebase.auth().currentUser
    if (roomInfo.uid){
        refRooms.child(roomInfo.uid).once("value", (data) => {
            data = data.val()
            if (data[`user-${data.turn.toLowerCase()}-id`] == currentUser.uid && data.status == "start")
            if (parseInt(data.time) - 1 >= 0) {
                refRooms.child(roomInfo.uid).update({
                    time: parseInt(data.time) - 1
                })
            }
            else{
                $("#questionModal").modal("hide")
                $("#replaceModal").modal("hide")
                $("#swapModal").modal("hide")
                refRooms.child(roomInfo.uid).update({
                    time: 59,
                    turn: data.turn == "X" ? "O" : "X"
                })
            }
        })
    }
}, 1000)

$("#btn-exit").click(() => {
    refRooms.child(roomInfo.uid).remove()
    window.location.href = './mainmenu.html'
})

$("#btn-finish").click(finishGame)
$("#btn-end").click(() => {
    refRooms.child(roomInfo.uid).update({
        winner: "stop"
    })
})
function finishGame(){
    clearInterval(countTime)
    refRooms.child(roomInfo.uid).update({
        status: "finish"
    })
    $("#finishModal").modal({
        backdrop: "static"
    })
    $("#finishModal").modal("show")

    const currentUser = firebase.auth().currentUser
    for (const player of ["x", "o"])
    {
        if (!roomInfo.expupdate && currentUser.uid == roomInfo[`user-${player}-id`]){
            refUsers.child(roomInfo[`user-${player}-id`]).once("value", (data) => {
                const userProfile = data.val()
                //ถ้าแพ้
                let addExp = 50;
                if (roomInfo.winner == "draw"){
                    $("#whoWin").html("Draw")
                    addExp = 0
                }
                else if (roomInfo.winner == "stop"){
                    $("#whoWin").html("someone left the game")
                    $("#desGameOver").html("")
                    addExp = 0
                }
                else if (currentUser.uid == roomInfo[`user-${roomInfo.winner.toLowerCase()}-id`]){
                    addExp = 100
                    // console.log(userProfile.name);
                    $("#whoWin").html("You Win !")
                    $("#desGameOver").html("+100 score " + userProfile.name)
                }
                else {
                    $("#whoWin").html("You Lose !")
                    $("#desGameOver").html("+50 score " + userProfile.name)
                }
                
                if (!roomInfo.expupdate){
                    refUsers.child(currentUser.uid).once("value", (data) => {
                        user = data.val()
                        refUsers.child(currentUser.uid).update({
                            score: parseInt(user.score) + addExp
                        })
                    })
                    console.log(addExp)
                    if (player == "o"){
                        refRooms.child(roomInfo.uid).update({
                            expupdate: "true"
                        })
                    }
                }
               
                
            })
        }
    }
}



// ใส่ tooltip ให้ปุ่มฟังก์ชันพิเศษ
$(function () {
        $('[data-toggle="tooltip"]').tooltip()
      })


function showDialog(message){
    $("#messageModal .modal-body").html(message)
    $("#messageModal").modal("show")
    setTimeout(() => {
        $("#messageModal").modal("hide")
    }, 2000)
}
