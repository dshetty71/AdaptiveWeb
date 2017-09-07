// 		// ----------------------------------------------------------
// 		// This part of the script triggers when page is done loading
// 		console.log("Hello. This message was sent from scripts/inject.js");
// 		// ----------------------------------------------------------
$(document).click(function(e) { 
    // Check for left button
    if (e.button == 0) {
		console.log("User clicked on page");
		chrome.extension.sendMessage({
			userAction: "Page-Click"
		});
    }
});

$('[class^=vote-up]').click(function() { 
	console.log("Vote Up Clicked by user");
	chrome.extension.sendMessage({
		userAction: "Vote-Up"
	});
});

$('[class^=vote-down]').click(function() { 
	console.log("Vote Down Clicked by user"); 
	chrome.extension.sendMessage({
		userAction: "Vote-Down"
	});
});

$('[class^=question-hyperlink]').click(function() { 
	console.log(" User is checking other questions"); 
	chrome.extension.sendMessage({
		userAction: "Questions-Click"
	});
});

$('[class^=reputation-score]').mouseenter(function() { 
	console.log("Reputation score checked by user"); 
	chrome.extension.sendMessage({
		userAction: "Reputation-Check"
	});
});

$('[class^=suggest-edit]').click(function() { 
	console.log("User is checking comments"); 
	chrome.extension.sendMessage({
		userAction: "Suggest-Edit"
	});
});