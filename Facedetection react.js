import React, { useRef } from 'react';
import * as faceapi from 'face-api.js';

const FaceDetection = () => {
  const videoRef = useRef(null);

  const startFaceDetection = async () => {
    await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
    await faceapi.nets.faceRecognitionNet.loadFromUri('/models');

    const videoEl = videoRef.current;
    const canvas = faceapi.createCanvasFromMedia(videoEl);
    document.body.append(canvas);

    const displaySize = { width: videoEl.width, height: videoEl.height };
    faceapi.matchDimensions(canvas, displaySize);

    setInterval(async () => {
      const detections = await faceapi.detectAllFaces(videoEl, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      canvas?.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
      faceapi.draw.drawDetections(canvas, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    }, 100);
  };

  return (
    <div>
      <h1>Face Detection</h1>
      <video
        ref={videoRef}
        autoPlay
        muted
        onPlay={startFaceDetection}
      />
    </div>
  );
};

export default FaceDetection;
