const firebaseConfig = {
    apiKey: "AIzaSyDGZNlzcpzUlJOOb-UZdvYL0HT3mga6FMI",
    authDomain: "xo-net.firebaseapp.com",
    databaseURL: "https://xo-net-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "xo-net",
    storageBucket: "xo-net.appspot.com",
    messagingSenderId: "449596452366",
    appId: "1:449596452366:web:59a7f2d637c471f375165f"
};
firebase.initializeApp(firebaseConfig);

const refUsers = firebase.database().ref("UserList")

$("#btnLogout").click(logout)
$("#btnLogout-mobile").click(logout)

function logout(){
    firebase.auth().signOut()
    // console.log('Logout completed.');
    window.location.href = "./"
}

firebase.auth().onAuthStateChanged((user) => {
    // console.log('User: ', user);
    if (user){
        refUsers.child(user.uid).once("value", (data) => {
            const userProfile = data.val()
            $("#profile-name>span").html(userProfile.name)
        })

        refOnline.once("value", (data) => {
            data = data.val()
            
            if (!data || !data[user.uid]){
                refUsers.child(user.uid).once("value", (data) => {
                    const user = data.val()
                    refOnline.child(user.uid).update({
                        name: user.name
                    })
                })
            }
        })

        $(".logged-out").each((i, el) => {
            $(el).hide()
        })
        $(".logged-in").each((i, el) => {
            $(el).show()
        })
    }
    else{
        $(".logged-out").each((i, el) => {
            $(el).show()
        })
        $(".logged-in").each((i, el) => {
            $(el).hide()
        })
    }
})

const refOnline = firebase.database().ref("onlines")

window.onbeforeunload = (event) => {
    const currentUser = firebase.auth().currentUser
    refOnline.once("value", (data) => {
        data = data.val()
        if (data[currentUser.uid]){
            refOnline.child(currentUser.uid).remove()
        }
    })
}

refOnline.on("value", (data) => {
    $("#user-online span").html(data.numChildren())
})