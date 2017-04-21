////////////////////////////////////////////////////////////////////////
//            JS-CODE FOR GP-SMOOTHNESS-VARIANCE TRADE_OFF            //
//                       AUTHOR: ERIC SCHULZ                          //
////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////
//VARIABLE CREATION
/////////////////////////////////////////////////////////
//how many trials:
var trialnumb = 80
//Initialize arrays
var mylength = new Array(trialnumb)
var order1 = new Array(trialnumb)

var Certainty = new Array(trialnumb)
//Intialize index
var index = 0

for(var j=0; j<80; j++) {
order1[j]=j};

var order=shuffle(order1);
//Initialize first round:
var predictions=[1,0.7894,1,0.9998,0,0,0,0,0,0,0,0.0001,1,1,1,1,0,0.9999,1,0.8764,1,9.8216e-09,0.3652,
0.1937,1,0.9807,0.5488,0.1913,1,0.6075,0.9837,1,1,0.7154,1.0052e-10,0.03,0,0.4252,1,1,
0.9944,0.4654,0.0732,0.0005,0.0011,1,4.0395e-09,0.0007,3.6323e-08,0.0368,1,1,0,0,0.4941,
1,1,1,1,1,1,0.9991,1,0.9737,0.8482,0.9958,0.9974,1,0.8827,0.5,0.5,0.9979,0,1,3.3307e-16,1
,0,1,0,0];
// sync down from server
var myDataRef = new Firebase("https://causalstudy.firebaseio.com/");
var ref = new Firebase("https://causal.firebaseio.com/");
var list=[];
ref.once('value', function(nameSnapshot) {
list=nameSnapshot.val();
return(list)
});
// val now contains the object { first: 'Fred', last: 'Flintstone' }.


////////////////////////////////////
//BASIC FUNCTIONS
/////////////////////////////////////////////////////////
//Squaring without Math.pow
function sq(x)
{
 var y=Math.pow(x,2)
 return(y)
}

