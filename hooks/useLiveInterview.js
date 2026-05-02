"use client";

import { useEffect, useRef, useState } from "react";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function useLiveInterview() {

  const [jobData, setJobData] = useState(null);
  const [dbQuestions, setDbQuestions] = useState([]);

  const hasStartedRef = useRef(false);
  const searchParams = useSearchParams();

  const title = searchParams.get("title");
  const candidateName = searchParams.get("name");
  const isInterviewStoppedRef = useRef(false);

  const [messages, setMessages] = useState([]);
  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [setupPopup, setSetupPopup] = useState(true);
  const [interviewEnded, setInterviewEnded] = useState(false);
  const [alertText, setAlertText] = useState("");

  const noFaceCounter = useRef(0);
  const multiFaceCounter = useRef(0);
  const lookAwayCounter = useRef(0);
  const headAwayCount = useRef(0);
  const gazeAwayCount = useRef(0);
  const isHeadAway = useRef(false);
  const isGazeAway = useRef(false);
  const strikes = useRef(0);
  const hasTriggeredStrike = useRef(false);
  const landmarkerRef = useRef(null);
  const lastVideoTimeRef = useRef(-1);

  const streamRef = useRef(null);
  const recorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const videoRef = useRef(null);
  const videoContainerRef = useRef(null);

  const voiceRef = useRef(null);
  const isEndingRef = useRef(false);

  const questionCount = useRef(0);
  const askedQuestions = useRef([]);

  const { user } = useUser();
  const jobId = searchParams.get("jobId");

  const transitionLines = [
  "Alright, let’s move on to the next question.",
  "Let’s proceed to the next question.",
  "Moving ahead, here is your next question.",
  "Now, let’s continue with the next question."
];


  useEffect(() => {
  if (!jobData) return;

  console.log("🔥 STATE READY:", {
    dbQuestions,
    jobData
  });

  startInterview();

}, [jobData]);






  /* ---------------- FETCH JOB ---------------- */
  async function fetchJobDetails() {
    try {
      console.log("🚀 FETCH JOB START:", jobId);

      const res = await fetch(`/api/jobs/${jobId}`);
      const data = await res.json();

      console.log("✅ JOB DATA:", data);
      console.log("📊 QUESTIONS FROM DB:", data.questions);

      setJobData(data);
      setDbQuestions(data.questions || []);
      questionCount.current = 0;

    } catch (err) {
      console.error("❌ Job fetch error:", err);
    }
  }

  /* ---------------- INIT ---------------- */
  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    const init = async () => {
      console.log("🟢 INIT INTERVIEW");

      await new Promise(resolve => {
        function check() {
          const voices = speechSynthesis.getVoices();
          if (voices.length) {
            voiceRef.current =
              voices.find(v => v.name.includes("David")) ||
              voices.find(v => v.lang === "en-US");
            console.log("🎤 Voice Loaded:", voiceRef.current?.name);
            resolve();
          } else setTimeout(check, 100);
        }
        check();
      });

      await initMedia();
      await initMediaPipe();
      detectFace();

      await fetchJobDetails();
      startInterview();
    };

    init();
  }, []);

  /* ---------------- SPEECH ---------------- */
  function speak(text, cb = null) {
     if (isInterviewStoppedRef.current) return;
    console.log("🗣️ AI SPEAK:", text);

    speechSynthesis.cancel();

    const utter = new SpeechSynthesisUtterance(text);
    if (voiceRef.current) utter.voice = voiceRef.current;

    utter.onend = () => {
      console.log("✅ Speech Ended");
      if (cb) return cb();
      if (!isEndingRef.current) startRecording();
    };

    speechSynthesis.speak(utter);
  }


  function getRandomTransition() {
  return transitionLines[Math.floor(Math.random() * transitionLines.length)];
}


  function addAI(text) {
    console.log("🤖 AI MESSAGE:", text);

    if (text === "INTERVIEW_COMPLETE") return finishInterview();


     const isQuestion = text.includes("?");

  const finalText = isQuestion
    ? `${getRandomTransition()} ${text}`
    : text;

    
    setMessages(prev => [...prev, { sender: "ai", text }]);

    if (text.includes("?")) {
      askedQuestions.current.push(text);
      console.log("📌 Asked Questions:", askedQuestions.current);
    }

    speak(text);
  }

  function addUser(text) {
    console.log("👤 USER ANSWER:", text);
    setMessages(prev => [...prev, { sender: "user", text }]);
  }

  /* ---------------- START ---------------- */
