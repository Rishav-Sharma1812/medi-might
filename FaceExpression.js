import React, { useEffect, useRef, useState } from "react";

const FaceExpression = () => {
  const videoRef = useRef(null);
  const [expression, setExpression] = useState("😊");

  useEffect(() => {
    let faceapi;

    const startFaceDetection = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error("Webcam not supported in this browser.");
        return;
      }

      // Request webcam access
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.error("Webcam access error:", err);
          alert("⚠️ Please allow camera access for facial expression detection.");
        });

      // Load ml5 face-api model
      faceapi = await ml5.faceApi(videoRef.current, {
        withLandmarks: true,
        withExpressions: true,
      });

      detectFaces();
    };

    const detectFaces = () => {
      if (!faceapi) return;
      faceapi.detect((err, results) => {
        if (results && results.length > 0) {
          const expressions = results[0].expressions;
          const topExpression = Object.keys(expressions).reduce((a, b) =>
            expressions[a] > expressions[b] ? a : b
          );

          // Map expressions to emojis
          const expressionMap = {
            happy: "😃",
            sad: "😢",
            angry: "😡",
            surprised: "😲",
            neutral: "😐",
          };

          setExpression(expressionMap[topExpression] || "😶");
        }
        requestAnimationFrame(detectFaces);
      });
    };

    startFaceDetection();

    return () => {
      if (videoRef.current) {
        let stream = videoRef.current.srcObject;
        let tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">😊 Facial Expression Detection</h1>

      {/* Video Feed Container */}
      <div className="relative border-4 border-blue-500 rounded-lg shadow-lg">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-80 h-60 rounded-lg"
        />
      </div>

      {/* Display the Emoji */}
      <h2 className="text-6xl mt-4">{expression}</h2>
      <p className="text-gray-500">Your detected emotion</p>
    </div>
  );
};

export default FaceExpression;
