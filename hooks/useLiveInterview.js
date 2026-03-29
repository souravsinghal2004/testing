"use client";

import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";


export default function useLiveInterview() {

  const searchParams = useSearchParams();

  const title = searchParams.get("title");
  const candidateName = searchParams.get("name");

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

  const MAX_QUESTIONS = 1;

  const questionCount = useRef(0);
  const askedQuestions = useRef([]);

  
const { user } = useUser();
const jobId = searchParams.get("jobId");

  /* INIT */
  useEffect(() => {
    initMedia();
    detectFace();
    startInterview();
  }, []);

  /* VOICE LOADER */
  useEffect(() => {

    function loadVoices() {

      const voices = speechSynthesis.getVoices();

      if (!voices.length) return;

      voiceRef.current =
        voices.find(v => v.name.includes("David")) ||
        voices.find(v => v.name.includes("Google UK English Male")) ||
        voices.find(v => v.lang === "en-US");

    }

    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;

  }, []);

  /* CLEAN AI RESPONSE */
  function cleanAIResponse(text) {

    if (!text) return "";

    if (text.includes("INTERVIEW_COMPLETE")) {
      return "INTERVIEW_COMPLETE";
    }

    text = text
      .replace(/mock interview/gi, "")
      .replace(/simulation interview/gi, "");

    const question = text.match(/[^?]*\?/);

    if (question) return question[0];

    return `Explain a concept related to ${title}?`;

  }

  /* CHAT */
  function addAI(text) {

    if (text === "INTERVIEW_COMPLETE") {
      finishInterview();
      return;
    }

    setMessages(prev => [...prev, { sender: "ai", text }]);

    if (text.includes("?")) {
      askedQuestions.current.push(text);
    }

    speak(text);
  }

  function addUser(text) {
    setMessages(prev => [...prev, { sender: "user", text }]);
  }

  /* SPEECH */
  function speak(text, onEndCallback = null) {

    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    if (voiceRef.current) {
      utterance.voice = voiceRef.current;
    }

    utterance.rate = 0.9;

    utterance.onend = () => {

      if (onEndCallback) {
        onEndCallback();
        return;
      }

      if (!isEndingRef.current) {
        startRecording();
      }

    };

    speechSynthesis.speak(utterance);

  }

  /* START INTERVIEW */
  async function startInterview() {

    while (!voiceRef.current) {
      await new Promise(r => setTimeout(r, 100));
    }

    const greeting = generateGreeting();

    setSetupPopup(false);

    speak(greeting, async () => {

      const res = await fetch("/api/interview/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          candidateName,
          jobTitle: title,
          askedQuestions: [],
          questionCount: 0
        })
      });

      const data = await res.json();

      const reply = cleanAIResponse(data.message);

      addAI(reply);

    });

  }

  /* RECORDING */
  function startRecording() {

    if (!streamRef.current) return;

    audioChunksRef.current = [];

    const audioContext = new AudioContext();

    const source = audioContext.createMediaStreamSource(streamRef.current);

    const gainNode = audioContext.createGain();
    gainNode.gain.value = 2.5;

    const destination = audioContext.createMediaStreamDestination();

    source.connect(gainNode);
    gainNode.connect(destination);

    const audioStream = destination.stream;

    const recorder = new MediaRecorder(audioStream);

    recorderRef.current = recorder;

    recorder.onstart = () => setRecording(true);

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) audioChunksRef.current.push(e.data);
    };

    recorder.onstop = async () => {

      setRecording(false);

      const blob = new Blob(audioChunksRef.current, {
        type: "audio/webm"
      });

      const text = await transcribe(blob);

    if (!text || text.trim().length < 2) {

  setProcessing(false);

  const lastQuestion =
    askedQuestions.current[askedQuestions.current.length - 1];

  speak(
    `I could not clearly hear your response. Let me repeat the question. ${lastQuestion}`
  );

  return;
}

      addUser(text);

      await sendToAI(text);

    };

    recorder.start();

  }

  function stopRecording() {

  if (
    recorderRef.current &&
    recorderRef.current.state !== "inactive"
  ) {
    // show popup immediately
    setProcessing(true);

    recorderRef.current.stop();
  }

}

  /* TRANSCRIBE */
  async function transcribe(blob) {

    const formData = new FormData();
    formData.append("file", blob);

    const res = await fetch("/api/transcribe", {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    return data.text || "";

  }

  /* SEND TO AI */
  async function sendToAI(text) {

    if (questionCount.current >= MAX_QUESTIONS) {
      finishInterview();
      return;
    }

    const res = await fetch("/api/interview/chat", {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        userMessage: text,
        history: messages,
        askedQuestions: askedQuestions.current,
        questionCount: questionCount.current,
        jobTitle: title,
        candidateName
      })

    });

    const data = await res.json();

    let reply = cleanAIResponse(data.message);

    setProcessing(false);

    questionCount.current++;

    if (questionCount.current >= MAX_QUESTIONS) {
      finishInterview();
      return;
    }

    if (reply === "INTERVIEW_COMPLETE") {
      finishInterview();
      return;
    }

    addAI(reply);

  }

  /* FINISH */
async function finishInterview() {
  if (isEndingRef.current) return;

  isEndingRef.current = true;

  speechSynthesis.cancel();
  stopRecording();

  console.log("🔥 Interview ended → generating report...");

  await generateReport(); // ✅ THIS WAS MISSING

  setInterviewEnded(true);
}

  /* MEDIA */
  async function initMedia() {

    const stream =
      await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

    streamRef.current = stream;

    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }

  }

  function generateGreeting() {

    return `Hello ${candidateName || "Candidate"}.

This is your technical interview for the role of ${title}.

I will ask you a series of technical questions to evaluate your knowledge.

Please answer clearly and concisely.

Let's begin with Question 1.`;

  }

  /* FACE DETECTION */
  async function detectFace() {

    if (!videoRef.current) return;

    const detections =
      await faceapi.detectAllFaces(
        videoRef.current,
        new faceapi.TinyFaceDetectorOptions()
      );

    if (videoContainerRef.current) {

      videoContainerRef.current.style.border =
        detections.length
          ? "5px solid green"
          : "5px solid red";

    }

    requestAnimationFrame(detectFace);

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

  return qa;
}


const generateReport = async () => {
  try {
    const controller = new AbortController();

    setTimeout(() => controller.abort(), 10000); // 10s safety

    const qaArray = buildQAArray(messages);

    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        qa: qaArray,
        jobTitle: title,
        candidateName,
         userId: user?.id,     // ✅ from Clerk
    jobId: jobId  
      }),
      signal: controller.signal,
    });

    console.log("📤 SENDING TO ANALYZE:", {
  qa: qaArray,
  jobTitle: title,
  candidateName,
  userId: user?.id,
  jobId
});

    const text = await res.text();

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      console.log("Invalid JSON, fallback used");
      data = { error: "Invalid AI response" };
    }

    localStorage.setItem("report", JSON.stringify(data));

    return data;

  } catch (err) {
    console.error("Timeout or error:", err);

    const fallback = { error: "Report failed" };

    localStorage.setItem("report", JSON.stringify(fallback));

    return fallback;
  }
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
    jobId
  };



  

}