/* ---------------- START ---------------- */
async function startInterview() {
  if (isInterviewStoppedRef.current) return;
  console.log("🎬 START INTERVIEW");

  const greeting = generateGreeting();
  
  // 1. Instantly hide the popup as soon as the greeting is ready to be spoken
  setSetupPopup(false); 

  setMessages([{ sender: "ai", text: greeting }]);

  // 2. Start speaking the greeting
  await new Promise(res => speak(greeting, () => {
    console.log("Greeting speech finished");
    res();
  }));

  questionCount.current = 0;
  const total = jobData?.no_of_questions || 2;

  // 3. Proceed to the first question
  if (dbQuestions.length > 0) {
    addAI(dbQuestions[0]);
  } else {
    await generateAIQuestion();
  }
}

  /* ---------------- AI QUESTION ---------------- */
  async function generateAIQuestion(userText = "") {

     if (isInterviewStoppedRef.current) return;

    console.log("🧠 GENERATING AI QUESTION...");

    setMessages(prev => [...prev, { sender: "ai", text: "__THINKING__" }]);

    try {
      const res = await fetch("/api/interview/chat", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          userMessage: userText,
          history: messages,
          askedQuestions: askedQuestions.current,
          questionCount: questionCount.current,
          jobTitle: title,
          candidateName,
        })
      });

      const data = await res.json();

      console.log("🧠 AI RAW RESPONSE:", data);

      let reply = cleanAIResponse(data.message);

      setMessages(prev => prev.filter(m => m.text !== "__THINKING__"));

      console.log("✅ AI CLEAN QUESTION:", reply);

      addAI(reply);

    } catch (err) {
      console.error("❌ AI ERROR:", err);
      addAI(`Explain a concept related to ${title}?`);
    }
  }

  /* ---------------- RECORDING ---------------- */
  function startRecording() {

     if (isInterviewStoppedRef.current) return;


    console.log("🎙️ START RECORDING");

    if (!streamRef.current) return;

    audioChunksRef.current = [];

    const recorder = new MediaRecorder(streamRef.current);
    recorderRef.current = recorder;

    recorder.onstart = () => setRecording(true);

    recorder.ondataavailable = e => {
      if (e.data.size > 0) audioChunksRef.current.push(e.data);
    };

    recorder.onstop = async () => {
      console.log("⏹️ RECORDING STOPPED");

      setRecording(false);

      const blob = new Blob(audioChunksRef.current);
      console.log("📦 AUDIO SIZE:", blob.size);

      const text = await transcribe(blob);

      console.log("📝 TRANSCRIBED TEXT:", text);

      if (!text || text.length < 2) {
  const lastQ = askedQuestions.current.at(-1);

  console.log("⚠️ EMPTY RESPONSE → REPEAT");

  setProcessing(false); // 🔥 VERY IMPORTANT

  speak(`I could not hear you properly. Let me repeat the question. ${lastQ}`);

  return;
}

      addUser(text);
      await handleNextStep(text);
    };

    recorder.start();
  }

  function stopRecording() {
    
    if (recorderRef.current?.state !== "inactive") {
      console.log("🛑 STOP RECORDING");
      setProcessing(true);
      recorderRef.current.stop();
    }
  }

  /* ---------------- CORE FLOW ---------------- */
  async function handleNextStep(userText) {


     if (isInterviewStoppedRef.current) return;

    const total = jobData?.no_of_questions || 2;

    questionCount.current++;

    console.log("📊 NEXT STEP:", {
      questionCount: questionCount.current,
      total,
      dbLength: dbQuestions.length
    });

    if (questionCount.current >= total) {
      console.log("🏁 INTERVIEW END TRIGGERED");
      return finishInterview();
    }

    const isPureDB = dbQuestions.length >= total;
    const isHybrid = dbQuestions.length > 0 && dbQuestions.length < total;
    const isAIOnly = dbQuestions.length === 0;

    console.log("📊 MODE:", { isPureDB, isHybrid, isAIOnly });

    if (isPureDB) {
      console.log("👉 NEXT FROM DB");
      setProcessing(false);
      return addAI(dbQuestions[questionCount.current]);
    }

    if (isHybrid) {
      if (questionCount.current < dbQuestions.length) {
        console.log("👉 HYBRID: DB QUESTION");
        setProcessing(false);
        return addAI(dbQuestions[questionCount.current]);
      } else {
        console.log("👉 HYBRID: AI QUESTION");
        setProcessing(false);
        return await generateAIQuestion(userText);
      }
    }

    if (isAIOnly) {
      console.log("👉 AI ONLY MODE");
      setProcessing(false);
      return await generateAIQuestion(userText);
    }
  }

  /* ---------------- TRANSCRIBE ---------------- */
  async function transcribe(blob) {
    const fd = new FormData();
    fd.append("file", blob);

    const res = await fetch("/api/transcribe", { method: "POST", body: fd });
    const data = await res.json();

    return data.text || "";
  }

  /* ---------------- FINISH ---------------- */
  /* ---------------- FINISH ---------------- */
