export const killCameraAndMic = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    stream.getTracks().forEach((track) => track.stop());
  } catch (e) {
    // ignore
  }
};