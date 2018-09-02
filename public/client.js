username = "";
game_state = 
{
	state: "init",
	cards: [],
	tick_num: 0,
	users: {},
	users_in_playing_order: [],
	story: "",
	story_teller_ind: 0,
	cards_in_play: [],
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

function am_I_the_story_teller()
{
	return username == game_state.users_in_playing_order[game_state.story_teller_ind];
}

function call_server(query_string)
{
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = generic_response;
	xhttp.open("GET", query_string, true);
	xhttp.send();
}
	
function join()
{
	username = document.getElementById("username").value;
	console.log("sent user=" + username);
	call_server( "/join?username=" + username );
}

function start()
{
	call_server("/start");
}

function generic_response() 
{	
	if(this.readyState==4 && this.status==200)
	{
		console.log("tick_response called");
		console.log(this.responseText);
		
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
		return;
	}
	
		
	//console.log("dowegethere?");
	document.getElementById("btn_start").disabled = true;
	//console.log("username="+username);
	
	// show cards in hand
	document.getElementById('user_data').hidden = false;
	var cards = game_state.users[username].cards;
	for(i=0; i<6; i++)
	{
		var card = document.getElementById("card_in_hand"+(i+1));
		if( i<cards.length )
		{
			card.hidden = false;
			card.src="\\images\\cards\\Dixit - Odyssey\\"+cards[i]+".jpg";
		}
		else
		{
			card.hidden = true;
		}
	}			
	document.getElementById('cards_in_hand').hidden = false;
	
	// show card played
	document.getElementById('user_data').hidden = false;
	var cards = game_state.cards_in_play;
	for(i=0; i<6; i++)
	{
		var card = document.getElementById("card_in_play"+(i+1));
		if( i<cards.length )
		{
			card.hidden = false;
			if( am_I_the_story_teller() || game_state.state=="voting" )
				card.src="\\images\\cards\\Dixit - Odyssey\\"+cards[i]+".jpg";
			else
				card.src="\\images\\cards\\Dixit - Odyssey\\DO cover.jpg";
		}
		else
		{
			card.hidden = true;
		}
	}			
	document.getElementById('cards_played').hidden = false;
	
	// show or hide the story
	var s = document.getElementById('story');
	if(game_state.state != "wait_for_story" )
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
	call_server("/tick?username=" + username);
}

function card_in_hand_clicked(source)
{
	card_ind = parseInt(source.id.substring(12,13))-1;
	if( game_state.state == "wait_for_story" && am_I_the_story_teller() )
	{
		var story = prompt("Please enter the story:", "Write a story!");
		if (story==null || story=="") 
			return;
		call_server("/set_story?story=" + story);
		call_server("/place_card?username=" + username + "&card_ind=" + card_ind);
		return;
	}
		
	if( game_state.state == "wait_for_response_cards" &&  !am_I_the_story_teller())
	{
		call_server("/place_card?username=" + username + "&card_ind=" + card_ind);
	}	
}

function card_played_clicked(source)
{
	if( game_state.state != "voting" && am_I_the_story_teller() )
		return;	
	card_ind = parseInt(source.id.substring(12,13))-1;
	call_server("/vote?username=" + username + "&card_ind=" + card_ind);
}