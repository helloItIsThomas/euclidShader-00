import { sv } from "./variables";
import { gsap } from "gsap";

// Initialize constants and DOM elements
const loadIconSize = 100;
const loadStroke = 10;
const radius = loadIconSize / 2 - loadStroke * 2;
const centerX = radius + loadStroke * 2;
const centerY = radius + loadStroke * 2;
const showTimeline = gsap.timeline({ paused: true });
const hideTimeline = gsap.timeline({ paused: true });

export function hideLoadIcon() {
  // gsap.to("#pixiApp", { opacity: 1, duration: 0.1 });
  document.getElementById("bodyRight").style.opacity = 1;
  hideTimeline.restart();
  cancelAnimationFrame(sv.animationFrameId);
}

export function startLoadIconAnimation() {
  if (!sv.animationFrameId) sv.animationFrameId = 0;
  // Calculate progress oscillating between 0 and 1
  const progress = (Math.sin(sv.animationFrameId * 0.025) + 1) / 2;

  // Calculate arc percentage and start angle
  const arcPercentage = 0.8 * progress + 0.1; // Ranges between 0.1 and 0.9
  const startAngle = sv.animationFrameId * 0.025 * 20; // Rotate the arc

  // Function to convert angle to point coordinates
  const angleToPoint = (angle) => {
    const radians = (angle * Math.PI) / 180;
    return {
      x: centerX + radius * Math.cos(radians),
      y: centerY + radius * Math.sin(radians),
    };
  };

  // Calculate start and end points of the arc
  const start = angleToPoint(startAngle);
  const end = angleToPoint(startAngle + 360 * arcPercentage);
  const largeArcFlag = arcPercentage > 0.5 ? 1 : 0;

  // Define the arc path using SVG path data
  const pathData = `
    M ${start.x} ${start.y}
    A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}
  `;

  // Update the 'd' attribute of the path to redraw the arc
  sv.animatedArc.setAttribute("d", pathData);

  // Rotate the entire arc container
  sv.arcCont.style.transform = `translate(-50%, -50%) rotate(${
    sv.animationFrameId * 0.025 * 10
  }deg)`;
}
