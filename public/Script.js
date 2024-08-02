
 
$(document).ready(function () {
 
    $('#search').click(() => {
  
        $.ajax({url: "index.html", success: function(result){
            alert("Searching for nearby charging station")
       
       }});
    })
 
    $('#login').click(() => {
  
        $.ajax({url: "index.html", success: function(result){
            alert("you have logged in sucessfully")
       
       }});
    })
    
    
});
 
 