const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
function showPage(id){$$('.page').forEach(p=>p.classList.toggle('active',p.id===id));window.scrollTo({top:0,behavior:'smooth'})}
$$('[data-page]').forEach(b=>b.onclick=()=>showPage(b.dataset.page));
let flat=[]; testData.sections.forEach((s,si)=>s.questions.forEach((q,qi)=>flat.push({s:si,q:qi,data:q,num:flat.length+1})));
function render(){let n=0;$('#questions').innerHTML=testData.sections.map((s,si)=>`<div class="section"><h3>${s.title}</h3>${s.questions.map((q,qi)=>{n++;let input=q[0]==='mcq'?q[2].map(x=>`<label><input type="radio" name="q${n}" value="${x}"> ${x}</label>`).join(''): `<input class="answer" id="q${n}" autocomplete="off" placeholder="Your answer">`;return `<div class="question"><div class="qnum">${n}</div><div class="qbody"><p>${q[1]}</p>${input}</div></div>`}).join('')}</div>`).join('')}
render();
function norm(v){return String(v||'').trim().toLowerCase().replace(/[.,!?]/g,'').replace(/\s+/g,' ')}
function getAnswer(i){let q=flat[i],n=i+1;if(q.data[0]==='mcq') return ($(`input[name=q${n}]:checked`)||{}).value||'';return $(`#q${n}`).value}
function grade(){let score=0;flat.forEach((x,i)=>{if(norm(getAnswer(i))===norm(x.data[x.data[0]==='mcq'?3:2]))score++});let pct=Math.round(score/40*100);let band=pct>=90?'8.5–9':pct>=80?'7.5–8':pct>=70?'6.5–7':pct>=60?'5.5–6':pct>=50?'5':pct>=40?'4.5':'Below 4.5';let hist=JSON.parse(localStorage.ieltsHistory||'[]');hist.unshift({date:new Date().toLocaleString(),score,pct,band});localStorage.ieltsHistory=JSON.stringify(hist.slice(0,10));$('#results').innerHTML=`<div class="result"><div><span class="eyebrow">YOUR RESULT</span><h2>${score}/40</h2><p>${pct}% correct • prototype band estimate ${band}</p></div><button class="secondary" onclick="showReview()">Review answers</button></div><div id="review"></div>`;$('#submitStatus').textContent='Test submitted.';document.querySelectorAll('#questions input').forEach(x=>x.disabled=true);renderHistory()}
function showReview(){let rows=flat.map((x,i)=>{let given=getAnswer(i),correct=x.data[x.data[0]==='mcq'?3:2];return `<div class="reviewrow"><b>${i+1}</b><span>Your answer: ${given||'—'}</span><span>Correct: ${correct}</span></div>`}).join('');$('#review').innerHTML=`<div class="panel"><h3>Answer review</h3>${rows}</div>`}
$('#submitTest').onclick=grade;$('#resetTest').onclick=()=>{location.reload()};
let timer=1800,timerStarted=false,timerId;function tick(){let m=Math.floor(timer/60),s=timer%60;$('#timer').textContent=`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;if(timer<=0){clearInterval(timerId);grade()}else timer--}tick();timerId=setInterval(tick,1000);
let utterances=[];$('#playScript').onclick=()=>{speechSynthesis.cancel();utterances=[new SpeechSynthesisUtterance(script)];utterances[0].lang='en-GB';utterances[0].rate=.9;speechSynthesis.speak(utterances[0])};$('#pauseScript').onclick=()=>speechSynthesis.pause();
function renderHistory(){let h=JSON.parse(localStorage.ieltsHistory||'[]');let old=$('#history');if(old)old.remove();let p=document.createElement('div');p.id='history';p.className='panel';p.innerHTML=`<h3>Recent scores</h3>${h.length?h.map(x=>`<div class="historyrow"><span>${x.date}</span><b>${x.score}/40</b><span>${x.band}</span></div>`).join(''):'No scores yet.'}`;$('#results').appendChild(p)}
renderHistory();


document.addEventListener("DOMContentLoaded", () => {
  const audio = document.querySelector("audio");
  const status = document.getElementById("audioStatus");
  if (!audio || !status) return;
  const show = (msg) => { status.textContent = msg; };
  audio.addEventListener("loadedmetadata", () => {
    show("Audio ready. Press Play to begin.");
  });
  audio.addEventListener("canplay", () => {
    show("Audio ready.");
  });
  audio.addEventListener("error", () => {
    show("Audio could not be loaded. Make sure you extracted the entire ZIP and kept the assets folder beside index.html.");
  });
  audio.addEventListener("stalled", () => {
    show("Audio is taking too long to load. Check that the MP3 file is present in the assets folder.");
  });
  if (audio.readyState >= 1) show("Audio ready.");
});

(function(){
function initAudio(){
var a=document.getElementById("myTestAudio"),b=document.getElementById("playAudioBtn"),s=document.getElementById("audioStatus");
if(!a||!b)return;
function m(x){if(s)s.textContent=x}
a.addEventListener("loadedmetadata",function(){m("Audio loaded successfully. Press Play.")});
a.addEventListener("canplay",function(){m("Audio ready.")});
a.addEventListener("error",function(){m("Audio failed to load. Keep the assets folder beside index.html.")});
a.addEventListener("play",function(){b.textContent="⏸ Pause Test 1 Audio";m("Playing audio…")});
a.addEventListener("pause",function(){if(!a.ended){b.textContent="▶ Play Test 1 Audio";m("Audio paused.")}});
a.addEventListener("ended",function(){b.textContent="▶ Play Test 1 Audio";m("Audio finished.")});
b.addEventListener("click",function(){if(a.paused){var p=a.play();if(p&&p.catch)p.catch(function(){m("Playback was blocked. Use the ▶ control above.")})}else a.pause()});
a.load();
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",initAudio);else initAudio();
})();
