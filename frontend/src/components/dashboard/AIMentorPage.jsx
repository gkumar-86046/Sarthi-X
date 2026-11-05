import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Radio,
  MessageSquare,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Monitor,
  PhoneOff,
  Send,
  Compass,
  BookOpen,
  Rocket,
  Search,
  Image as ImageIcon,
  Flame,
  Volume2,
  VolumeX,
  FileText,
  X,
  RefreshCw,
  Check,
  Copy,
  RotateCcw
} from 'lucide-react';

const promptSuggestions = [
  {
    icon: Compass,
    title: 'Career Advice',
    desc: 'Help me choose the right career path.',
    prompt: 'Can you guide me on choosing the best career path in Artificial Intelligence and Software Engineering?'
  },
  {
    icon: BookOpen,
    title: 'Study Plan',
    desc: 'Create a study plan for AI & ML.',
    prompt: 'Create a structured 4-week study plan to master Machine Learning and Data Science fundamentals.'
  },
  {
    icon: Rocket,
    title: 'Project Ideas',
    desc: 'Suggest unique project ideas.',
    prompt: 'Suggest 3 unique, portfolio-ready React and Python web application project ideas for a student.'
  },
  {
    icon: Search,
    title: 'Research Help',
    desc: 'Find the latest AI research trends.',
    prompt: 'Summarize the latest research trends and papers in Generative AI and Large Language Models.'
  }
];

const initialChatMessages = [
  {
    id: 1,
    sender: 'ai',
    text: "Hello! I am your Sarathi-X AI Mentor. How can I guide your learning, career, or project goals today?",
    time: '11:20 AM'
  }
];

