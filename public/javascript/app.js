var shows = [];

function getShows(){
  var req = new XMLHttpRequest();
  req.open("GET","https://newdatabas.firebaseio.com/.json");

  req.onload = function(){
    if(200 <= this.status < 400){
      var res = JSON.parse(this.response);
      var elemString = "";
      console.log(res);
      shows.length = 0; //Empties out the array
      for(var prop in res){
        res[prop]._id = prop; //_id is arbitrary
        shows.push(res[prop]);
        elemString += '<li>' + res[prop].Title + ': ' + res[prop].years + ' | '
        + res[prop].rating + '<button class="btn btn-warning" onclick="startEdit('+(shows.length-1)+')">Edit</button></li>'
      }
      document.getElementById('tvShows').innerHTML = elemString;
    }
    else{
      console.error(this.response);
    }
  }
  req.send();
}
getShows();

function startEdit(index){
  $('#editTitle').val(shows[index].Title);
  $('#editYears').val(shows[index].years);
  $('#editRating').val(shows[index].rating);
  $('#editSubmitButton').html('<button onclick="saveEdit('+index+')" class="btn btn-primary">Save Changes</button>');
  $('#myModal').modal('toggle');
}
function saveEdit(index){
  var Title =   $('#editTitle').val();
  var years =   $('#editYears').val();
  var rating =   $('#editRating').val();

  var show = new tvShow(Title, years, rating);

  $.ajax({
    url:'https://newdatabas.firebaseio.com/' + shows[index]._id + '/.json',
            type: 'PUT',
            data: JSON.stringify(show)
      }).success(function(res){
        //res = this.response
        getShows();
      });

  $('#myModal').modal('toggle');
}
function tvShow(Title, rating, years){
  this.Title = Title;
  this.rating = rating;
  this.years = years;
}

function saveTvShow(){
  var Title = document.getElementById('tvTitle').value;
  var years = document.getElementById('tvYears').value;
  var rating = document.getElementById('tvRating').value;

  var show = new tvShow(Title, rating, years);

  var req =  new XMLHttpRequest();
  req.open('POST','https://newdatabas.firebaseio.com/.json');
  req.onload = function(){
    getShows();
  }
  req.send(JSON.stringify(show));

  document.getElementById('tvTitle').value = "";
  document.getElementById('tvYears').value = "";
  document.getElementById('tvRating').value = "";
}

function startDelete(){
  var elemString = "";
  for(var i = 0; i < shows.length; i++){
    elemString += '<li><input id="' + shows[i]._id + '" type="checkbox" value="false" class="form-control" />' + shows[i].Title + ': ' + shows[i].years + ' | '
    + shows[i].rating +'</li>'
  }
  $('#tvShows').html(elemString);
  $('#buttonsGoHere').html('<button class="btn btn-success" onclick="saveDelete()">Save</button><button class="btn btn-danger" onclick="cancel()">Cancel</button>');
}

function cancel(){
  $('#buttonsGoHere').html('');
  getShows();
}

var delCount,
    boxes;

function saveDelete(){
  delCount = 0; //for resetting delete count after each use
  boxes = $(':checkbox:checked');
  boxesLength = boxes.length;
  console.log(boxes);
  if(boxes.length > 0){
    deleteShow(boxes[0].id);
  }
}

function deleteShow(id){
  console.log(id);
    $.ajax({url:'https://newdatabas.firebaseio.com/' + id + '/.json',
            type: 'DELETE'
      }).success(function(){
      delCount += 1;
      if(delCount < boxes.length){
        deleteShow(boxes[delCount].id)
      }
      else{
        getShows();
      }
    });
}
