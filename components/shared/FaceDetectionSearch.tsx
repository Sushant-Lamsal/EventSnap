// components/FaceDetectionSearch.tsx
"use client";
import React, { useState, useRef, useEffect } from "react";
import * as faceapi from "face-api.js/dist/face-api.min.js";

interface LabeledFaceDescriptors {
  label: string;
  descriptors: Float32Array[];
}

const FaceDetectionSearch: React.FC = () => {
  const [labeledFaceDescriptors, setLabeledFaceDescriptors] = useState<
    LabeledFaceDescriptors[]
  >([]);
  const photosDiv = useRef<HTMLDivElement>(null);
  const webcamVideo = useRef<HTMLVideoElement>(null);
  const capturedPhotoCanvas = useRef<HTMLCanvasElement>(null);
  const resultsDiv = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
    ]);
    startWebcam();
  };

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (webcamVideo.current) {
        webcamVideo.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing the webcam", err);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files) return;

    const descriptors: LabeledFaceDescriptors[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const img = document.createElement("img");
      img.classList.add("small-photo");
      img.src = URL.createObjectURL(file);
      img.onload = async () => {
        const detection = await faceapi
          .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptor();
        if (detection) {
          descriptors.push({
            label: file.name,
            descriptors: [detection.descriptor],
          });
          console.log(`Added face descriptor for ${file.name}`);
        } else {
          console.log(`No face detected in ${file.name}`);
        }
        img.setAttribute("data-filename", file.name);
        if (photosDiv.current) {
          photosDiv.current.appendChild(img);
        }
      };
    }

    setLabeledFaceDescriptors((prevDescriptors) => [
      ...prevDescriptors,
      ...descriptors,
    ]);
  };

  const capturePhoto = async () => {
    if (capturedPhotoCanvas.current && webcamVideo.current) {
      const context = capturedPhotoCanvas.current.getContext("2d");
      if (!context) return;

      context.drawImage(
        webcamVideo.current,
        0,
        0,
        capturedPhotoCanvas.current.width,
        capturedPhotoCanvas.current.height
      );

      if (webcamVideo.current.readyState === 4) {
        const detection = await faceapi
          .detectSingleFace(
            webcamVideo.current,
            new faceapi.TinyFaceDetectorOptions()
          )
          .withFaceLandmarks()
          .withFaceDescriptor();
        if (detection) {
          searchMatchingPhotos(detection.descriptor);
        } else {
          console.log("No face detected in webcam photo");
        }
      } else {
        console.log("Webcam video not ready");
      }
    }
  };

  const searchMatchingPhotos = (queryDescriptor: Float32Array) => {
    const maxDescriptorDistance = 0.6;

    if (labeledFaceDescriptors.length === 0) {
      console.log("No labeled face descriptors available");
      if (resultsDiv.current) {
        resultsDiv.current.innerHTML = "No matching photos found";
      }
      return;
    }

    if (resultsDiv.current) {
      resultsDiv.current.innerHTML = "";
    }

    labeledFaceDescriptors.forEach((labeledDescriptor) => {
      const distance = calculateEuclideanDistance(
        queryDescriptor,
        labeledDescriptor.descriptors[0]
      );
      if (distance <= maxDescriptorDistance) {
        const matchedImgs = Array.from(
          photosDiv.current?.children || []
        ).filter(
          (img) =>
            (img as HTMLImageElement).getAttribute("data-filename") ===
            labeledDescriptor.label
        );
        matchedImgs.forEach((img) => {
          const cloneImg = (
            img as HTMLImageElement
          ).cloneNode() as HTMLImageElement;
          cloneImg.style.maxWidth = "100%";
          if (resultsDiv.current) {
            resultsDiv.current.appendChild(cloneImg);
          }
        });
      }
    });

    if (resultsDiv.current && resultsDiv.current.innerHTML === "") {
      resultsDiv.current.innerText = "No matching photos found";
    }
  };

  const calculateEuclideanDistance = (
    descriptor1: Float32Array,
    descriptor2: Float32Array
  ): number => {
    const sum = descriptor1.reduce((acc, val, index) => {
      const diff = val - descriptor2[index];
      return acc + diff * diff;
    }, 0);
    return Math.sqrt(sum);
  };

  return (
    <div>
      <h1 className="text-center m-4">Upload Photos and Search by Face</h1>
      <div className="flex items-center justify-center">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileUpload}
        />
      </div>

      <br />
      <div
        className=" p-5 bg-gray-300 flex items-center justify-center flex-wrap  "
        ref={photosDiv}
      ></div>

      <h2 className="text-center">Webcam</h2>
      <div className="flex items-center justify-center">
        <video
          ref={webcamVideo}
          autoPlay
          muted
          width="320"
          height="240"
        ></video>
      </div>
      <br />
      <div className="flex items-center justify-center">
        <button className="bg-slate-400 p-4" onClick={capturePhoto}>
          Capture Photo
        </button>
      </div>

      <div className="flex items-center justify-evenly">
        <div>
          <h2>Captured Photo</h2>
          <canvas ref={capturedPhotoCanvas} width="320" height="240"></canvas>
        </div>
        <div>
          <h2>Search Results</h2>
          <div ref={resultsDiv}></div>
        </div>
      </div>
    </div>
  );
};

export default FaceDetectionSearch;
