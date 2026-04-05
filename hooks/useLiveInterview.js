"use client";

import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
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
  async function startInterview() {

    if (isInterviewStoppedRef.current) return;
    console.log("🎬 START INTERVIEW");

    const greeting = generateGreeting();
    setSetupPopup(false);

    setMessages([{ sender: "ai", text: greeting }]);

    await new Promise(res => speak(greeting, res));

    questionCount.current = 0;

    console.log("🎯 START DATA:", {
  dbQuestions,
  total: jobData?.no_of_questions
});

    const total = jobData?.no_of_questions || 2;

    const isPureDB = dbQuestions.length >= total;
    const isHybrid = dbQuestions.length > 0 && dbQuestions.length < total;
    const isAIOnly = dbQuestions.length === 0;

    console.log("📊 MODE CHECK:", {
      total,
      dbLength: dbQuestions.length,
      isPureDB,
      isHybrid,
      isAIOnly
    });

    if (isPureDB || isHybrid) {
      console.log("👉 FIRST QUESTION FROM DB");
      addAI(dbQuestions[0]);
    } else {
      console.log("👉 FIRST QUESTION FROM AI");
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
  async function finishInterview() {
    if (isEndingRef.current) return;

    console.log("🏁 FINISH INTERVIEW");

    isEndingRef.current = true;
    speechSynthesis.cancel();
    stopRecording();

    const msg = `Thank you for participating. Your interview is now complete. Your responses have been recorded and will be evaluated automatically. We wish you the best of luck.`;

    setMessages(prev => [...prev, { sender: "ai", text: msg }]);

    speak(msg, async () => {
      console.log("📊 GENERATING REPORT...");
      await generateReport();
      setInterviewEnded(true);
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

  async function detectFace() {
    if (!videoRef.current) return;

    const detections = await faceapi.detectAllFaces(
      videoRef.current,
      new faceapi.TinyFaceDetectorOptions()
    );

    if (videoContainerRef.current) {
      videoContainerRef.current.style.border =
        detections.length ? "5px solid green" : "5px solid red";
    }

    requestAnimationFrame(detectFace);
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
        jobId
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
    endInterviewManually
  };
}