import React, { useState, useEffect } from 'react';

const MontyHallSimulator = () => {
  const [doors, setDoors] = useState([0, 0, 0]);
  const [selectedDoor, setSelectedDoor] = useState(null);
  const [revealedDoor, setRevealedDoor] = useState(null);
  const [winningDoor, setWinningDoor] = useState(null);
  const [gameState, setGameState] = useState('start');
  const [result, setResult] = useState('');
  const [stats, setStats] = useState({ switched: 0, switchedWins: 0, stayed: 0, stayedWins: 0 });

  const resetGame = () => {
    const newWinningDoor = Math.floor(Math.random() * 3);
    setDoors([0, 0, 0]);
    setSelectedDoor(null);
    setRevealedDoor(null);
    setWinningDoor(newWinningDoor);
    setGameState('start');
    setResult('');
  };

  const selectDoor = (doorIndex) => {
    if (gameState === 'start') {
      setSelectedDoor(doorIndex);
      setGameState('reveal');
      revealGoatDoor(doorIndex);
    }
  };

  const revealGoatDoor = (selectedDoorIndex) => {
    let goatDoorIndex;
    do {
      goatDoorIndex = Math.floor(Math.random() * 3);
    } while (goatDoorIndex === selectedDoorIndex || goatDoorIndex === winningDoor);
    
    setRevealedDoor(goatDoorIndex);
    const newDoors = [...doors];
    newDoors[goatDoorIndex] = 'goat';
    setDoors(newDoors);
  };

  const finishGame = (finalDoorIndex) => {
    const newDoors = [...doors];
    newDoors[winningDoor] = 'car';
    setDoors(newDoors);

    const hasWon = finalDoorIndex === winningDoor;
    const hasSwitched = finalDoorIndex !== selectedDoor;

    setStats(prevStats => ({
      switched: hasSwitched ? prevStats.switched + 1 : prevStats.switched,
      switchedWins: hasSwitched && hasWon ? prevStats.switchedWins + 1 : prevStats.switchedWins,
      stayed: !hasSwitched ? prevStats.stayed + 1 : prevStats.stayed,
      stayedWins: !hasSwitched && hasWon ? prevStats.stayedWins + 1 : prevStats.stayedWins,
    }));

    setResult(hasWon ? 'You won the car! 🎉' : 'You got a goat. 🐐 Better luck next time!');
    setGameState('end');
  };

  const handleSwitch = () => {
    const availableDoor = [0, 1, 2].find(i => i !== selectedDoor && i !== revealedDoor);
    finishGame(availableDoor);
  };

  const handleStay = () => {
    finishGame(selectedDoor);
  };

  useEffect(resetGame, []);

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ color: '#333' }}>Monty Hall Problem Simulator</h2>
      <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px' }}>
        {doors.map((door, index) => (
          <button
            key={index}
            onClick={() => selectDoor(index)}
            disabled={gameState !== 'start' || index === revealedDoor}
            style={{
              width: '80px',
              height: '120px',
              fontSize: '24px',
              backgroundColor: selectedDoor === index ? '#4CAF50' : '#ddd',
              border: 'none',
              borderRadius: '8px',
              cursor: gameState === 'start' ? 'pointer' : 'default',
            }}
          >
            {door === 'car' ? '🚗' : door === 'goat' ? '🐐' : '🚪'}
          </button>
        ))}
      </div>
      <div style={{ marginBottom: '20px', minHeight: '50px' }}>
        {gameState === 'start' && <p>Choose a door!</p>}
        {gameState === 'reveal' && (
          <div>
            <p>A goat was behind door {revealedDoor + 1}. Do you want to switch your choice?</p>
            <button onClick={handleSwitch} style={{ marginRight: '10px', padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              Switch
            </button>
            <button onClick={handleStay} style={{ padding: '10px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              Stay
            </button>
          </div>
        )}
        {gameState === 'end' && <p style={{ fontWeight: 'bold' }}>{result}</p>}
      </div>
      <button onClick={resetGame} style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#008CBA', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
        New Game
      </button>
      <div style={{ backgroundColor: '#f0f0f0', padding: '15px', borderRadius: '8px' }}>
        <h3>Statistics:</h3>
        <p>Switched: {stats.switchedWins}/{stats.switched} ({stats.switched > 0 ? (stats.switchedWins / stats.switched * 100).toFixed(2) : 0}%)</p>
        <p>Stayed: {stats.stayedWins}/{stats.stayed} ({stats.stayed > 0 ? (stats.stayedWins / stats.stayed * 100).toFixed(2) : 0}%)</p>
      </div>
    </div>
  );
};

export default MontyHallSimulator;