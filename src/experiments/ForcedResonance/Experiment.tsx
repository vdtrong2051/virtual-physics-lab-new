import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Text, Trail, Grid } from '@react-three/drei';
import { InlineMath } from 'react-katex';

// ==========================================
// COMPONENT CON LẮC (MÔ PHỎNG VẬT LÝ THỰC TẾ)
// ==========================================
function Pendulum({ length, driverLength, timeRef, color, label, isDriver = false }: { 
  length: number, 
  driverLength: number, 
  timeRef: React.MutableRefObject<number>, 
  color: string, 
  label: string, 
  isDriver?: boolean 
}) {
  const groupRef = useRef<THREE.Group>(null);
  const textRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (!groupRef.current) return;
    
    const t = timeRef.current;
    const g = 9.8;
    const beta = 0.15; 
    
    const omegaD = Math.sqrt(g / driverLength);
    const omega0 = Math.sqrt(g / length);

    let currentAngle = 0;

    if (isDriver) {
      currentAngle = 0.6 * Math.cos(omegaD * t); 
    } else {
      const F0 = 0.8; 
      const deltaOmegaSq = omega0 * omega0 - omegaD * omegaD;
      const amplitude = F0 / Math.sqrt(deltaOmegaSq * deltaOmegaSq + 4 * beta * beta * omegaD * omegaD);
      const phase = Math.atan2(2 * beta * omegaD, deltaOmegaSq);
      const transient = 1 - Math.exp(-beta * t);
      
      currentAngle = amplitude * transient * Math.cos(omegaD * t - phase);
    }

    groupRef.current.rotation.z = currentAngle;
    
    // Giữ chữ luôn thẳng đứng
    if (textRef.current) {
      textRef.current.rotation.z = -currentAngle; 
    }
  });

  return (
    <group ref={groupRef}>
      {/* Vòng khuyên kim loại nối dây với thanh ngang */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.16, 0.015, 16, 32]} />
        <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Sợi dây (được làm cực kỳ mảnh như sợi chỉ thật) */}
      <mesh position={[0, -length / 2, 0]} castShadow>
        <cylinderGeometry args={[0.008, 0.008, length]} />
        <meshStandardMaterial color="#1e293b" roughness={0.9} />
      </mesh>
      
      <group position={[0, -length, 0]}>
        {/* Vệt sáng mờ nhẹ để dễ theo dõi quỹ đạo */}
        <Trail width={isDriver ? 0.2 : 0.1} color={color} length={1.5} decay={1} attenuation={(t) => t * t}>
          {/* Quả nặng (Vật liệu kim loại sơn tĩnh điện chân thực, không phát sáng ảo) */}
          <mesh castShadow>
            <sphereGeometry args={[isDriver ? 0.35 : 0.28, 64, 64]} />
            <meshStandardMaterial 
              color={color} 
              roughness={0.15} 
              metalness={0.3} 
              clearcoat={0.5} 
              clearcoatRoughness={0.2}
            />
          </mesh>
        </Trail>
        
        {/* Nhãn văn bản */}
        <group ref={textRef} position={[0, -0.65, 0]}>
          <Text fontSize={0.25} color="#0f172a" outlineWidth={0.03} outlineColor="#ffffff" fontWeight="bold">
            {label}
          </Text>
        </group>
      </group>
    </group>
  );
}

// ==========================================
// SCENE VẬT LÝ (KHUNG CHỮ U THỰC TẾ)
// ==========================================
type PendulumState = { length: number, posX: number };

