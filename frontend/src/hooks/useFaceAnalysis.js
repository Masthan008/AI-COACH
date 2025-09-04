import { useState, useEffect, useRef } from 'react';

const useFaceAnalysis = () => {
  const [isActive, setIsActive] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [analysisData, setAnalysisData] = useState({
    eyeContact: 0,
    smile: 0,
    headStability: 0,
    confidence: 0
  });
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const faceMeshRef = useRef(null);
  const analysisIntervalRef = useRef(null);

  useEffect(() => {
    // Check if MediaPipe and camera are supported
    const checkSupport = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          setIsSupported(true);
        }
      } catch (error) {
        console.error('Camera not supported:', error);
      }
    };

    checkSupport();
  }, []);

  const startAnalysis = async () => {
    if (!isSupported) return;

    try {
      // Get camera stream
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 }
      });
      
      setStream(mediaStream);
      setIsActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }

      // Initialize MediaPipe Face Mesh
      if (window.FaceMesh) {
        faceMeshRef.current = new window.FaceMesh({
          locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
          }
        });

        faceMeshRef.current.setOptions({
          maxNumFaces: 1,
          refineLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5
        });

        faceMeshRef.current.onResults(onFaceResults);
      }

      // Start analysis loop
      analysisIntervalRef.current = setInterval(analyzeFrame, 100);

    } catch (error) {
      console.error('Error starting face analysis:', error);
      setIsActive(false);
    }
  };

  const stopAnalysis = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }

    if (analysisIntervalRef.current) {
      clearInterval(analysisIntervalRef.current);
    }

    setIsActive(false);
    setAnalysisData({
      eyeContact: 0,
      smile: 0,
      headStability: 0,
      confidence: 0
    });
  };

  const onFaceResults = (results) => {
    if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) {
      return;
    }

    const landmarks = results.multiFaceLandmarks[0];
    
    // Analyze facial features
    const analysis = analyzeFacialFeatures(landmarks);
    setAnalysisData(analysis);
  };

  const analyzeFacialFeatures = (landmarks) => {
    // Simple analysis based on landmark positions
    // This is a simplified version - in production, you'd use more sophisticated algorithms
    
    // Eye contact estimation (based on eye direction)
    const leftEye = landmarks[33];
    const rightEye = landmarks[263];
    const eyeContact = calculateEyeContact(leftEye, rightEye);

    // Smile detection (based on mouth corners)
    const leftMouth = landmarks[61];
    const rightMouth = landmarks[291];
    const centerMouth = landmarks[13];
    const smile = calculateSmile(leftMouth, rightMouth, centerMouth);

    // Head stability (based on nose position relative to face center)
    const nose = landmarks[1];
    const faceCenter = landmarks[10];
    const headStability = calculateHeadStability(nose, faceCenter);

    // Overall confidence score
    const confidence = (eyeContact + smile + headStability) / 3;

    return {
      eyeContact: Math.round(eyeContact * 100),
      smile: Math.round(smile * 100),
      headStability: Math.round(headStability * 100),
      confidence: Math.round(confidence * 100)
    };
  };

  const calculateEyeContact = (leftEye, rightEye) => {
    // Simplified eye contact calculation
    // In reality, this would involve gaze direction estimation
    const eyeLevel = (leftEye.y + rightEye.y) / 2;
    return Math.max(0, 1 - Math.abs(eyeLevel - 0.4) * 2);
  };

  const calculateSmile = (leftMouth, rightMouth, centerMouth) => {
    // Calculate smile based on mouth corner elevation
    const mouthWidth = Math.abs(rightMouth.x - leftMouth.x);
    const mouthCurve = (leftMouth.y + rightMouth.y) / 2 - centerMouth.y;
    return Math.max(0, Math.min(1, mouthCurve * 10));
  };

  const calculateHeadStability = (nose, faceCenter) => {
    // Calculate head stability based on nose position
    const deviation = Math.abs(nose.x - faceCenter.x);
    return Math.max(0, 1 - deviation * 5);
  };

  const analyzeFrame = () => {
    if (videoRef.current && faceMeshRef.current && isActive) {
      faceMeshRef.current.send({ image: videoRef.current });
    }
  };

  const getConfidenceMessage = () => {
    const { confidence, eyeContact, smile, headStability } = analysisData;
    
    if (confidence >= 80) return "You look very confident! 🌟";
    if (confidence >= 60) return "Good confidence level! 👍";
    if (confidence >= 40) return "Try to maintain better eye contact 👀";
    if (eyeContact < 50) return "Focus on looking at the camera 📹";
    if (smile < 30) return "A gentle smile can boost confidence 😊";
    if (headStability < 50) return "Try to keep your head steady 🎯";
    return "Keep practicing - you're improving! 💪";
  };

  return {
    isActive,
    isSupported,
    analysisData,
    stream,
    videoRef,
    canvasRef,
    startAnalysis,
    stopAnalysis,
    getConfidenceMessage
  };
};

export default useFaceAnalysis;
