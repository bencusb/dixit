username = "";
game_state = 
{
  state: "init"
}

setInterval(tick, 3000);

/*$(document).ready(function(){
    $('#username').keypress(function(e){
      if(e.keyCode==13)
      $('#btn').click();
    });
})*/

function onLoad()
{
	console.log("onLoad() called");	
	update_viev();
}

function join()
{
	var xhttp = new XMLHttpRequest();
	username = document.getElementById("username").value;
	console.log("sent user=" + username);
	xhttp.onreadystatechange = generic_response;
	xhttp.open("GET", "/join?username=" + username, true);
	xhttp.send();
}

function start()
{
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = generic_response;
	xhttp.open("GET", "/start", true);
	xhttp.send();
}

function generic_response() 
{	
	if(this.readyState==4 && this.status==200)
	{
		console.log("tick_response called");
		game_state = JSON.parse(this.responseText);
		console.log(game_state);
		update_viev();
	}
	else
	{
		//console.log("tick_response error");
	}
		
};

function update_viev()
{
	console.log("update_viev() called");
	if(game_state.state == "init" )
	{
		document.getElementById('user_data').hidden = true;
		document.getElementById('cards_played').hidden = true;
		document.getElementById('cards_in_hand').hidden = true;
		document.getElementById('story').hidden = true;
	}
	else
	{
		//console.log("dowegethere?");
		document.getElementById("btn_start").disabled = true;
		//console.log("username="+username);
		
		var cards = game_state.users[username].cards;		
		for(i=0; i<cards.length; i++)
		{
			document.getElementById("img"+(i+1)).src="\\images\\cards\\Dixit - Odyssey\\"+cards[i]+".jpg";
		}		
		
		document.getElementById('user_data').hidden = false;
		document.getElementById('cards_played').hidden = false;
		document.getElementById('cards_in_hand').hidden = false;
	}
	
	// show or hide the story
	var s = document.getElementById('story');
	if(game_state.state == "wait_for_response_cards" )
	{
		s.hidden = false;
		s.innerHTML  = "<p>" + game_state.story + "</p>";
	}
	else
	{
		s.hidden = true;		
	}
}

function tick()
{
	console.log("tick() called, user=" + username);
	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = generic_response;
	xhttp.open("GET", "/tick?username=" + username, true);
	xhttp.send();
}

function img_clicked(source)
{
	if(game_state.state != "wait_for_story" || username != game_state.users_in_playing_order[game_state.story_teller_ind])
		return;
	
	// check if story is valid
	var story = prompt("Please enter the story:", "Write a story!");
    if (story==null || story=="") 
		return;
	
	// send story to the server	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = generic_response;
	xhttp.open("GET", "/set_story?story=" + story, true);
	xhttp.send();
	
	// place the card
	card_ind = parseInt(source.id.substring(3,4))-1;	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = generic_response;
	xhttp.open("GET", "/place_card?username=" + username + "&card_ind=" + card_ind, true);
	xhttp.send();
}