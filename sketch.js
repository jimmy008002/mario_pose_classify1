////////////
let video;
let poseNet;
let pose;
let skeleton;

let brain;
let poseLabel = "N";
///////////
var jatekos;
var talaj_fal;
var grafika;
var money
var gomba;
var loves;
var pont_animacio;
var kilott_ellen_anim;
var mozgasv;

function setup() {
  createCanvas(705+640, 607.5);
  jatekos = new Jatekos();
  talaj_fal = new Talaj_fal();
  grafika = new Grafika();
  penz = new Penz();
  gomba = new Gomba();
  virag = new Virag();
  ellenseg_gomba = new Ellenseg_gomba();
  ellenseg_kacsa = new Ellenseg_kacsa();
  loves = new Loves();
  pont_animacio = new Pont_animacio();
  kilott_ellen_anim = new Kilott_ellen_anim();
  palya_vege = new Palya_vege();
  mozgasv = new Mozgasv();
  //
 video = createCapture(VIDEO);
 
video.position(705,0)
    video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);
  //
   let options = {
    inputs: 34,
    outputs: 4,
    task: 'classification',
    debug: true
  }
  brain = ml5.neuralNetwork(options);
  const modelInfo = {
    model: '1500/model.json',
    metadata: '1500/model_meta.json',
    weights: '1500/model.weights.bin',
  };
  brain.load(modelInfo, brainLoaded);
  ///////
  loves.i = "j";
  textFont('monospace')
  angleMode(DEGREES);
  rectMode(CENTER);
  imageMode(CENTER);

  mozgasv.funkcio();

  for (let j = 0; j <= 2700 - 1; j++) {

    // palya_vege.rx -= jatekos.sebesseg_v2;
    //  palya_vege.zx -= jatekos.sebesseg_v2;
    //  palya_vege.vx -= jatekos.sebesseg_v2;

    for (let i = 0; i <= talaj_fal.x.length - 1; i++) {
      if (i >= 0 && i <= 230 || i >= 1000 && i <= 1012 || i >= 1050 && i <= 1081 || i >= 1100 && i <= 1198 || i >= 1300 && i <= 1302 || i >= 1350 && i <= 1350 || i >= 1400 && i <= 1401) {
        //   talaj_fal.x[i] -= jatekos.sebesseg_v2;
      }
    }
  }

}


function brainLoaded() {
  console.log('pose classification ready!');
  classifyPose();
}

function classifyPose() {
  if (pose) {
    let inputs = [];
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      inputs.push(x);
      inputs.push(y);
    }
    brain.classify(inputs, gotResult);
  } else {
    setTimeout(classifyPose, 100);
  }
}

function gotResult(error, results) {
  
  if (results[0].confidence > 0.75) {
    poseLabel = results[0].label.toUpperCase();
    
   control();
  }
  //console.log(results[0].confidence);
  classifyPose();
}


function gotPoses(poses) {
  //console.log(poses); 
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }
}


function modelLoaded() {
  console.log('poseNet ready');
}


function draw() {
  background(92, 136, 252);
  grafika.kfmegjelenites();
  palya_vege.megjelenites();

  if (jatekos.gomba_ == 0) {
    gomba.megjelenites();
  }

  if (jatekos.gomba_ > 0 || virag.lathato == true) {
    virag.megjelenites();
  }

  if (virag.felvett_virag == true) {
    loves.megjelenites();
  }

  if (jatekos.halal == false && palya_vege.vx - jatekos.x > 5) {
    jatekos.megjelenites();
  }

  talaj_fal.megjelenites();
  penz.megjelenites();
  ellenseg_gomba.megjelenites();
  ellenseg_kacsa.megjelenites();
  pont_animacio.megjelenites();
  kilott_ellen_anim.megjelenites();
  jatekos.meghal();

  mozgasv.funkcio();
  
   push();
  translate(video.width, 0);
  scale(-1, 1);
 
  image(video, -370, 250, video.width, video.height);

  if (pose) {
    for (let i = 0; i < skeleton.length; i++) {
      let a = skeleton[i][0];
      let b = skeleton[i][1];
      strokeWeight(2);
      stroke(0);

      line(a.position.x-690, a.position.y+10, b.position.x-690, b.position.y+10);
    }
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      fill(0);
      stroke(255);
      ellipse(x-690, y+10, 16, 16);
    }
  }
 
  pop();

  fill(255, 0, 255);
  noStroke();
  textSize(256);
  textAlign(CENTER, CENTER);
  text(poseLabel, width / 4, height / 2);
 
  
    
}


