// Tweeter JavaScript File

// Modal Variables
var modalBackdrop = document.getElementById("modal-backdrop");
var modalCreate = document.getElementById("create-twit-modal");
var modalCancelButton = document.getElementsByClassName("modal-cancel-button")[0];
var modalCloseButton = document.getElementsByClassName("modal-close-button")[0];
var modalAcceptButton = document.getElementsByClassName("modal-accept-button")[0];

// Twit Variables
var twitContainer = document.getElementsByClassName("twit-container")[0];
var twitButton = document.getElementById("create-twit-button");
var twitText = document.getElementById("twit-text-input");
var twitAuthor = document.getElementById("twit-attribution-input");

// Search Variables
var twitSearch = document.getElementById("navbar-search-input");
var twitSearchButton = document.getElementById("navbar-search-button");

// Stored Twits Variable (deep = true, copy whole subtree)
var storedTwits = twitContainer.cloneNode(true);

// Listen for events
twitButton.addEventListener("click", modalToggle);
modalCancelButton.addEventListener("click", modalToggle);
modalCloseButton.addEventListener("click", modalToggle);
modalAcceptButton.addEventListener("click", createTwit);
twitSearchButton.addEventListener("click", search);
twitSearch.addEventListener("keyup", search);

// Open/Close twit popup
function modalToggle(event) {
    // Hide/Reveal popup based on current state
    if (modalCreate.classList.contains("hidden")) {
        // Clear text fields for new twit
        twitText.value = "";
        twitAuthor.value = "";
        // Reveal popup
        modalCreate.classList.remove("hidden");
        modalBackdrop.classList.remove("hidden");
    } else {
        // Hide popup
        modalCreate.classList.add("hidden");
        modalBackdrop.classList.add("hidden");
    }
}

// Create new twit
function createTwit(event) {
    // Check for required fields
    if (twitText.value == "") {
        alert("Text field required!")
        return;
    }
    if (twitAuthor.value == "") {
        alert("Author field required!")
        return;
    }

    // i class (fa fa-bullhorn)
    var icon = document.createElement('i');
    icon.classList.add("fa");
    icon.classList.add("fa-bullhorn");

    // div class (twit-icon) - nest icon inside
    var twitIcon = document.createElement("div");
    twitIcon.classList.add("twit-icon");
    twitIcon.appendChild(icon);

    // p class (twit-text)
    var text = document.createElement('p');
    text.classList.add("twit-text");
    text.textContent = twitText.value;

    // a class (twit-author)
    var author = document.createElement('a');
    author.textContent = twitAuthor.value;
    author.href = '#';

    // p class (attribution) - nest author inside
    var attribution = document.createElement('p');
    attribution.classList.add("twit-author");
    attribution.appendChild(author);

    // div class (twit-content) - nest text and attribution inside
    var twitContent = document.createElement("div");
    twitContent.classList.add("twit-content");
    twitContent.appendChild(text);
    twitContent.appendChild(attribution);

    // article class (twit) - nest twitIcon and twitContent inside
    var twit = document.createElement("article");
    twit.classList.add("twit");
    twit.appendChild(twitIcon);
    twit.appendChild(twitContent);

    // Add twit to body of document
    twitContainer.appendChild(twit);

    // Hide twit popup
    modalToggle();
    
    // Update stored twits
    storedTwits.appendChild(twitContainer.lastChild.cloneNode(true));
}

// Search for twit
function search(event) {
    // Create vars for easy access
    var getTwits = twitSearch.value.toLowerCase();
    var size = storedTwits.children.length;
    var txt = [];
    var auth = [];
    
    // Remove all twits from body
    while(twitContainer.firstChild){
        twitContainer.removeChild(twitContainer.lastChild);
    }
    
    // Add twit contents from backups to lists
    for(i = 0; i < size; i++){
        txt.push(storedTwits.getElementsByClassName("twit-text")[i].textContent);
        auth.push(storedTwits.getElementsByClassName("twit-author")[i].textContent);
    }
    
    // Add matching twits back to body
    for(i = 0; i < size; i++){
        if(txt[i].toLowerCase().includes(getTwits) || auth[i].toLowerCase().includes(getTwits)){
            twitContainer.appendChild(storedTwits.children[i].cloneNode(true));
        }
   }
}

alert('JS successfully loaded.');