const AIMentorPage = ({ user }) => {
  const [mode, setMode] = useState('live'); // 'live' | 'chat'
  const [statusState, setStatusState] = useState('listening'); // 'listening' | 'thinking' | 'speaking'
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [isVoiceMuted, setIsVoiceMuted] = useState(false);
  const [liveCaptionText, setLiveCaptionText] = useState("How can I guide your learning or solve your doubts today?");

  // Chat State
  const [chatMessages, setChatMessages] = useState(initialChatMessages);
  const [inputQuery, setInputQuery] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // File Attachments & Camera State
  const [attachedFiles, setAttachedFiles] = useState([]); // [{ name, type, url, file, size }]
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);

  // Picture-in-picture webcam stream
  const [pipStream, setPipStream] = useState(null);
  const pipVideoRef = useRef(null);

  // Voice Recognition State
  const [isListeningVoice, setIsListeningVoice] = useState(false);
  const recognitionRef = useRef(null);

  // Refs
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const videoRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (mode === 'chat' && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isAiTyping, mode]);

  // Clean up PIP stream on unmount or when camera turns off
  useEffect(() => {
    if (isCameraOn) {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: false })
          .then((stream) => {
            setPipStream(stream);
            if (pipVideoRef.current) {
              pipVideoRef.current.srcObject = stream;
            }
          })
          .catch((err) => {
            console.warn('Student camera access not available:', err);
            setIsCameraOn(false);
          });
      }
    } else {
      if (pipStream) {
        pipStream.getTracks().forEach((track) => track.stop());
        setPipStream(null);
      }
    }
  }, [isCameraOn]);

  useEffect(() => {
    return () => {
      if (pipStream) {
        pipStream.getTracks().forEach((track) => track.stop());
      }
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Screen Share Toggle
  const handleToggleScreenShare = async () => {
    if (!isSharingScreen) {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
          const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
          setIsSharingScreen(true);
          displayStream.getVideoTracks()[0].onended = () => {
            setIsSharingScreen(false);
          };
        } else {
          setIsSharingScreen(true);
        }
      } catch (err) {
        console.warn('Screen share cancelled or unsupported:', err);
      }
    } else {
      setIsSharingScreen(false);
    }
  };

  // Web Speech API: Text-to-Speech (TTS)
  const speakText = (text) => {
    if (isVoiceMuted || typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      // Strip markdown asterisks or special characters for smooth voice synthesis
      const cleanVoiceText = text.replace(/[*_#`~[\]]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanVoiceText);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;

      utterance.onstart = () => {
        setStatusState('speaking');
        setLiveCaptionText(cleanVoiceText.slice(0, 160) + (cleanVoiceText.length > 160 ? '...' : ''));
      };

      utterance.onend = () => {
        setStatusState('listening');
      };

      utterance.onerror = () => {
        setStatusState('listening');
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error', e);
      setStatusState('listening');
    }
  };

  // Web Speech API: Speech-to-Text (STT)
  const toggleVoiceListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. You can type your query in the prompt box.');
      return;
    }

    if (isListeningVoice) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListeningVoice(false);
    } else {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListeningVoice(true);
          setStatusState('listening');
          setLiveCaptionText('Listening to your voice... Speak now!');
        };

        recognition.onresult = (event) => {
          const current = event.resultIndex;
          const transcript = event.results[current][0].transcript;
          setInputQuery(transcript);
          setLiveCaptionText(`You: "${transcript}"`);
        };

        recognition.onend = () => {
          setIsListeningVoice(false);
        };

        recognition.onerror = () => {
          setIsListeningVoice(false);
        };

        recognition.start();
        recognitionRef.current = recognition;
      } catch (err) {
        console.warn('Voice recognition error', err);
        setIsListeningVoice(false);
      }
    }
  };

  // Space Background Canvas Animation
  useEffect(() => {
    if (mode !== 'live') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let width = (canvas.width = canvas.parentElement.clientWidth);
    let height = (canvas.height = canvas.parentElement.clientHeight);

    const handleResize = () => {
      if (canvas && canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth;
        height = canvas.height = canvas.parentElement.clientHeight;
      }
    };
    window.addEventListener('resize', handleResize);

    const numStars = 140;
    const stars = Array.from({ length: numStars }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.4,
      alpha: Math.random(),
      alphaSpeed: (Math.random() * 0.02 + 0.005) * (Math.random() < 0.5 ? 1 : -1),
      speedX: (Math.random() - 0.5) * 0.12,
      speedY: (Math.random() - 0.5) * 0.12
    }));

    let meteors = [];
    const createMeteor = () => {
      meteors.push({
        x: Math.random() * width * 0.8,
        y: Math.random() * height * 0.35,
        length: Math.random() * 70 + 40,
        speed: Math.random() * 7 + 5,
        alpha: 1,
        angle: Math.PI / 4
      });
    };

    let meteorTimer = setInterval(() => {
      if (Math.random() < 0.5) {
        createMeteor();
      }
    }, 3200);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const bgGradient = ctx.createRadialGradient(
        width * 0.5,
        height * 0.4,
        40,
        width * 0.5,
        height * 0.4,
        Math.max(width, height) * 0.85
      );
      bgGradient.addColorStop(0, 'rgba(30, 27, 75, 0.4)');
      bgGradient.addColorStop(0.5, 'rgba(15, 23, 42, 0.7)');
      bgGradient.addColorStop(1, 'rgba(2, 6, 23, 0.95)');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      stars.forEach((star) => {
        star.x += star.speedX;
        star.y += star.speedY;
        star.alpha += star.alphaSpeed;

        if (star.alpha >= 1 || star.alpha <= 0.1) {
          star.alphaSpeed = -star.alphaSpeed;
        }

        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        if (star.y < 0) star.y = height;
        if (star.y > height) star.y = 0;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(248, 250, 252, ${Math.abs(star.alpha)})`;
        if (star.size > 1.6) {
          ctx.shadowBlur = 6;
          ctx.shadowColor = '#818cf8';
        } else {
          ctx.shadowBlur = 0;
        }
        ctx.fill();
      });

      meteors.forEach((m, idx) => {
        m.x += Math.cos(m.angle) * m.speed;
        m.y += Math.sin(m.angle) * m.speed;
        m.alpha -= 0.014;

        if (m.alpha <= 0) {
          meteors.splice(idx, 1);
          return;
        }

        const tailX = m.x - Math.cos(m.angle) * m.length;
        const tailY = m.y - Math.sin(m.angle) * m.length;

        const meteorGradient = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
        meteorGradient.addColorStop(0, `rgba(248, 250, 252, ${m.alpha})`);
        meteorGradient.addColorStop(0.3, `rgba(139, 92, 246, ${m.alpha * 0.8})`);
        meteorGradient.addColorStop(1, `rgba(99, 102, 241, 0)`);

        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = meteorGradient;
        ctx.lineWidth = 1.8;
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(meteorTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, [mode]);

  // File Upload Handlers
  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const newAttachment = {
      name: file.name,
      type: 'pdf',
      size: (file.size / 1024).toFixed(1) + ' KB',
      file
    };
    setAttachedFiles((prev) => [...prev, newAttachment]);
    e.target.value = '';
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const newAttachment = {
        name: file.name,
        type: 'image',
        size: (file.size / 1024).toFixed(1) + ' KB',
        url: reader.result,
        file
      };
      setAttachedFiles((prev) => [...prev, newAttachment]);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Camera Snapshot Modal Handlers
  const openCameraModal = async () => {
    try {
      setCapturedPhoto(null);
      setShowCameraModal(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert('Could not access camera. Please check camera device and browser permissions.');
      setShowCameraModal(false);
    }
  };

  const closeCameraModal = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setShowCameraModal(false);
    setCapturedPhoto(null);
  };

  const snapPhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const snapCanvas = document.createElement('canvas');
    snapCanvas.width = video.videoWidth || 640;
    snapCanvas.height = video.videoHeight || 480;
    const ctx = snapCanvas.getContext('2d');
    ctx.drawImage(video, 0, 0, snapCanvas.width, snapCanvas.height);
    const dataUrl = snapCanvas.toDataURL('image/png');
    setCapturedPhoto(dataUrl);
  };

  const attachCapturedPhoto = () => {
    if (!capturedPhoto) return;
    const newAttachment = {
      name: `Snapshot_${Date.now().toString().slice(-4)}.png`,
      type: 'image',
      size: '124 KB',
      url: capturedPhoto
    };
    setAttachedFiles((prev) => [...prev, newAttachment]);
    closeCameraModal();
  };

  const removeAttachment = (index) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCopyText = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Handle Send Prompt / Message
  const handleSendPrompt = (textToSend = null) => {
    const query = (textToSend || inputQuery).trim();
    if (!query && attachedFiles.length === 0) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      attachments: [...attachedFiles],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setAttachedFiles([]);
    setIsAiTyping(true);
    setStatusState('thinking');
    setLiveCaptionText('Analyzing your request and synthesizing intelligent guidance...');

    setTimeout(() => {
      let attachmentDetail = '';
      if (userMsg.attachments && userMsg.attachments.length > 0) {
        attachmentDetail = ` I have analyzed your ${userMsg.attachments.length} attached document/image file(s). `;
      }

      let responseText = '';
      if (query.toLowerCase().includes('career') || query.toLowerCase().includes('path')) {
        responseText = `Based on your profile, AI Engineering and Full-Stack Development offer tremendous growth!${attachmentDetail} Focus on foundational Data Structures, mastering React & Next.js for modern interfaces, and PyTorch / Hugging Face for machine learning integrations. Sarathi-X recommends completing the Python & AI roadmap next.`;
      } else if (query.toLowerCase().includes('study plan') || query.toLowerCase().includes('plan')) {
        responseText = `Here is your structured 4-week AI mastery roadmap:${attachmentDetail}\n• Week 1: Python, NumPy & Pandas Data Mastery\n• Week 2: Supervised & Unsupervised Machine Learning with Scikit-Learn\n• Week 3: Deep Neural Networks & Computer Vision with PyTorch\n• Week 4: Transformer Architecture, LLM Fine-tuning & Portfolio Project Deployment.`;
      } else if (query.toLowerCase().includes('project') || query.toLowerCase().includes('idea')) {
        responseText = `Here are 3 unique, high-impact project ideas for your portfolio:${attachmentDetail}\n1. AI-Powered Code Explainer & Review Bot with AST parsing\n2. Real-time Multi-modal Exam Prep Assistant with OCR textbook scanning\n3. Autonomous Career Roadmap Generator with interactive skill graphs.`;
      } else if (query.toLowerCase().includes('research') || query.toLowerCase().includes('paper')) {
        responseText = `Recent 2025-2026 research highlights in Generative AI focus on Retrieval-Augmented Generation (RAG 2.0), Mixture of Experts (MoE) efficiency, and multi-modal spatial reasoning.${attachmentDetail} I recommend reviewing papers on DeepSeek-R1 reasoning models and compact on-device LLM architectures.`;
      } else {
        responseText = `Regarding "${query || 'your inquiry'}":${attachmentDetail} Break this down into foundational steps, verify the core constraints, and apply iterative testing. Sarathi-X is continuously monitoring your progress to ensure maximum clarity and skill retention!`;
      }

      const aiReply = {
        id: Date.now() + 1,
        sender: 'ai',
        text: responseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatMessages((prev) => [...prev, aiReply]);
      setIsAiTyping(false);

      if (mode === 'live') {
        speakText(responseText);
      } else {
        setStatusState('listening');
      }
    }, 1300);
  };

  return (
    <div className="ai-mentor-container">
      {/* Hidden File Inputs */}
      <input
        type="file"
        accept=".pdf,.doc,.docx,.txt"
        ref={fileInputRef}
        onChange={handlePdfUpload}
        style={{ display: 'none' }}
      />
      <input
        type="file"
        accept="image/*"
        ref={imageInputRef}
        onChange={handleImageUpload}
        style={{ display: 'none' }}
      />

      {/* Sleek Top Control Bar */}
      <div className="ai-top-bar glass">
        <div className="ai-top-left">
          <div className="ai-mentor-tag">
            <span className="live-status-dot"></span>
            <Sparkles size={16} className="tag-sparkle-icon" />
            <span className="tag-title">Sarathi-X AI Mentor</span>
            <span className="tag-ver">Live v2.5</span>
          </div>
          <div className="xp-badge-compact">
            <Flame size={14} color="#f59e0b" />
            <span>1,280 XP</span>
          </div>
        </div>

        {/* Center Mode Switcher Pill */}
        <div className="mode-toggle-pill">
          <button
            className={`mode-btn ${mode === 'live' ? 'active' : ''}`}
            onClick={() => {
              setMode('live');
              if (window.speechSynthesis) window.speechSynthesis.cancel();
            }}
          >
            <Radio size={15} className={mode === 'live' ? 'pulse-icon' : ''} />
            <span>Live Voice & Vision</span>
          </button>
          <button
            className={`mode-btn ${mode === 'chat' ? 'active' : ''}`}
            onClick={() => {
              setMode('chat');
              if (window.speechSynthesis) window.speechSynthesis.cancel();
            }}
          >
            <MessageSquare size={15} />
            <span>Chat Mentor</span>
          </button>
        </div>

        {/* Right Action Controls */}
        <div className="ai-top-right">
          <button
            className={`ai-pill-btn ${isVoiceMuted ? 'muted' : ''}`}
            onClick={() => {
              const nextMuted = !isVoiceMuted;
              setIsVoiceMuted(nextMuted);
              if (nextMuted && window.speechSynthesis) {
                window.speechSynthesis.cancel();
              }
            }}
            title={isVoiceMuted ? 'Unmute AI Voice' : 'Mute AI Voice'}
          >
            {isVoiceMuted ? <VolumeX size={15} color="#ef4444" /> : <Volume2 size={15} color="#06b6d4" />}
            <span className="btn-label">{isVoiceMuted ? 'Voice Off' : 'Voice On'}</span>
          </button>

          <button
            className="ai-pill-btn"
            onClick={() => {
              if (window.speechSynthesis) window.speechSynthesis.cancel();
              setChatMessages(initialChatMessages);
              setAttachedFiles([]);
              setInputQuery('');
              setLiveCaptionText('Session refreshed. How can I guide you today?');
            }}
            title="Reset Conversation"
          >
            <RotateCcw size={14} />
            <span className="btn-label">Reset</span>
          </button>
        </div>
      </div>

      {/* Live Mode Interface */}
      {mode === 'live' && (
        <div className="live-viewport glass">
          <canvas ref={canvasRef} className="space-canvas" />

          {/* Floating Student Webcam Picture-in-Picture */}
          {isCameraOn && (
            <div className="pip-camera-box glass">
              <video ref={pipVideoRef} autoPlay playsInline muted className="pip-video-stream" />
              <div className="pip-overlay-info">
                <span className="pip-live-dot"></span>
                <span>Student Cam</span>
              </div>
              <button className="pip-close-btn" onClick={() => setIsCameraOn(false)} title="Close camera feed">
                <X size={13} />
              </button>
            </div>
          )}

          {/* Floating Screen Share Indicator */}
          {isSharingScreen && (
            <div className="screen-share-pill glass">
              <Monitor size={14} color="#06b6d4" />
              <span>Screen Sharing Active</span>
              <button className="screen-stop-btn" onClick={() => setIsSharingScreen(false)}>Stop</button>
            </div>
          )}

          {/* Center AI Orb Stage */}
          <div className="orb-center-stage">
            <div className={`orb-wrapper ${statusState}`}>
              <div className="orb-aura aura-3"></div>
              <div className="orb-aura aura-2"></div>
              <div className="orb-aura aura-1"></div>

              <div className="orb-core">
                <div className="orb-logo">
                  <span className="orb-s-symbol">S</span>
                  <Sparkles size={16} className="orb-sparkle" />
                </div>
              </div>
            </div>

            {/* Audio Wave Visualizer */}
            <div className="audio-wave-visualizer" title="Real-time Audio Spectrum">
              {[...Array(14)].map((_, i) => (
                <span key={i} className={`wave-bar bar-${i} ${statusState}`} />
              ))}
            </div>

            {/* AI Heading & Dynamic Live Captions */}
            <div className="orb-title-group">
              <h3>
                I'm <span className="gradient-text">Sarathi-X</span> AI Mentor
              </h3>

              <div className={`status-pill ${statusState}`}>
                <span className="status-dot"></span>
                <span className="status-text">
                  {statusState === 'listening' && 'Listening...'}
                  {statusState === 'thinking' && 'Analyzing Query...'}
                  {statusState === 'speaking' && 'Speaking Guidance...'}
                </span>
              </div>

              {/* Subtitle / Live Subtitles Pill */}
              <div className="live-caption-pill glass-inner">
                <p>{liveCaptionText}</p>
              </div>
            </div>

            {/* Call Controls Bar */}
            <div className="call-controls-bar glass-inner">
              <button
                className={`control-btn ${isCameraOn ? 'active' : ''}`}
                onClick={() => setIsCameraOn(!isCameraOn)}
                title={isCameraOn ? 'Turn Off Student Camera' : 'Turn On Student Camera'}
              >
                <div className="control-icon-circle">
                  {isCameraOn ? <Camera size={18} /> : <CameraOff size={18} />}
                </div>
                <span>Camera</span>
              </button>

              <button
                className={`control-btn ${isMicOn ? 'active' : 'muted-btn'}`}
                onClick={() => {
                  const nextMic = !isMicOn;
                  setIsMicOn(nextMic);
                  if (!nextMic) {
                    if (isListeningVoice) toggleVoiceListening();
                    setStatusState('thinking');
                  } else {
                    setStatusState('listening');
                  }
                }}
                title={isMicOn ? 'Mute Microphone' : 'Unmute Microphone'}
              >
                <div className="control-icon-circle">
                  {isMicOn ? <Mic size={18} /> : <MicOff size={18} />}
                </div>
                <span>{isMicOn ? 'Mic' : 'Muted'}</span>
              </button>

              <button
                className={`control-btn ${isSharingScreen ? 'active' : ''}`}
                onClick={handleToggleScreenShare}
                title="Share Screen"
              >
                <div className="control-icon-circle">
                  <Monitor size={18} />
                </div>
                <span>Share</span>
              </button>

              <button
                className={`control-btn ${isVoiceMuted ? 'muted-btn' : 'active'}`}
                onClick={() => setIsVoiceMuted(!isVoiceMuted)}
                title={isVoiceMuted ? 'Unmute AI Audio' : 'Mute AI Audio'}
              >
                <div className="control-icon-circle">
                  {isVoiceMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </div>
                <span>{isVoiceMuted ? 'Audio Off' : 'Audio On'}</span>
              </button>

              <button
                className="control-btn end-call-btn"
                onClick={() => {
                  if (window.speechSynthesis) window.speechSynthesis.cancel();
                  setMode('chat');
                }}
                title="Switch to Chat Mode"
              >
                <div className="control-icon-circle end-icon">
                  <PhoneOff size={18} />
                </div>
                <span>End</span>
              </button>
            </div>
          </div>

          {/* Bottom Dock Panel */}
          <div className="live-bottom-panel">
            {/* Attachment Preview Chips Bar */}
            {attachedFiles.length > 0 && (
              <div className="attachments-preview-bar glass-inner">
                {attachedFiles.map((att, idx) => (
                  <div key={idx} className="attachment-chip glass">
                    {att.type === 'pdf' ? (
                      <FileText size={15} color="#06b6d4" />
                    ) : (
                      <img src={att.url} alt="Attachment" className="attachment-thumb" />
                    )}
                    <span className="attachment-name">{att.name}</span>
                    <button className="remove-att-btn" onClick={() => removeAttachment(idx)}>
                      <X size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Prompt Input Card */}
            <div className="prompt-input-card glass">
              <div className="input-row">
                {/* Capability buttons on the left */}
                <div className="input-quick-actions">
                  <button
                    className="action-icon-pill"
                    onClick={() => fileInputRef.current?.click()}
                    title="Upload PDF or Document"
                  >
                    <FileText size={16} color="#06b6d4" />
                    <span className="action-pill-text">PDF</span>
                  </button>
                  <button
                    className="action-icon-pill"
                    onClick={() => imageInputRef.current?.click()}
                    title="Upload Image"
                  >
                    <ImageIcon size={16} color="#818cf8" />
                    <span className="action-pill-text">Image</span>
                  </button>
                  <button
                    className="action-icon-pill highlight-camera"
                    onClick={openCameraModal}
                    title="Take Snapshot of Notes / Problems"
                  >
                    <Camera size={16} color="#ec4899" />
                    <span className="action-pill-text">Snap</span>
                  </button>
                </div>

                <input
                  type="text"
                  placeholder="Ask me anything, or upload PDF, Image, Take Picture..."
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendPrompt()}
                  className="live-text-input"
                />

                {/* Voice speech dictation button */}
                <button
                  className={`voice-record-btn ${isListeningVoice ? 'recording' : ''}`}
                  onClick={toggleVoiceListening}
                  title={isListeningVoice ? 'Stop voice listening' : 'Speak to AI Mentor'}
                >
                  <Mic size={17} />
                </button>

                {/* Send Button */}
                <button
                  className="send-btn"
                  onClick={() => handleSendPrompt()}
                  disabled={!inputQuery.trim() && attachedFiles.length === 0}
                  title="Send to Sarathi-X"
                >
                  <Send size={17} />
                </button>
              </div>

              {/* Single-line sleek suggestion chips */}
              <div className="prompt-suggestions-row">
                <span className="suggestions-label">Quick Prompts:</span>
                <div className="suggestions-scroll">
                  {promptSuggestions.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={idx}
                        className="suggestion-chip glass-inner"
                        onClick={() => handleSendPrompt(item.prompt)}
                        title={item.prompt}
                      >
                        <Icon size={13} color="var(--primary-light)" />
                        <span>{item.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Mode Interface */}
      {mode === 'chat' && (
        <div className="chat-viewport glass">
          <div className="chat-messages-container">
            {chatMessages.map((msg) => (
              <div key={msg.id} className={`chat-message-row ${msg.sender}`}>
                <div className="chat-bubble glass-inner">
                  <div className="message-header">
                    <span className="sender-name">
                      {msg.sender === 'ai' ? (
                        <>
                          <Sparkles size={14} color="var(--primary)" />
                          <span>Sarathi-X AI Mentor</span>
                        </>
                      ) : (
                        <span>{user?.fullName || 'You'}</span>
                      )}
                    </span>
                    <span className="message-time">{msg.time}</span>
                  </div>

                  {/* Render Attached Media in Message */}
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="msg-attachments-grid">
                      {msg.attachments.map((att, i) => (
                        <div key={i} className="msg-attachment-item">
                          {att.type === 'pdf' ? (
                            <div className="msg-pdf-box">
                              <FileText size={16} color="#06b6d4" />
                              <span>{att.name} ({att.size || 'PDF'})</span>
                            </div>
                          ) : (
                            <img src={att.url} alt="User attachment" className="msg-img-preview" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="message-text">{msg.text}</p>

                  {msg.sender === 'ai' && (
                    <div className="bubble-actions">
                      <button
                        className="bubble-action-btn"
                        onClick={() => speakText(msg.text)}
                        title="Read Aloud"
                      >
                        <Volume2 size={13} />
                        <span>Read Aloud</span>
                      </button>
                      <button
                        className="bubble-action-btn"
                        onClick={() => handleCopyText(msg.text, msg.id)}
                        title="Copy text"
                      >
                        {copiedId === msg.id ? <Check size={13} color="#4ade80" /> : <Copy size={13} />}
                        <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isAiTyping && (
              <div className="chat-message-row ai">
                <div className="chat-bubble glass-inner typing-bubble">
                  <Sparkles size={16} className="typing-spin" />
                  <span>Sarathi-X AI is analyzing document & generating response...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Mode Input Bar */}
          <div className="chat-input-container glass-inner">
            {attachedFiles.length > 0 && (
              <div className="attachments-preview-bar">
                {attachedFiles.map((att, idx) => (
                  <div key={idx} className="attachment-chip glass">
                    {att.type === 'pdf' ? (
                      <FileText size={14} color="#06b6d4" />
                    ) : (
                      <img src={att.url} alt="Attachment" className="attachment-thumb" />
                    )}
                    <span className="attachment-name">{att.name}</span>
                    <button className="remove-att-btn" onClick={() => removeAttachment(idx)}>
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="input-row">
              <div className="input-quick-actions">
                <button
                  className="action-icon-pill"
                  onClick={() => fileInputRef.current?.click()}
                  title="Upload PDF/Doc"
                >
                  <FileText size={16} color="#06b6d4" />
                  <span className="action-pill-text">PDF</span>
                </button>
                <button
                  className="action-icon-pill"
                  onClick={() => imageInputRef.current?.click()}
                  title="Upload Image"
                >
                  <ImageIcon size={16} color="#818cf8" />
                  <span className="action-pill-text">Image</span>
                </button>
                <button
                  className="action-icon-pill highlight-camera"
                  onClick={openCameraModal}
                  title="Take Picture"
                >
                  <Camera size={16} color="#ec4899" />
                  <span className="action-pill-text">Snap</span>
                </button>
              </div>

              <input
                type="text"
                placeholder="Ask Sarathi-X AI Mentor (PDF, Image & Camera supported)..."
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendPrompt()}
                className="live-text-input"
              />

              <button
                className={`voice-record-btn ${isListeningVoice ? 'recording' : ''}`}
                onClick={toggleVoiceListening}
                title={isListeningVoice ? 'Stop voice listening' : 'Speak to AI'}
              >
                <Mic size={17} />
              </button>

              <button
                className="send-btn"
                onClick={() => handleSendPrompt()}
                disabled={!inputQuery.trim() && attachedFiles.length === 0}
                title="Send Message"
              >
                <Send size={17} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Camera Snapshot Modal */}
      {showCameraModal && (
        <div className="camera-modal-backdrop" onClick={closeCameraModal}>
          <div className="camera-modal-content glass" onClick={(e) => e.stopPropagation()}>
            <div className="camera-modal-header">
              <div className="camera-header-title">
                <Camera size={20} color="var(--accent)" />
                <h3>Snapshot Notes / Textbook Problem</h3>
              </div>
              <button className="modal-close-btn" onClick={closeCameraModal}>
                <X size={18} />
              </button>
            </div>

            <div className="camera-view-container">
              {!capturedPhoto ? (
                <div className="video-stream-wrapper">
                  <video ref={videoRef} autoPlay playsInline className="webcam-video" />
                  <div className="camera-grid-overlay"></div>
                </div>
              ) : (
                <div className="captured-preview-wrapper">
                  <img src={capturedPhoto} alt="Captured Snapshot" className="captured-img" />
                  <span className="captured-tag">
                    <Check size={14} /> Picture Snapped
                  </span>
                </div>
              )}
            </div>

            <div className="camera-modal-footer">
              {!capturedPhoto ? (
                <button className="btn btn-primary snap-btn" onClick={snapPhoto}>
                  <Camera size={17} />
                  <span>Snap Picture</span>
                </button>
              ) : (
                <div className="snap-actions-row">
                  <button className="btn btn-outline" onClick={() => setCapturedPhoto(null)}>
                    <RefreshCw size={15} />
                    <span>Retake</span>
                  </button>
                  <button className="btn btn-primary" onClick={attachCapturedPhoto}>
                    <Check size={15} />
                    <span>Attach to AI Mentor</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIMentorPage;