function control() {
	jump_angle = false
	if (palya_vege.mt == false) {
		if (poseLabel == "L") { //go left 
			jatekos.jobbra = false;
			jatekos.balra = true;
			loves.i = "b";
		}


		if (poseLabel == "R") { //go right 

			jatekos.balra = false;
			jatekos.jobbra = true;
			loves.i = "j";
		}
		if (poseLabel == "N") { //do nth 

			jatekos.balra = false;
			jatekos.jobbra = false;
			jatekos.guggolas = false;
			loves.e = false;
			jatekos.fut = false;
		}

		if (poseLabel == "F") { //fire ball
jatekos.balra = false;jatekos.jobbra = false;
			loves.e = true;
		}
left_wrist = pose.keypoints[9];
			left_elbow = pose.keypoints[7];
			left_shoulder = pose.keypoints[5];

			right_wrist = pose.keypoints[10];
			right_elbow = pose.keypoints[8];
			right_shoulder = pose.keypoints[6];

			if (left_shoulder.score > 0.3 && left_elbow.score > 0.3 && left_wrist.score > 0.3 && right_shoulder.score > 0.3 && right_elbow.score > 0.3 && right_wrist.score > 0.3) {
				left_angle = calcAngleDegrees(left_shoulder, left_elbow, left_wrist)
				right_angle = calcAngleDegrees(right_shoulder, right_elbow, right_wrist)
				if (right_angle<0)
					right_angle = right_angle * -1;
              if (left_angle<0)
					left_angle = left_angle * -1;
				if (right_angle > 70 && right_angle < 125 && left_angle > 70 && left_angle < 125) {
					jump_angle = true
				}

            }

		if (poseLabel == "J" &&jump_angle == true ) {
         
			
			
					jatekos.ugras = true;

		

        }
		
	}
}


function calcAngleDegrees(a, b,c) {
    angle=0;
    rad=0;
    rad=Math.atan2(c.position.y-b.position.y, c.position.x-b.position.x) -Math.atan2(a.position.y-b.position.y, a.position.x-b.position.x) 
  
  
    angle= rad* (180 / Math.PI);
  
   if (angle >180.0)
   angle = 360-angle
    return angle;
  }


function keyPressed() {
//console.log(poseLabel)
  if (palya_vege.mt == false) {
    if ((key == "a" || key == "A" || keyCode == "37") && jatekos.guggolas == false) {
      jatekos.balra = true;
      loves.i = "b";
    }
    
    if ((key == "d" || key == "D" || keyCode == "39") && jatekos.guggolas == false) {
      jatekos.jobbra = true;
      loves.i = "j";
    }

    
    if (key == "s" || key == "S" || keyCode == "40") {
      jatekos.guggolas = true;
    }

    if (key == "w" || key == "W" || keyCode == "38") {
      if (jatekos.zuhanas == false) {
        jatekos.ugras = true;
      }
    }

    if (key == "f" || key == "F") {
      loves.e = true;
    }

    if (key == "Shift") {
      jatekos.fut = true;
    }

  }
}

function keyReleased() {

  if (key == "a" || key == "A" || keyCode == "37"||poseLabel=="L") {
    jatekos.balra = false;
  }

  if (key == "d" || key == "D" || keyCode == "39") {
    jatekos.jobbra = false;
  }

  if (key == "s" || key == "S" || keyCode == "40") {
    jatekos.guggolas = false;
  }

  if (key == "f" || key == "F") {
    loves.e = false;
  }
  if (key == "Shift") {
    jatekos.fut = false;
  }

  key = "";

}

function mousePressed() {
  jatekos.x = mouseX;
  jatekos.y = mouseY;
  print(mouseX);
  print(mouseY);
}