function SimulationScene({ 
  isPlaying, resetKey, driver, p1, p2, p3 
}: { 
  isPlaying: boolean, resetKey: number, driver: PendulumState, p1: PendulumState, p2: PendulumState, p3: PendulumState 
}) {
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    if (isPlaying) {
      timeRef.current += delta;
    }
  });

  useEffect(() => {
    timeRef.current = 0;
  }, [resetKey]);

  return (
    <group position={[0, 4, 0]}>
      {/* Ánh sáng vật lý 3 điểm */}
      <directionalLight position={[15, 20, 15]} intensity={1.8} castShadow shadow-mapSize={[4096, 4096]} shadow-bias={-0.0001} />
      <directionalLight position={[-10, 10, -10]} intensity={0.5} />
      <ambientLight intensity={0.6} />
      <Environment preset="city" />

      {/* CỘT TRÁI */}
      <mesh position={[-7.5, -4, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 8]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[-7.5, -8, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 0.2, 3]} />
        <meshStandardMaterial color="#475569" roughness={0.8} />
      </mesh>

      {/* CỘT PHẢI (Thêm vào để cân bằng thực tế) */}
      <mesh position={[7.5, -4, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 8]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[7.5, -8, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 0.2, 3]} />
        <meshStandardMaterial color="#475569" roughness={0.8} />
      </mesh>
      
      {/* THANH NGANG INOX NỐI 2 CỘT */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI/2]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 15]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* CÁC CON LẮC */}
      <group position={[driver.posX, 0, 0]}>
        <Pendulum length={driver.length} driverLength={driver.length} timeRef={timeRef} color="#ef4444" label={`Con lắc Đ (${driver.length.toFixed(1)}m)`} isDriver />
      </group>
      <group position={[p1.posX, 0, 0]}>
        <Pendulum length={p1.length} driverLength={driver.length} timeRef={timeRef} color="#3b82f6" label={`L1 (${p1.length.toFixed(1)}m)`} />
      </group>
      <group position={[p2.posX, 0, 0]}>
        <Pendulum length={p2.length} driverLength={driver.length} timeRef={timeRef} color="#10b981" label={`L2 (${p2.length.toFixed(1)}m)`} />
      </group>
      <group position={[p3.posX, 0, 0]}>
        <Pendulum length={p3.length} driverLength={driver.length} timeRef={timeRef} color="#8b5cf6" label={`L3 (${p3.length.toFixed(1)}m)`} />
      </group>

      {/* SÀN PHÒNG THÍ NGHIỆM */}
      <mesh position={[0, -8.1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 30]} />
        <meshStandardMaterial color="#f8fafc" roughness={1} />
      </mesh>
      <Grid position={[0, -8.09, 0]} args={[50, 30]} cellSize={1} cellThickness={1.5} cellColor="#e2e8f0" sectionSize={5} sectionColor="#cbd5e1" fadeDistance={30} />
      
      <ContactShadows position={[0, -8.08, 0]} opacity={0.4} scale={40} blur={2} far={10} color="#0f172a" />
    </group>
  );
}