async function finishInterview() {
  if (isEndingRef.current) return;

  console.log("🏁 FINISH INTERVIEW");
  isEndingRef.current = true;
  speechSynthesis.cancel();
  
  // Recording band karo bina processing state trigger kiye
  if (recorderRef.current?.state !== "inactive") {
    recorderRef.current.stop();
  }

  const msg = `Thank you for participating. Your interview is now complete. Your responses have been recorded and will be evaluated automatically. We wish you the best of luck.`;

  setMessages(prev => [...prev, { sender: "ai", text: msg }]);

  // Race condition fix: Speak khatam hone ke BAAD report generate hogi
  speak(msg, async () => {
    console.log("📊 VOICE COMPLETE -> GENERATING REPORT...");
    // Interview ended state set karne se pehle report call karenge
    // Taaki UI popup (Processing Results) sahi time pe aaye
    setInterviewEnded(true); 
    await generateReport();
  });
}

  /* ---------------- MEDIA ---------------- */
  async function initMedia() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    streamRef.current = stream;
    if (videoRef.current) videoRef.current.srcObject = stream;
  }

  function generateGreeting() {
      return `Hello ${candidateName || "Candidate"}.

This is your technical interview for the role of ${title}.

I will ask you a series of technical questions to evaluate your knowledge.

Please answer clearly and concisely.

Let's begin with Question 1.`;
  }

  async function initMediaPipe() {
    try {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
      );
      landmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: `/face_landmarker.task`,
          delegate: "GPU"
        },
        outputFaceBlendshapes: true,
        runningMode: "VIDEO",
        numFaces: 5
      });
      console.log("✅ MediaPipe Loaded");
    } catch (e) {
      console.error("MediaPipe failed to load", e);
    }
  }

  function getGazeDirection(irisCenter, eyeCenter) {
    const dx = irisCenter.x - eyeCenter.x;
    const dy = irisCenter.y - eyeCenter.y;
    if (dx < -0.005) return "LEFT";
    if (dx > 0.005) return "RIGHT";
    if (dy < -0.005) return "UP";
    if (dy > 0.005) return "DOWN";
    return "CENTER";
  }

  function getHeadDirection(nose, leftFace, rightFace) {
    const midX = (leftFace.x + rightFace.x) / 2.0;
    const faceBase = Math.abs(leftFace.x - rightFace.x);
    if (nose.x < midX - faceBase * 0.1) return "RIGHT";
    if (nose.x > midX + faceBase * 0.1) return "LEFT";
    return "CENTER";
  }

  async function detectFace() {
    if (!videoRef.current || isInterviewStoppedRef.current) return;
    
    if (landmarkerRef.current && videoRef.current.readyState >= 2) {
      const currentTime = videoRef.current.currentTime;
      if (lastVideoTimeRef.current !== currentTime) {
        lastVideoTimeRef.current = currentTime;
        
        try {
          const results = landmarkerRef.current.detectForVideo(videoRef.current, performance.now());
          handleDetections(results);
        } catch (e) {}
      }
    }
    
    requestAnimationFrame(detectFace);
  }

  function handleDetections(results) {
    let currentAlert = "";

    if (results.faceLandmarks.length === 0) {
      noFaceCounter.current++;
      if (noFaceCounter.current > 20) currentAlert = "Face Not Detected";
    } else {
      noFaceCounter.current = 0;
    }

    if (results.faceLandmarks.length > 1) {
      multiFaceCounter.current++;
      if (multiFaceCounter.current > 5) currentAlert = "Cheating Detected - Interview Ended";
    } else {
      multiFaceCounter.current = 0;
    }

    if (results.faceLandmarks.length === 1 && !currentAlert) {
      const landmarks = results.faceLandmarks[0];
      
      const nose = landmarks[1];
      const leftFace = landmarks[234];
      const rightFace = landmarks[454];

      const leftEyeIndices = [33, 160, 158, 133, 153, 144];
      const leftIrisIndices = [468, 469, 470, 471];

      const leftEyeX = leftEyeIndices.reduce((sum, i) => sum + landmarks[i].x, 0) / 6;
      const leftEyeY = leftEyeIndices.reduce((sum, i) => sum + landmarks[i].y, 0) / 6;

      const leftIrisX = leftIrisIndices.reduce((sum, i) => sum + landmarks[i].x, 0) / 4;
      const leftIrisY = leftIrisIndices.reduce((sum, i) => sum + landmarks[i].y, 0) / 4;

      const gaze = getGazeDirection({x: leftIrisX, y: leftIrisY}, {x: leftEyeX, y: leftEyeY});
      const head = getHeadDirection(nose, leftFace, rightFace);

      if (head !== "CENTER") {
        if (!isHeadAway.current) {
          isHeadAway.current = true;
          headAwayCount.current++;
        }
      } else {
        isHeadAway.current = false;
      }

      if (gaze !== "CENTER") {
        if (!isGazeAway.current) {
          isGazeAway.current = true;
          gazeAwayCount.current++;
        }
      } else {
        isGazeAway.current = false;
      }

      if (head !== "CENTER" || gaze !== "CENTER") {
        lookAwayCounter.current++;
        if (lookAwayCounter.current > 15) {
          if (!hasTriggeredStrike.current) {
            strikes.current++;
            hasTriggeredStrike.current = true;
          }
          if (strikes.current >= 3) {
            currentAlert = "Cheating Detected - Interview Ended";
          } else {
            currentAlert = `Warning ${strikes.current}/3: Please look at the screen (Anti-Cheat)`;
          }
        }
      } else {
        lookAwayCounter.current = 0;
        hasTriggeredStrike.current = false;
      }
    }

    setAlertText(currentAlert);
    
    if (videoContainerRef.current) {
      videoContainerRef.current.style.border = currentAlert ? "5px solid red" : "2px solid #555";
    }
  }

  function cleanAIResponse(text) {
    if (!text) return "";
    const q = text.match(/[^?]*\?/);
    return q ? q[0] : `Explain ${title}?`;
  }

  function buildQAArray(messages) {
    const qa = [];
    for (let i = 0; i < messages.length; i++) {
      if (
        messages[i].sender === "ai" &&
        messages[i].text.includes("?") &&
        messages[i + 1]?.sender === "user"
      ) {
        qa.push({
          question: messages[i].text,
          answer: messages[i + 1].text,
        });
      }
    }
    console.log("📊 FINAL QA:", qa);
    return qa;
  }


  function endInterviewManually() {
  console.log("🛑 MANUAL END");

  isInterviewStoppedRef.current = true;

  speechSynthesis.cancel();

  try {
    if (recorderRef.current?.state !== "inactive") {
      recorderRef.current.stop();
    }
  } catch (e) {}

  try {
    streamRef.current?.getTracks().forEach(track => track.stop());
  } catch (e) {}

  setRecording(false);
  setProcessing(false);

  isEndingRef.current = true; // prevent auto flow
}

  const generateReport = async () => {
    const qa = buildQAArray(messages);

    console.log("📤 SENDING REPORT:", qa);

    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        qa,
        jobTitle: title,
        candidateName,
        userId: user?.id,
        jobId,
        headLookawayCount: headAwayCount.current,
        gazeLookawayCount: gazeAwayCount.current
      })
    });

    const data = await res.json();
    console.log("✅ REPORT RESPONSE:", data);

    localStorage.setItem("report", JSON.stringify(data));
    return data;
  };

  return {
    messages,
    recording,
    processing,
    videoRef,
    videoContainerRef,
    stopRecording,
    setupPopup,
    title,
    interviewEnded,
    generateReport,
    jobId,
    endInterviewManually,
    setupPopup,
    alertText
  };
}