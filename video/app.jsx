// video/app.jsx — root mount
const { Stage, VideoScenes, DURATION } = window;

function App() {
  return (
    <Stage
      width={1920}
      height={1080}
      duration={DURATION}
      background="#0b1220"
      persistKey="rapidact_video"
    >
      <VideoScenes />
    </Stage>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
