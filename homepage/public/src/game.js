const refRooms = firebase.database().ref("Rooms")
let roomInfo = {}

refRooms.on("value", data => {
    data = data.val()
    const currentUser = firebase.auth().currentUser
    for (const d in data){
        const rInfo = data[d]
        if (rInfo["user-x-id"] === currentUser.uid || rInfo["user-o-id"] === currentUser.uid){
            roomInfo = rInfo
            if (rInfo.status == "found"){
                refRooms.child(rInfo.uid).update({
                    status: "start"
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
            $(`#game-info-user-${player} .game-user-name`).html(user.name)
            $(`#game-info-user-${player} .game-user-level`).html(`Level : ${Math.ceil((user.exp) / 50)}`)

            if (!room.winner && room.turn.toLowerCase() === player){
                $("#game-info-turn span").html(room[`user-${room.turn.toLowerCase()}-id`] == currentUser.uid ? "YOU!" : user.name)
            }

        })
    }
    
    $(`#game-info-category`).html(`${room.category}`)
    $(`#game-info-time span`).html("&nbsp;" + room.time)

    if (room.winner === "draw"){
        $(`#game-info-player`).html("")
        $("#game-info-turn").html(`<span> DRAW </span>`)
        setTimeout(() => {
            finishGame()
        }, 2000)
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
    $("#vocabModalLabel .vocabModal-time").html(`Time : ${room.time}`)
    
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
        if (currentUser.uid == roomInfo[`user-${roomInfo.turn.toLowerCase()}-id`]){
            console.log("your turn")
            const pos = el.parentNode.id
            // var correctAnswer = roomInfo["tables"][pos]["answer"]; 
            $("#vocabModal").modal("show")
            $("#question").html(roomInfo["tables"][pos].question)
            const choices = roomInfo["tables"][pos].choices
                for (let i = 0; i < choices.length; i++) {
                    $(`#choice${i+1}`).html(choices[i])
                }
  
        }
        if (roomInfo.winner){
            return
        }

        //ถ้ากดที่ช่องที่มีคนลงเเล้วจะขึ้นข้อความ "Change Table!"
        const pos = el.parentNode.id
        // console.log(pos)
        // console.log(roomInfo["tables"][pos])
        const correctAnswer = roomInfo["tables"][pos]["answer"];
        $(".choice").click(function() {
            // console.log("click ch");
            // ตรวจสอบว่าตัวเลือกที่ผู้ใช้เลือกตรงกับคำตอบที่ถูกต้องหรือไม่
            if ($(this).text() === correctAnswer) {
                console.log("Correct Answer");
                refRooms.child(roomInfo.uid).child("tables").child($('#vocabModalLabel').val()).update({
                    own: roomInfo.turn
                });
                refRooms.child(roomInfo.uid).update({
                    turn: roomInfo.turn === "X" ? "O" : "X",
                    time: 59
                });
                // answerFeedbacstyle.color = `green`;
                // setTimeout(() => {
                $("#vocabModal").val("");
                $("#vocabModal").modal("hide");
                // }, 2000)
            } else {
                console.log("Incorrect Answer");
                // answerFeedback.snerText = `Your answer is incorrect`;
            }
        });
        
        if (roomInfo["tables"][pos].own){
            showDialog("Change Table!")
            return
        }

        //คลิกรูปเเล้ว modal ให้ตอบ
        $("#vocabModalLabel").val(pos)
        $("#vocabModalLabel .vocabModal-table").html(pos)
        
    })
    // อ่านคำตอบจาก Firebase
// const pos = el.parentNode.id
// const correctAnswer = roomInfo["tables"][pos]["answer"];

// เมื่อผู้ใช้เลือกตัวเลือก

})


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
                            win: parseInt(user.win) + 1
                        })
                    })
                    refUsers.child(idLose).once("value", (data) => {
                        user = data.val()
                        refUsers.child(idLose).update({
                            lose: parseInt(user.lose) + 1
                        })
                    })
                    refRooms.child(room.uid).update({
                        scoreupdate: "true"
                    })
                }
                return
            }

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
                $("#vocabModal").modal("hide")
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
    window.location.href = './lobby.html'
})

$("#btn-finish").click(finishGame)

function finishGame(){
    clearInterval(countTime)
    refRooms.child(roomInfo.uid).update({
        status: "finish"
    })
    $("#finishModal").modal({
        backdrop: "static"
    })
    $("#finishModal").modal("show")
}



function showDialog(message){
    $("#messageModal .modal-body").html(message)
    $("#messageModal").modal("show")
    setTimeout(() => {
        $("#messageModal").modal("hide")
    }, 1000)
}
