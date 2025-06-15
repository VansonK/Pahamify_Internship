import React, { useEffect, useRef, useState } from 'react';

// Definisi state dengan informasi durasi (dalam ms) dan next state
const STATES = {
  red: { duration: 5000, next: 'green' },  
  yellow: { duration: 2000, next: 'red' },
  green: { duration: 4000, next: 'yellow' },
};

export default function TrafficLight() {
  // Inisiasi 
  // State default awal merah
  const [currentState, setCurrentState] = useState('red');

  // Set sisa waktu lampu 
  const [secondsLeft, setSecondsLeft] = useState(STATES['red'].duration / 1000);

  // Set kondisi not running / paused
  const [isRunning, setIsRunning] = useState(false);

  const startTimeRef = useRef(null); // kapan state saat ini dimulai
  const animationRef = useRef(null); // simpan ID animationFrame

  useEffect(() => {
    if (!isRunning) return; // Jalan jika sedang running saja

    startTimeRef.current = performance.now(); // waktu mulai state saat ini

    const loop = (now) => {
      const elapsed = now - startTimeRef.current;
      
      // Menggunakan waktu sisa dari sebelumnya atau durasi full dari state
      const duration = (secondsLeft * 1000) || STATES[currentState].duration; 

      // Update waktu sisa (dalam detik, dibulatkan 1 desimal)
      const timeLeft = Math.max(0, duration - elapsed);
      setSecondsLeft((timeLeft / 1000).toFixed(1));
      
      if (elapsed >= duration) {
        // Transisi ke state berikutnya
        const next = STATES[currentState].next;
        setCurrentState(next);
        startTimeRef.current = now; // reset waktu awal
      }

      animationRef.current = requestAnimationFrame(loop);
    };

    animationRef.current = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(animationRef.current);
  }, [isRunning, currentState]);

  const handleStartPause = () => {
    setIsRunning((prev) => !prev); // Toggle boolean IsRunning
  };

  // Reset semua kondisi ke default awal
  const handleReset = () => {
    cancelAnimationFrame(animationRef.current);
    setIsRunning(false);
    setCurrentState('red');
    setSecondsLeft(STATES['red'].duration / 1000);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: 50 }}>
      <div style={{ width: 60, margin: '0 auto' }}>
        {Object.keys(STATES).map((color) => (
          <div
            key={color}
            style={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              marginBottom: 10,
              backgroundColor: currentState === color ? color : '#ddd',
              transition: 'background-color 0.3s ease',
            }}
          />
        ))}
      </div>

      <div style={{ fontSize: 24, marginTop: 10 }}>
        {secondsLeft}s left
      </div>

      <div style={{ marginTop: 20 }}>
        <button onClick={handleStartPause}>
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button onClick={handleReset} style={{ marginLeft: 10 }}>
          Reset
        </button>
      </div>
    </div>
  );
}
