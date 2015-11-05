var FRAME_RATE = 30;
var grav = new PVector(0, 9.81 / FRAME_RATE);
var GlobeFric = new PVector(0.8, 0.8);

var FlakeAirFric = 0.07;
var GlobeAirFric = 0.02;

var GlobeColor = color(115, 175, 230);
var GlobeEdgeColor = lerpColor(GlobeColor, color(69, 47, 47), 0.5);
var FlakeColor = color(13, 227, 202, 200);

var hopper = getImage("cute/GemBlue");

translate(width / 2, height / 2);
frameRate(FRAME_RATE);
textAlign(CENTER, CENTER);
imageMode(CENTER);

var Snowflake = function(x, y, radius, globe) {
    this.globe = globe; //Assign globe property to this instance of a snowflake
    this.pos = new PVector(x, y); //Instantiate a PVector for the position
    this.vel = new PVector(0, 0); //Instantiate a PVector for the velocity
    this.r = radius; //Assign radius (r) to this instance of a snowflake
    this.ang = 0;

    this.fric = FlakeAirFric + random(0.1, 0.05);

    this.theta = random(-360, 360); //for swaying
    this.magn = random(0.4); //for swaying
    this.spin = random() > 0.5 ? -1 : 1; //for swaying

    this.type = ['\u2744', '\u2745', '\u2746'][floor(random(2.999))];
};

Snowflake.prototype.update = function() {
    this.pos.add(this.vel); //move
    this.vel.add(grav); //apply gravity
    this.vel.mult(1 - this.fric); //apply air friction

    this.ang = frameCount * this.spin + this.theta; //rotate the snowflake
    this.vel.x += cos(this.ang) * this.magn; //whirl the snowflake x
    this.vel.y += sin(this.ang) * this.magn; //whirl the snowflake y

    //if the snowflake is outside of the globe
    if (dist(this.pos.x, this.pos.y, this.globe.pos.x, this.globe.pos.y) > this.globe.r - this.r) {
        this.pos.sub(this.globe.pos);
        this.pos.normalize(1); //constrain it to the globe
        this.pos.mult(this.globe.r - this.r);
        this.pos.add(this.globe.pos);
        this.vel.mult(GlobeFric); //apply friction from the edge of the globe
    }
};

Snowflake.prototype.draw = function() {
    pushMatrix();
    translate(this.pos.x, this.pos.y); //translate by the position
    rotate(this.ang); //rotate by the angle
    fill(0, 187, 224); //snowflake color
    text(this.type, 0, 0); //draw the snowflake
    popMatrix();
};

var Snowglobe = function(x, y, radius) {
    this.pos = new PVector(x, y); //Instantiate a PVector for the position
    this.vel = new PVector(0, 0); //Instantiate a PVector for the velocity
    this.r = radius; //Assign radius (r) property to this instance of a snowglobe

    this.flakes = []; //Assign array to hold snowflake objects
    this.flakeRad = floor(width / 40) + 2; //Assign snowflake radius
    this.initLim = radius / sqrt(2); //set the snowflake initialization boundaries (rectangular)
};

Snowglobe.prototype.addFlakes = function(numFlakes) {
    for (var f = 0; f < numFlakes; f++) { //repeat for each flake wanted
        this.flakes.push(new Snowflake(random(-this.initLim, this.initLim) + this.pos.x, //x
            random(-this.initLim, this.initLim) + this.pos.y, //y
            this.flakeRad, //radius
            this)); //globe
    }
};

Snowglobe.prototype.draw = function() {
    //draw self
    fill(180, 140, 0);
    stroke(115, 95, 30);
    rect(this.pos.x - this.r / 2, this.pos.y + this.r * 0.8, this.r, this.r / 2);
    noStroke(); //no outlines
    fill(147, 171, 250); //snowglobe color
    ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2); //draw circle (diameter = 2 x radius)

    fill(255);
    ellipse(this.pos.x, this.pos.y + this.r * 0.75, this.r * 1.3, this.r * 0.4); //ground
    image(hopper, this.pos.x, this.pos.y, this.r, this.r); //hopper

    //draw flakes
    textSize(this.flakeRad * 3);
    for (var i in this.flakes) { //loop through the flakes
        this.flakes[i].draw(); //draw a single flake
    }

    //draw edge
    noFill();
    strokeWeight(this.r / 0);
    stroke(GlobeEdgeColor);
    ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2); //draw circle (diameter = 2 x radius)
};

Snowglobe.prototype.update = function() {
    //update the snowflakes
    for (var i in this.flakes) {
        this.flakes[i].update();
    }
};

var myGlobe = new Snowglobe(0, 0, width / 4);
myGlobe.addFlakes(20 + width / 40);

var draw = function() {
    background(128);
    myGlobe.update();
    myGlobe.draw();
    fill(242, 217, 217);
    if (mouseIsPressed) {
        myGlobe.pos.x += (mouseX - pmouseX);
        myGlobe.pos.y += (mouseY - pmouseY);
    }
    fill(64);
    text('what do you think?????', 0, -height * 0.45);
};