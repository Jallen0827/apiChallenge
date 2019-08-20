function randomNormal(o){    
    // console.log(o);    
    let r,a,n,e;
    // console.log(o.mean, o.dev);
    let l=o.mean;
    let t=o.dev;
    
        do{
            n=2*Math.random()-1 //pseudo-random number in the range 0–1 
            
            a=2*Math.random()-1;
            
            r= a*a+n*n; //creating random r values
            
        }
        while(r>=1); //do while loops will run once before checking condition. 
    
    e=a*Math.sqrt(-2*Math.log(r)/r);
    
    return t*e+l
        
}

const NUM_PARTICLES = 600;
const PARTICLE_SIZE = .5; // View heights
const SPEED = 20000; // Milliseconds

let particles = [];

function rand(low, high) {
  return Math.random() * (high - low);
}

function createParticle(canvas) {
  const colour = {
    r: 255,
    g: randomNormal({ mean: 125, dev: 20 }),
    b: 50,
    a: rand(0, 1),
  };
  return {
    x: -2,
    y: -2,
    diameter: Math.max(0, randomNormal({ mean: PARTICLE_SIZE, dev: PARTICLE_SIZE / 2 })),
    duration: randomNormal({ mean: SPEED, dev: SPEED * 0.1 }),
    amplitude: randomNormal({ mean: 16, dev: 2 }),
    offsetY: randomNormal({ mean: 0, dev: 10 }),
    arc: Math.PI * 2,
    startTime: performance.now() - rand(0, SPEED), //returns a DOMHighResTimeStamp, measured in milliseconds.
    colour: `rgba(${colour.r}, ${colour.g}, ${colour.b}, ${colour.a})`,
  }
}

function moveParticle(particle, canvas, time) {
  const progress = ((time - particle.startTime) % particle.duration) / particle.duration;
  return {
    ...particle,
    x: progress,
    y: ((Math.sin(progress * particle.arc) * particle.amplitude) + particle.offsetY),
  };
}

function drawParticle(particle, canvas, ctx) {
  canvas = document.getElementById('particle-canvas');
  const vh = canvas.height / 100;

  ctx.fillStyle = particle.colour;
  ctx.beginPath();
  ctx.ellipse(
    particle.x * canvas.width,
    particle.y * vh + (canvas.height / 2),
    particle.diameter * vh,
    particle.diameter * vh,
    0,
    0,
    2 * Math.PI
  );
  ctx.fill();
  
}

function draw(time, canvas, ctx) {
  // Move particles
  particles.forEach((particle, index) => {
    particles[index] = moveParticle(particle, canvas, time);
  })

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the particles
  particles.forEach((particle) => {
    drawParticle(particle, canvas, ctx);
  })

  // Schedule next frame
  requestAnimationFrame((time) => draw(time, canvas, ctx)); //tells browser that you wish to perform an animation and requests that the browser call a specified function to update an animation before the next repaint
                        //time is DOMHighResTimeStamp 
}

function initializeCanvas() {
  let canvas = document.getElementById('particle-canvas');
  canvas.width = canvas.offsetWidth * window.devicePixelRatio; //window.devicePixelRatio returns screen pixel sizes
  canvas.height = canvas.offsetHeight * window.devicePixelRatio; //offsetWidth/height is element size+Border
  let ctx = canvas.getContext("2d");
  

//   window.addEventListener('resize', () => {  //Don't think you need this because would only run if function was called 
//     canvas.width = canvas.offsetWidth * window.devicePixelRatio;
//     canvas.height = canvas.offsetHeight * window.devicePixelRatio;
//     ctx = canvas.getContext("2d");
//   })

  return [canvas, ctx];
}

function startAnimation() {
  const [canvas, ctx] = initializeCanvas();

  // Create a bunch of particles
  for (let i = 0; i < NUM_PARTICLES; i++) {
    particles.push(createParticle(canvas)); //creates an array of objects with particle info
  }
  
  requestAnimationFrame((time) => draw(time, canvas, ctx));
};

// Start animation when document is loaded
(function () {
  if (document.readystate !== 'loading') {
    startAnimation();
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      startAnimation();
    })
  }
}());