//Function to randomly shuffle an array:
function shuffle(o)
{ 
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

//Sample one item: take first item of shuffled array
//order=shuffle(order);
//generates a standard normal using Box-Mueller transformation
function myNorm() 
{
    var x1, x2, rad;
     do {
        x1 = 2 * Math.random() - 1;
        x2 = 2 * Math.random() - 1;
        rad = x1 * x1 + x2 * x2;
    } while(rad >= 1 || rad == 0);
     var c = Math.sqrt(-2 * Math.log(rad) / rad);
     return (x1 * c);
};

/////////////////////////////////////////////////////////
//HTML HELPER
/////////////////////////////////////////////////////////
//changes from one page to another
function clickStart(hide, show)
{
        document.getElementById(hide).style.display="none";
        document.getElementById(show).style.display = "block";
        window.scrollTo(0,0);        
}

//sets a value at the end to hidden id
function setvalue(x,y)
{
  document.getElementById(x).value = y;
}

/////////////////////////////////////////////////////////
//VISUALS
/////////////////////////////////////////////////////////
//function to create the stage where stimuli are presented
function makeStage(w, h, object) 
{
  var stage = d3.select(object)
    .insert("center")
    .insert("svg")
    .attr("width",w)
    .attr("height",h);
        return stage;
}

//Create stage
var mystage0= makeStage(425,400, ".plot0")
var mystage1= makeStage(425,400, ".plot1")

//draws circles with given color
function drawCircle(stage, cx, cy, mycolor) 
{
  stage.insert("circle")
    .attr("cx", cx)
    .attr("cy", cy)
    .attr("r", 0.5)
    .style("fill",mycolor)
    .style("stroke",mycolor)
    .style("stroke-width","3px");
}

function drawLine(stage, x1, y1, x2, y2) 
{
  stage.insert("line")
    .attr("x1", x1)
    .attr("y1", y1)
    .attr("x2", x2)
    .attr("y2", y2)
    .style("fill","black")
    .style("stroke","black")
    .style("stroke-width","3px");
}


function drawRectangle(stage, cx, cy, w, h) 
{
  stage.insert("rect")
    .attr("x", cx)
    .attr("y", cy)
    .attr("width", w)
    .attr("height", h)
    .style("fill","black")
    .style("fill-opacity",0)
    .style("stroke","black")
    .style("stroke-width","2px");
}


//clears the points
function clearStimulus(stage) 
{
  stage.selectAll("circle").remove();
}

var scalex = d3.scale.linear()
                    .domain([0, 10])
                    .range([30, 340]);
var scaley = d3.scale.linear()
                    .domain([0, 10])
                    .range([340, 30]);

//create x axis
function make_x_axis() 
{        
    return d3.svg.axis()
        .scale(scalex)
         //.orient("bottom")
        .ticks(10)
        .tickFormat("")
}

//create y-axis
function make_y_axis() 
{        
    return d3.svg.axis()
        .scale(scaley)
        .orient("left")
        .ticks(10)
}

//Function to draw axes
function drawaxis(svg)
{
   svg.append("g")        
        .attr("class", "grid")
        .attr("transform", "translate(0," + 350 + ")")
        .call(make_x_axis()
            .tickSize(-350, 0, 0)
            
        )

      svg.append("g")         
        .attr("class", "grid")
        //.attr("transform", "translate("+16+",0)") 
        .call(make_y_axis()
            .tickSize(-350, 0, 0)
            
        )
        
}


//Draw axes
drawaxis(mystage0)
drawaxis(mystage1)


mystage0.append("text")
            .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("transform", "translate("+ (40/2) +","+(400/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
            .text("Effect");
mystage0.append("text")
            .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("transform", "translate("+ (400/2) +","+(400-(50/3))+")")  // centre below axis
            .text("Cause");

mystage1.append("text")
            .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("transform", "translate("+ (40/2) +","+(400/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
            .text("Effect");
mystage1.append("text")
            .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("transform", "translate("+ (400/2) +","+(400-(50/3))+")")  // centre below axis
            .text("Cause");
/////////////////////////////////////////////////////////
//EXPERIMENT
/////////////////////////////////////////////////////////
drawRectangle(mystage0, scalex(0)-2, scaley(10)-2, 314, 314);
drawRectangle(mystage1, scalex(0)-2, scaley(10)-2, 314, 314);
function dostart(){
var present=order[index];
 var inp1=list[present];
for(var j=0; j<inp1.length; j++) {
drawCircle(mystage0,scalex(inp1[j][0]),scaley(inp1[j][1]), "blue");
drawCircle(mystage1,scalex(inp1[j][1]),scaley(inp1[j][0]), "blue");};

clickStart('page3', 'page4');
}

var CurrentValue = 0.0;
function markinput(value)
{
 //mark
 CurrentValue=value;
 var p=-100*((predictions[index]-0.5)/0.5);
 var vput="Current value: "+value;
 //update by slider  
 $('#slidervalue').text(vput);
}

//Experiment
function dotrial()
{
  if (index <80) {
    Certainty[index]=CurrentValue;
    mylength.shift();
    clearStimulus(mystage0);
    clearStimulus(mystage1);
     var present=order[index];
     var inp1=list[present];
     for(var j=0; j<inp1.length; j++) {
drawCircle(mystage0,scalex(inp1[j][0]),scaley(inp1[j][1]), "blue");
drawCircle(mystage1,scalex(inp1[j][1]),scaley(inp1[j][0]), "blue");};
    index=index+1;
    var insert ="Number of trials left: "+(trialnumb-index)
    document.getElementById("remaining").innerHTML = insert;
  }
  else {
    clickStart('page4','page5');
  }
}

var age=0;
var gender=0;

function setgender(x){
  gender=x;
  return(gender)
}

function setage(x){
  age=x;
  return(age)
}

function senddata(){
  var age=90;
    if (document.getElementById('age1').checked) {var  age = 20}
    if (document.getElementById('age2').checked) {var  age = 30}
    if (document.getElementById('age3').checked) {var  age = 40}
    if (document.getElementById('age4').checked) {var  age = 50}

    var gender=3;
    if (document.getElementById('gender1').checked) {var  gender = 1}
    if (document.getElementById('gender2').checked) {var  gender = 2}
    myDataRef.push({order: order, Certainty: Certainty, age: age, gender: gender});
    clickStart('page6','page7');

}

$(document).ready(function() {
$('#slider').slider({
    min: -100.0,
    max: 100.0,
    step: 1,
    value: 0.0,
    slide: function(event, ui) {
        markinput(ui.value);

    }
});
});
