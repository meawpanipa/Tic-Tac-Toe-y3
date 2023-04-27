<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Homepage</title>

    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.3/font/bootstrap-icons.css"
    />
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css"
      rel="stylesheet"
      integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC"
      crossorigin="anonymous"
    />
    <script
      src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
      integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
      crossorigin="anonymous"
    ></script>
    <script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-analytics.js"></script>
    <script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-database.js"></script>

    <link rel="stylesheet" href="style.css" />
    <title>Welcome to Firebase Hosting</title>

    <style media="screen">
      body {
        color: rgba(0, 0, 0, 0.87);
        font-family: Roboto, Helvetica, Arial, sans-serif;
        margin: 0;
        padding: 0;
      }

      #message {
        background: white;
        max-width: 360px;
        margin: 100px auto 16px;
        padding: 32px 24px;
        border-radius: 3px;
      }

      #message h2 {
        color: #ffa100;
        font-weight: bold;
        font-size: 16px;
        margin: 0 0 8px;
      }

      #message h1 {
        font-size: 22px;
        font-weight: 300;
        color: rgba(0, 0, 0, 0.6);
        margin: 0 0 16px;
      }

      #message p {
        line-height: 140%;
        margin: 16px 0 24px;
        font-size: 14px;
      }

      #message a {
        display: block;
        text-align: center;
        background: #039be5;
        text-transform: uppercase;
        text-decoration: none;
        color: white;
        padding: 16px;
        border-radius: 4px;
      }

      #message,
      #message a {
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
      }

      #load {
        color: rgba(0, 0, 0, 0.4);
        text-align: center;
        font-size: 13px;
      }

      @media (max-width: 600px) {
        body,
        #message {
          margin-top: 0;
          background: white;
          box-shadow: none;
        }

        body {
          border-top: 16px solid #ffa100;
        }
      }
    </style>
  </head>

  <body>
    <div class="d-flex flex-column">

    
    <div class="container justify-content-center align-items-center">
      <div class="d-flex">
        <div class="me-3 align-items-center">
          <h1 class="mt-3 mx-3" id="username"></h1>
        </div>
      </div>
    </div>

    <div class="container bg-warning ">
      <div class="row" >
        <div class="p-0 p-lg-0 p-md-0  pb-lg-0 pt-3 px-3 pt-md-0 pt-lg-0 pb-md-0 pb-sm-2 justify-content-center block col-md-6 col-12" class="l_block">
          <div
            class="p-5 pt-3 justify-content-center profile col-12 d-inline-block" style="height: 100%;"
          >
            <div class="d-flex justify-content-center">
              <h1>Player State</h1>
            </div>
            <div class="d-flex justify-content-center bg-info">
              <p class="fw-bold mt-5 bg-danger" style="font-size: 200%">Total Score</p>
              <p id="player_score" class="fw-bold" style="font-size: 600%"></p>
              <p class="fw-bold mt-5" style="font-size: 200%">Point</p>
            </div>
            <hr />

            <div >
              <div class="row">
                <div class="d-flex justify-content-between">
                  <h5>Total Match</h5>
                  <h5 id="round" class="player_data"></h5>
                </div>
              </div>
              <hr />
              <div class="row">
                <div class="d-flex justify-content-between">
                  <h5 class="player_stat">Win Rate</h5>
                  <h5 id="win_rate" class="player_data"></h5>
                </div>
              </div>

              <hr />

              <div class="row">
                <div class="d-flex justify-content-between">
                  <h5 class="player_stat">Correct Rate</h5>
                  <h5 id="correct_rate" class="player_data"></h5>
                </div>
              </div>
              <hr />
              <div class="row">
                <div class="d-flex justify-content-between">
                  <h5 class="player_stat">Number of Wins</h5>
                  <h5 id="winNum"></h5>
                </div>
              </div>
              <hr />
              <div class="row">
                <div class="d-flex justify-content-between">
                  <h5 class="player_stat">Number of Question</h5>
                  <h5 id="questionNum" class="player_data"></h5>
                </div>
              </div>

             
            </div>
          </div>
        </div>

        <div class="p-0  justify-content-center block col-md-6 col-12 pt-2 pt-sm-0 px-3 bg-info" style="height: 75vh;">
          <div
            class="p-5 d-flex justify-content-center align-items-center profile fs-1 "
            style="height: 20%"
          >
          
              <p class="fs-1 fw-bold" style="margin-bottom: 0%;">Your Rank :</p>
              <p class="fs-1 fw-bold" id="player_rank" style="margin-bottom: 0%;"></p>
         
          </div>
          <div
            class="p-4 justify-content-center profile col-12 mt-2 d-inline-block"
            style="height: 30vh"
          >
            <div class="row">
              <div class="d-flex justify-content-center">
                <h1 id="win_rate">Top 3 Player</h1>
              </div>
            </div>
            <div class="row">
              <div class="d-flex justify-content-between pt-5">
                <h5 id="sec"></h5>
                <h5 id="first"></h5>
                <h5 id="third"></h5>
              </div>
            </div>
          </div>
          <a
            href="leaderboard.html"
            class="p-5 d-flex justify-content-center align-items-center profile col-12 mt-2 menubtn fs-1"
            style="height: 0%"
          >
           Leaderboard
          </a>
          <a
            href="./choose-mode.html"
            class="d-flex justify-content-center align-items-center profile col-12 mt-2 menubtn fs-1"
            style="height: 22.5vh"
          >
            <div class="d-flex justify-content-center fs-1">Start</div>
          </a>
          <div class="row profile mt-2 mx-lg-2 d-md-none">
            <button class="glow-on-hover fs-1 fw-bold" type="button" onclick="logOut()">
              LOGOUT
            </button>
          </div>
        </div>
      </div>

      <div class="row d-flex justify-content-end">
        <div class="col-lg-1 col-sm-2 col-3 d-md-block d-none">
          <div id="mybutton">
            <button class="feedback" type="button" onclick="logOut()">
              LOGOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
    <!-- <div class="container">
      <div id="mySidebar" class="sidebar" style="">
        <a href="javascript:void(0)" class="closebtn" onclick="closeNav()">X</a>
        <div class="tab d-flex justify-content-center">
          <button
            class="tablinks"
            onclick="openCity(event, 'friend_list')"
            id="defaultOpen"
          >
            Friend List
          </button>
          <button class="tablinks" onclick="openCity(event, 'Add/Request')">
            Add/Request
          </button>
        </div>

        friendlist
        <div class="d-felx">
          <div id="friend_list" class="tabcontent">
            <div class="container p-3 pt-4">
              <div class="row">
                <div class="d-flex justify-content-start col">
                  <h3>Friend List</h3>
                </div>
                <div class="d-flex col justify-content-end">
                  <h3 id="friend_num">1</h3>
                  <h3>/20</h3>
                </div>
              </div>
            </div>
      
            <div class="container bg-warning friendblock" id="friendblock">
              <div class="row">
                <div
                  class="col-4 d-flex justify-content-center"
                  id="friend_pic"
                >
                  Picture
                </div>
                <div class="col-6">
                  <div class="row fs-4" id="friend_name">Friendname</div>
                  <div class="row fs-4" id="state">Online</div>
                </div>
              </div>
            </div>
            <div class="container bg-warning friendblock" id="friendblock">
              <div class="row">
                <div
                  class="col-4 d-flex justify-content-center"
                  id="friend_pic"
                >
                  Picture
                </div>
                <div class="col-6">
                  <div class="row fs-4" id="friend_name">Friendname</div>
                  <div class="row fs-4" id="state">Online</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="Add/Request" class="tabcontent">
          <div class="container p-3 pt-4">
            <div class="row">
              <div class="d-flex justify-content-start col">
                <h3>Add/Request</h3>
              </div>
            </div>
            <div class="row">
              <div class="container"><form id="searchForm"></form>
                <div class="input-group">
                  
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Search player name"
                      id="searchInput"
                    />
                  

                  <div class="input-group-append" id="searchBtn">
                    <button class="btn btn-secondary" type="button">
                      <span class="bi bi-search"></span>
                    </button>
                  </div>
                </div></form>
                <div id="addFriend"></div>
                <hr /> -->
    <!-- Friend Request -->
    <!-- <div class="container p-3 pt-4">
                  <div class="row">
                    <div class="d-flex justify-content-start col-8">
                      <h3>Friend Request</h3>
                    </div>
                    <div class="d-flex col justify-content-start">
                      <h3 id="request_num">1</h3>
                      <h3>/20</h3>
                    </div>
                  </div>
                </div> -->

    <!-- Add Request here -->
    <!-- <div class="container bg-warning requestblock" id="request">
                  <div class="row">
                    <div
                      class="col-4 d-flex justify-content-center"
                      id="friend_pic"
                    >
                      Picture
                    </div>
                    <div class="col-6">
                      <div class="row fs-4" id="friend_name">Friendname</div>
                      <div class="row fs-4 mt-2">
                        <div class="btn btn-success col-5 mx-1" id="acceptbtn">
                          Accept
                        </div>
                        <div class="btn btn-danger col-5 mx-1" id="rejectbtn">
                          Reject
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> -->

    <!-- <div
        id="main"
        class="position-absolute"
        style="bottom: 50%; padding: 0; right: 0%"
      >
        <button
          class="openbtn rounded-start"
          onclick="openNav()"
          style="width: auto; height: 100px"
        >
          <span><i class="bi bi-people-fill"></i> </span>
        </button>
      </div> -->
    <!-- </div>  -->
    <script>
      function logOut() {
        window.location.assign("index.html");
        localStorage.removeItem("current-user");
      }
    </script>

    <script src="src/config.js"></script>
    <script src="src/mainmenu.js"></script>
    <script src="./src/app.js"></script>
    <!-- <script src="src/search.js"></script>
    <script src="src/sidebar.js"></script> -->
  </body>
</html>