// ==========================================
// UI ĐIỀU KHIỂN CHÍNH
// ==========================================
export default function Experiment({ onNext, onPrev }: { onNext: () => void, onPrev: () => void }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [isCameraLocked, setIsCameraLocked] = useState(false);

  const [driver, setDriver] = useState({ length: 5, posX: -3 });
  const [p1, setP1] = useState({ length: 3, posX: 0 });
  const [p2, setP2] = useState({ length: 5, posX: 3 });
  const [p3, setP3] = useState({ length: 7, posX: 6 });

  const handlePlayPause = () => {
    if (typeof window !== 'undefined' && typeof (window as any).playAudio === 'function') {
      (window as any).playAudio('click');
    }
    if (isPlaying) {
      setIsPlaying(false);
      setResetKey(prev => prev + 1);
    } else {
      setIsPlaying(true);
    }
  };

  let resonanceLabels = [];
  if (driver.length === p1.length) resonanceLabels.push("L1");
  if (driver.length === p2.length) resonanceLabels.push("L2");
  if (driver.length === p3.length) resonanceLabels.push("L3");
  const isResonance = resonanceLabels.length > 0;
  const resLabel = resonanceLabels.join(", ");

  const PendulumControl = ({ title, state, setState, colorClass, accentClass }: any) => (
    <div className={`p-4 rounded-xl border bg-white shadow-sm mb-3 ${colorClass}`}>
      <div className="font-bold text-sm mb-3 flex items-center justify-between">
        <span>{title}</span>
      </div>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold w-16 text-slate-500">Dài: {state.length.toFixed(1)}m</span>
          <input 
            type="range" min="2" max="8" step="0.5" value={state.length} disabled={isPlaying}
            onChange={(e) => setState({ ...state, length: Number(e.target.value) })} 
            className={`flex-1 h-1.5 rounded-lg appearance-none cursor-pointer ${isPlaying ? 'bg-slate-200 accent-slate-400' : `bg-slate-200 ${accentClass}`}`} 
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold w-16 text-slate-500">Vị trí: {state.posX.toFixed(1)}m</span>
          <input 
            type="range" min="-6.5" max="6.5" step="0.5" value={state.posX} disabled={isPlaying}
            onChange={(e) => setState({ ...state, posX: Number(e.target.value) })} 
            className={`flex-1 h-1.5 rounded-lg appearance-none cursor-pointer ${isPlaying ? 'bg-slate-200 accent-slate-400' : `bg-slate-200 ${accentClass}`}`} 
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col md:flex-row bg-slate-50 overflow-hidden font-sans">
      
      {/* 3D VIEWPORT */}
      <div className="flex-1 relative bg-slate-100">
        <div className={`w-full h-full ${isCameraLocked ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'}`}>
          <Canvas shadows camera={{ position: [1.5, 3, 26], fov: 40 }} gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }} dpr={[1, 2]}>
            <color attach="background" args={["#f8fafc"]} />
            <fog attach="fog" args={['#f8fafc', 20, 60]} />
            
            <SimulationScene isPlaying={isPlaying} resetKey={resetKey} driver={driver} p1={p1} p2={p2} p3={p3} />
            
            <OrbitControls 
              makeDefault 
              maxPolarAngle={Math.PI/2 - 0.05} 
              target={[0, 0, 0]} 
              enableRotate={!isCameraLocked}
              enableZoom={!isCameraLocked}
              enablePan={!isCameraLocked}
            />
          </Canvas>
        </div>

        <button
          onClick={() => setIsCameraLocked(!isCameraLocked)}
          className={`absolute top-6 right-6 px-4 py-2.5 rounded-xl text-sm font-bold border shadow-sm transition-all flex items-center gap-2 z-10 
            ${isCameraLocked ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100' : 'bg-white/90 backdrop-blur-md text-slate-700 border-slate-200 hover:bg-slate-50'}`}
        >
          <span className="text-lg">{isCameraLocked ? '🔓' : '🔒'}</span>
          {isCameraLocked ? 'Mở khóa' : 'Khóa góc nhìn'}
        </button>
        
        {isPlaying && isResonance && (
          <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md text-amber-600 px-8 py-3 rounded-2xl font-black border-2 border-amber-300 shadow-[0_10px_40px_rgba(245,158,11,0.2)] animate-bounce flex items-center gap-3">
            <span className="text-3xl drop-shadow-md">🔥</span>
            <div>
              <div className="text-xs uppercase tracking-widest text-slate-500">Hiện tượng Cộng hưởng</div>
              <div className="text-lg text-slate-800">Con lắc <span className="text-amber-600">{resLabel}</span> đạt biên độ cực đại!</div>
            </div>
          </div>
        )}
      </div>

      {/* CONTROL PANEL */}
      <div className="w-full md:w-[420px] bg-white border-l border-slate-200 p-5 flex flex-col gap-4 z-10 shadow-xl overflow-y-auto text-slate-700 custom-scrollbar">
        <button 
          onClick={handlePlayPause}
          className={`w-full py-4 font-bold rounded-xl text-white uppercase tracking-wider transition-all duration-300 shadow-md flex-shrink-0 ${isPlaying ? 'bg-rose-500 hover:bg-rose-600' : 'bg-emerald-500 hover:bg-emerald-600'}`}
        >
          {isPlaying ? '⏹ Dừng & Reset' : '▶ Thả Con Lắc Đ'}
        </button>

        {isPlaying && <p className="text-xs text-center text-rose-500 font-medium bg-rose-50 p-2 rounded-lg flex-shrink-0">* Hãy bấm dừng thí nghiệm để tùy chỉnh thông số</p>}

        <div className="flex flex-col gap-1">
          <div className="text-xs font-black text-slate-400 tracking-widest uppercase mb-1 mt-2">Nguồn phát động:</div>
          <PendulumControl title="🔴 Con lắc Đ" state={driver} setState={setDriver} colorClass="border-rose-200 bg-rose-50/30 text-rose-900" accentClass="accent-rose-500" />
          
          <div className="text-xs font-black text-slate-400 tracking-widest uppercase mb-1 mt-2">Hệ thống con lắc thử:</div>
          <PendulumControl title="🔵 L1" state={p1} setState={setP1} colorClass="border-blue-100 text-blue-900" accentClass="accent-blue-500" />
          <PendulumControl title="🟢 L2" state={p2} setState={setP2} colorClass="border-emerald-100 text-emerald-900" accentClass="accent-emerald-500" />
          <PendulumControl title="🟣 L3" state={p3} setState={setP3} colorClass="border-purple-100 text-purple-900" accentClass="accent-purple-500" />
        </div>

        <div className="mt-auto flex gap-3 pt-4 border-t border-slate-100 flex-shrink-0">
          <button onClick={onPrev} className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold uppercase rounded-xl transition-colors">Quay lại</button>
          <button onClick={onNext} className="flex-[1.5] py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-bold uppercase rounded-xl shadow-lg shadow-amber-500/30 transition-all">Kết luận ➔</button>
        </div>
      </div>
    </div>
  );
}