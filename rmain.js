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

// Leagues
let selectedLeague = ""; // Declare the variable globally

// Fetch leagues from Firebase and create league divs
const leagueRef = ref(db, 'leagues/');

get(leagueRef).then(snapshot => {
    const selectLeague = document.getElementById("selectleague"); // Get the selectleague container

    if (snapshot.exists()) {
        selectLeague.innerHTML = ""; // Clear existing league divs (if any)
        const leagueNames = Object.keys(snapshot.val()); // Extract all league names (keys)

        // Create a div for each league
        leagueNames.forEach(leagueName => {
            const leagueDiv = document.createElement("div");
            leagueDiv.className = "league"; // Set the class name
            leagueDiv.innerHTML = `<b>${leagueName}</b>`; // Set the inner HTML with the league name
            
            // Add click event listener to each league div
            leagueDiv.addEventListener('click', function() {
                selectedLeague = leagueName; // Extract the league name and save it in the global variable
                console.log("Selected League:", selectedLeague); // Log the selected league

                // Fetch data for the selected league
                const leagueDataRef = ref(db, `leagues/${selectedLeague}`);
                get(leagueDataRef).then(dataSnapshot => {
                    if (dataSnapshot.exists()) {
                        const leagueData = dataSnapshot.val(); // Get the data for the selected league
                        displayLeagueData(leagueData); // Call function to display data
                    } else {
                        console.log("No data found for the selected league");
                    }
                }).catch(error => {
                    console.error("Error fetching league data:", error);
                });
            });

            selectLeague.appendChild(leagueDiv); // Add the league div to the selectleague container
        });
    } else {
        console.log("No leagues found in the database");
    }
}).catch(error => {
    console.error("Error fetching leagues:", error);
});

// Function to display league data in a table
function displayLeagueData(leagueData) {
    const selectLeague = document.getElementById("selectleague");
    selectLeague.style.display = 'none'; // Hide the league selection

    // Create a table element
    const table = document.createElement('table');
    table.style.width = '100%'; // Set table width
    table.border = '1'; // Add border to the table

    // Create table header
    const headerRow = table.insertRow();
    const headerCell1 = headerRow.insertCell(0);
    const headerCell2 = headerRow.insertCell(1);
    headerCell1.innerHTML = "<b>Player</b>";
    headerCell2.innerHTML = "<b>Position</b>";

    // Convert leagueData to an array and sort by position
    const sortedPlayers = Object.entries(leagueData)
        .filter(([key]) => key !== '*') // Exclude unwanted keys
        .sort((a, b) => a[1] - b[1]); // Sort by position (assuming position is a number)

    // Populate the table with sorted league data
    sortedPlayers.forEach(([playerName, position]) => {
        const row = table.insertRow();
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        cell1.textContent = playerName; // Set player name in the left cell
        cell2.textContent = position; // Set corresponding position in the right cell
    });

    // Append the table to the body or a specific container
    document.body.appendChild(table); // You can change this to append to a specific container
}

// Search functionality
const searchBox = document.getElementById('searchbox');
const selectLeague = document.getElementById('selectleague'); // Get the parent container
const noResultsMessage = document.getElementById('no-results'); // Get the no results message element

searchBox.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const leagueDivs = selectLeague.querySelectorAll('.league'); // Get the league divs *within* the container

    let hasResults = false; // Flag to track if there are any results

    Array.from(leagueDivs).forEach(div => {  // Iterate over ALL divs
        const divText = div.textContent.toLowerCase();
        if (divText.includes(searchTerm)) {
            div.style.display = ''; // Show if it matches
            hasResults = true; // Set flag to true if there's a match
        } else {
            div.style.display = 'none'; // Hide if it doesn't
        }
    });

    // Show or hide the no results message based on the search results
    if (hasResults) {
        noResultsMessage.style.display = 'none'; // Hide the message if there are results
    } else {
        noResultsMessage.style.display = 'block'; // Show the message if there are no results
    }
});