var recordData = new Array();
var starttime;
var rflag = false;
var iflag = false;

var score_list = {
  "s1": 10,
  "s2": 5,
  "s3": 1,
  "f" : -5
}

function select_color(num)
{
  if (num == 0){
    color = "red";
  }
  else if(num == 1){
    color = "blue";
  }
  else if (num == 2){
    color = "yellow";
  }
  else{
    color = "black";
  }
  return color;
}

function change_score(num){
  let entity = document.querySelector("#score");
  let score = entity.getAttribute("bmfont-text").text.substring(7);
  score = parseInt(score) + num;
  entity.setAttribute("bmfont-text","text:score: "+score.toString()+"; color: black");
}

function fall_box(num){
  var sel = $("a-scene");
  let temp = (num-1)*2;
  let color = select_color(num);


  let boxEl = document.createElement('a-circle');
  boxEl.setAttribute("class","box-"+num.toString());
  boxEl.setAttribute("color",color);
  boxEl.setAttribute("radius",0.5);
  boxEl.setAttribute("position",temp.toString()+' 6 -5');
  let aEl = document.createElement("a-animation");
  aEl.setAttribute("attribute","position");
  aEl.setAttribute("to",temp.toString()+' -1 -5');
  aEl.setAttribute("direction","alternate");
  aEl.setAttribute("easing","linear");
  aEl.setAttribute("dur","3000");
  boxEl.appendChild(aEl);
  boxEl.addEventListener("animationstart",function(){
    // let data = this.getAttribute("position");
    // console.log(data);
  })
  boxEl.addEventListener("animationend",function(){
    // todo:miss
    this.parentNode.removeChild(this);
    if(rflag == false && iflag == true){
      change_score(score_list['f']);  
    }
  })

  sel.append(boxEl);

}

function click_box(num){
  let allBox = $(".box-"+num.toString());
  let nearest = 10;
  let nearone = -1;
  for (var i = 0; i < allBox.length ; i++) {
    console.log(allBox[i].getAttribute("position"));
    let data = allBox[i].getAttribute("position");
    if (nearest > data.y && data.y > -0.5)
    {
      nearest = data.y;
      nearone = i;
    }
  }
  // console.log(nearest);
  if (nearest < 0.25 && nearest > -0.25){
    change_score(score_list['s1']);
  }
  else if (nearest < 0.5 && nearest > -0.5){
    change_score(score_list['s2']);
  }
  else if (nearest < 0.75 && nearest > -0.75){
    change_score(score_list['s3']);
  }
  else{
    change_score(score_list['f']);
  }
  let entity = allBox[nearone];
  entity.parentNode.removeChild(entity);
}

function startplay(Data){
    setTimeout(function(){
      fall_box(Data[0][1])
    },Data[0][0]);
  for (let i=1 ; i< Data.length; i++) {
    console.log(i);
    setTimeout(function(){
      fall_box(Data[i][1]);
    },Data[i][0]);
  }
};

soundEL = document.querySelector('[sound]');
soundEL.addEventListener("sound-ended",function(){
  iflag == false;
  rflag == false;
})


$(document).keydown(function(event){

  console.log(event.keyCode);
  var sel = $("a-scene");

  if (event.keyCode== 80) {
      let entity = document.querySelector('[sound]');
      entity.components.sound.playSound();
      let d = new Date();
      starttime = d.getTime();
      rflag = true;
      recordData = [];
  }
  // O (stop record)
  if (event.keyCode== 79) {
      let entity = document.querySelector('[sound]');
      entity.components.sound.stopSound();
      // todo: 结束record
      rflag = false;
      console.log(recordData);
  }  
  // i (play)
  if (event.keyCode== 73) {
    iflag = true;
    if (recordData.length!=0) {
      startplay(recordData);
      setTimeout(function(){
        let entity = document.querySelector('[sound]');
        entity.components.sound.playSound();  
      },2000);
    }
  }
  if (rflag == false && iflag == true){
    // hjkl 72 74 75 76
    if (event.keyCode== 72) {
      click_box(0);
    }
    if (event.keyCode== 74) {
      click_box(1);
    }
    if (event.keyCode== 75) {
      click_box(2);
    }
    if (event.keyCode== 76) {
      click_box(3);
    }
  }

  if (rflag) {
    // z
    if (event.keyCode==90) {
        fall_box(0);
        recordData.push([(new Date()).getTime()-starttime, 0]);
    }
    // x
    if (event.keyCode==88) {
        fall_box(1);
        recordData.push([(new Date()).getTime()-starttime, 1]);
    }
    // 67 c
    if (event.keyCode==67) {
        fall_box(2);
        recordData.push([(new Date()).getTime()-starttime, 2]);
    }
    // 86 v
    if (event.keyCode==86) {
        fall_box(3);
        recordData.push([(new Date()).getTime()-starttime, 3]);
    }
  }

});
