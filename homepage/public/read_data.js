const userListRef = firebase.database().ref("users")
const user = localStorage.getItem('current-user');

let readData = () => {

    document.getElementById("username").innerHTML="";
    const currentUser = firebase.auth().currentUser;
    userListRef.child(user).once("value").then((snapshot) => {
        snapshot.forEach((data) => {
            var id = data.key;
            var title = data.val().username;
            
           
        }) 
    })
}

let getList = (user) =>{
    if (user){
        userListRef.child(user.uid).on("value", (snapshot) => {
            readData();
        });
    }
};
