// Set Tanishq's email here (so Nisha can send the "YES" + her message)
const TANISHQ_EMAIL = "TANISHQ_EMAIL_HERE";

const yesBtn = document.getElementById("yes");
const noBtn = document.getElementById("no");
const result = document.getElementById("result");
const confetti = document.getElementById("confetti");
const msgBox = document.getElementById("msgBox");
const messageEl = document.getElementById("message");
const statusEl = document.getElementById("status");
const musicTip = document.getElementById("musicTip");
const ytPlayer = document.getElementById("ytPlayer");

const copyBtn = document.getElementById("copy");
const sendEmailBtn = document.getElementById("sendEmail");

// Confetti
function celebrate(){
  confetti.innerHTML = "";
  const colors = ["#ff3b7a","#ffd1dc","#ffb703","#8ecae6","#8338ec","#06d6a0"];
  for(let i=0;i<130;i++){
    const p = document.createElement("div");
    p.className = "piece";
    p.style.left = Math.random()*100 + "vw";
    p.style.background = colors[Math.floor(Math.random()*colors.length)];
    p.style.animationDuration = (2 + Math.random()*2.2) + "s";
    p.style.width = (6 + Math.random()*8) + "px";
    p.style.height = (10 + Math.random()*10) + "px";
    confetti.appendChild(p);
  }
  setTimeout(()=> confetti.innerHTML="", 5200);
}

// No button impossible: teleport away
function moveNoButton(){
  const pad = 20;
  const w = noBtn.offsetWidth || 90;
  const h = noBtn.offsetHeight || 44;
  const x = Math.random() * (window.innerWidth - (w + pad*2)) + pad;
  const y = Math.random() * (window.innerHeight - (h + pad*2)) + pad;
  noBtn.style.left = x + "px";
  noBtn.style.top = y + "px";
  noBtn.style.transform = "translate(0,0)";
}

["mouseenter","mouseover","touchstart","pointerenter"].forEach(evt=>{
  noBtn.addEventListener(evt, (e)=>{ e.preventDefault(); moveNoButton(); }, {passive:false});
});
noBtn.addEventListener("click", (e)=>{ e.preventDefault(); moveNoButton(); });
setTimeout(moveNoButton, 250);
window.addEventListener("resize", moveNoButton);

// Music: start muted; on first tap anywhere, reload unmuted
let musicStarted = false;
function startMusicWithSound(){
  if(musicStarted) return;
  musicStarted = true;
  musicTip.textContent = "Music on 🎶";
  ytPlayer.src = "https://www.youtube.com/embed/2kvtJL8Keog?autoplay=1&loop=1&playlist=2kvtJL8Keog&mute=0";
  setTimeout(()=> musicTip.style.display="none", 1200);
}
window.addEventListener("pointerdown", startMusicWithSound, {once:true});
window.addEventListener("touchstart", startMusicWithSound, {once:true});

// Build the message payload that Nisha will send to Tanishq
function buildPayload(){
  const msg = (messageEl.value || "").trim();
  const time = new Date().toLocaleString();
  const base = `Nisha clicked YES 💖\nTime: ${time}\n\nMessage for Tanishq:\n${msg || "(no message added)"}`;
  return base;
}

// Copy to clipboard
async function copyToClipboard(text){
  try{
    await navigator.clipboard.writeText(text);
    statusEl.textContent = "Copied ✅ Now paste it to Tanishq on WhatsApp/iMessage.";
  }catch{
    // fallback: select text in textarea
    messageEl.value = text;
    messageEl.focus();
    messageEl.select();
    statusEl.textContent = "Copy didn’t work automatically — long press and copy the highlighted text.";
  }
}

// Open email compose (mailto)
function openEmail(text){
  if(!TANISHQ_EMAIL || TANISHQ_EMAIL.includes("tailortanishq@gmail.com")){
    statusEl.textContent = "Set Tanishq’s email in script.js first.";
    return;
  }
  const subject = encodeURIComponent("Valentine Answer 💘 (from Nisha)");
  const body = encodeURIComponent(text);
  window.location.href = `mailto:${encodeURIComponent(TANISHQ_EMAIL)}?subject=${subject}&body=${body}`;
  statusEl.textContent = "Opening email… if it doesn’t open, use Copy message.";
}

// YES click
yesBtn.addEventListener("click", ()=>{
  celebrate();
  result.textContent = "You just made Tanishq very happy 💞";
  msgBox.style.display = "block";
  msgBox.setAttribute("aria-hidden", "false");

  // Pre-fill a cute message prompt
  if(!messageEl.value.trim()){
    messageEl.value = "Yes 🥺💖";
  }

  statusEl.textContent = "Write a message and tap “Send to Tanishq”.";
});

copyBtn.addEventListener("click", async ()=>{
  const payload = buildPayload();
  await copyToClipboard(payload);
});

sendEmailBtn.addEventListener("click", ()=>{
  const payload = buildPayload();
  openEmail(payload);
});
