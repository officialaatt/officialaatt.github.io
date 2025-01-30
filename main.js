// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getDatabase, set, get, ref, update } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAkgBJ7_o-LAL2lhreOBsJuCeUoJjtq1vM",
  authDomain: "aatt-5e938.firebaseapp.com",
  projectId: "aatt-5e938",
  storageBucket: "aatt-5e938.firebasestorage.app",
  messagingSenderId: "60669121912",
  appId: "1:60669121912:web:b328ecbda113c1e2e0a48d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

//universal
// Handle hamburger click to toggle menu
document.getElementById("hamburger").addEventListener('click', function() {
  const hamburger = document.querySelector('.hamburger');
  const menu = document.getElementById('menu');
  const menuBackground = document.getElementById('menu-background');
  
  hamburger.classList.toggle('active');
  
  // Toggle the menu slide and blur background
  if (hamburger.classList.contains('active')) {
      menu.style.right = '10px'; // Slide in the menu
      menuBackground.style.display = 'block'; // Show the background overlay
  } else {
      menu.style.right = '-300px'; // Slide the menu out of view
      menuBackground.style.display = 'none'; // Hide the background overlay
  }
});

// Close menu when clicking on the blurred background
document.getElementById("menu-background").addEventListener('click', function() {
  const hamburger = document.querySelector('.hamburger');
  const menu = document.getElementById('menu');
  const menuBackground = document.getElementById('menu-background');
  
  hamburger.classList.remove('active');
  menu.style.right = '-300px'; // Slide the menu out of view
  menuBackground.style.display = 'none'; // Hide the background overlay
});

var namel;
var player;
var position = 0;

//addleague
document.getElementById('addl').addEventListener('click', function(){
  namel = document.getElementById('lname').value;
  set(ref(db, 'leagues/' + namel),{
    "*" : position
  })
  location.reload()
})

//addplayer
// Variable to hold league names
const leagueRef = ref(db, 'leagues/');
  
get(leagueRef).then(snapshot => {
  const leagueSelect = document.getElementById("leagur"); // Get the select element

  if (snapshot.exists()) {
    leagueSelect.innerHTML = ""; // Clear existing options (if any)
    const leagueNames = Object.keys(snapshot.val()); // Extract all league names (keys)
      
    // Create an option for each league
    leagueNames.forEach(leagueName => {
      const option = document.createElement("option");
      option.value = leagueName; // Set the value to the league name
      option.textContent = leagueName; // Set the text content to the league name
      leagueSelect.appendChild(option); // Add the option to the select element
    });
  } else {
    console.log("No leagues found in the database");
  }
}).catch(error => {
  console.error("Error fetching leagues:", error);
});

//onclick addplayer
document.getElementById("adplbtn").addEventListener('click', function(){
  let selectedLeague = document.getElementById("leagur").value;
  let plname = document.getElementById("playername").value;
  let plposition = document.getElementById("plpos").value;
  update(ref(db, 'leagues/' + selectedLeague),{
    [plname] : plposition
  })
  location.reload()
}) 