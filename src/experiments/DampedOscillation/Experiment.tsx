import React, { useState, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Grid } from '@react-three/drei';
import { InlineMath, BlockMath } from 'react-katex';

// ==========================================
// COMPONENT VẼ ĐỒ THỊ 2D BẰNG SVG SIÊU NÉT
// ==========================================
function MathGraph({ damping }: { damping: number }) {
  const width = 500;
  const height = 180;
  const padding = 20;

  const A0 = 3;
  const omega = 5;
  const maxTime = 12; 

  const points = [];
  const envelopeTop = [];
  const envelopeBottom = [];
  const steps = 300; // Độ mịn của đồ thị

  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * maxTime;
    
    // Phương trình dao động tắt dần
    const x = A0 * Math.exp(-damping * t) * Math.cos(omega * t);
    // Phương trình đường bao biên độ (Amplitude envelope)
    const env = A0 * Math.exp(-damping * t);

    const svgX = padding + (t / maxTime) * (width - 2 * padding);
    
    // Ánh xạ tọa độ Y (0 nằm ở giữa trục)
    const mapY = (val: number) => height / 2 - (val / A0) * ((height - 2 * padding) / 2);

    points.push(`${svgX},${mapY(x)}`);
    envelopeTop.push(`${svgX},${mapY(env)}`);
    envelopeBottom.push(`${svgX},${mapY(-env)}`);
  }

  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 shadow-inner overflow-hidden relative">
      <div className="absolute top-2 left-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest z-10">Đồ thị 2D trục chuẩn</div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto drop-shadow-sm">
        {/* Lưới nền (Grid) */}
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#f1f5f9" strokeWidth="2" />
        <line x1={padding} y1={height/2} x2={width - padding} y2={height/2} stroke="#cbd5e1" strokeWidth="2" />
        
        {/* Đường bao biên độ (Giúp học sinh thấy rõ sự tắt dần) */}
        <polyline points={envelopeTop.join(' ')} fill="none" stroke="#f43f5e" strokeDasharray="4 4" strokeWidth="1.5" opacity="0.6" />
        <polyline points={envelopeBottom.join(' ')} fill="none" stroke="#f43f5e" strokeDasharray="4 4" strokeWidth="1.5" opacity="0.6" />
        
        {/* Đường đồ thị chính */}
        <polyline points={points.join(' ')} fill="none" stroke="#1d4ed8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

// ==========================================
// THUẬT TOÁN ĐỒ THỊ 3D VÀ CẤU HÌNH
// ==========================================
const MAX_POINTS = 10000; 

function SimulationScene({ isPlaying, damping, paperSpeed }: { isPlaying: boolean, damping: number, paperSpeed: number }) {
  const timeRef = useRef(0);
  const paperZRef = useRef(0);
  
  const pendulumRef = useRef<THREE.Group>(null);
  const paperGroupRef = useRef<THREE.Group>(null);
  const rollerRef = useRef<THREE.Mesh>(null);
  
  const positions = useMemo(() => new Float32Array(MAX_POINTS * 3), []);
  const lineGeoRef = useRef<THREE.BufferGeometry>(null);
  const drawCount = useRef(0);

  const materials = useMemo(() => ({
    metal: new THREE.MeshStandardMaterial({ color: '#94a3b8', roughness: 0.2, metalness: 0.8 }), 
    wood: new THREE.MeshStandardMaterial({ color: '#fcd34d', roughness: 0.8 }), 
    bob: new THREE.MeshStandardMaterial({ color: '#ef4444', roughness: 0.3, metalness: 0.3 }), 
    paper: new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 1 }), 
    pen: new THREE.MeshStandardMaterial({ color: '#1d4ed8' }), 
  }), []);

  useFrame((state, delta) => {
    if (!isPlaying) return;

    timeRef.current += delta;
    const t = timeRef.current;
    
    paperZRef.current += delta * paperSpeed;
    
    if (rollerRef.current) {
      rollerRef.current.rotation.x -= (delta * paperSpeed) / 0.2; 
    }
    
    const omega = 5;
    const A0 = 3;
    const currentX = A0 * Math.exp(-damping * t) * Math.cos(omega * t);
    const L = 7.94; 
    const angle = Math.asin(currentX / L); 

    if (pendulumRef.current) {
      pendulumRef.current.rotation.z = angle;
      pendulumRef.current.scale.y = 1 / Math.cos(angle);
    }

    if (paperGroupRef.current) paperGroupRef.current.position.z = paperZRef.current;

    if (drawCount.current < MAX_POINTS) {
      const idx = drawCount.current * 3;
      positions[idx] = currentX;             
      positions[idx + 1] = 0.06;             
      positions[idx + 2] = -paperZRef.current; 

      drawCount.current++;
      
      if (lineGeoRef.current) {
        lineGeoRef.current.setDrawRange(0, drawCount.current);
        lineGeoRef.current.attributes.position.needsUpdate = true;
      }
    }
  });

  return (
    <group position={[0, -1, 0]}>
      <directionalLight position={[10, 15, 10]} intensity={1.5} castShadow shadow-mapSize={[2048, 2048]} shadow-bias={-0.0001} />
      <ambientLight intensity={0.6} />
      <Environment preset="apartment" />

      <group position={[0, 0, 0]}>
        <mesh position={[-4.5, 4, 0]} castShadow><cylinderGeometry args={[0.15, 0.15, 8]} /><primitive object={materials.metal} attach="material" /></mesh>
        <mesh position={[-4.5, 0, 0]} castShadow><boxGeometry args={[1.5, 0.2, 1.5]} /><primitive object={materials.wood} attach="material" /></mesh>
        <mesh position={[0, 8, 0]} rotation={[0, 0, Math.PI/2]} castShadow><cylinderGeometry args={[0.1, 0.1, 9]} /><primitive object={materials.metal} attach="material" /></mesh>
      </group>

      <group position={[0, 8, 0]} ref={pendulumRef}>
        <mesh position={[0, -3.4, 0]} castShadow><cylinderGeometry args={[0.015, 0.015, 6.8]} /><meshStandardMaterial color="#64748b" /></mesh>
        <mesh position={[0, -6.8, 0]} castShadow><sphereGeometry args={[0.5, 32, 32]} /><primitive object={materials.bob} attach="material" /></mesh>
        <mesh position={[0, -7.37, 0]} castShadow><cylinderGeometry args={[0.04, 0.02, 1.14]} /><primitive object={materials.pen} attach="material" /></mesh>
      </group>

      <group>
        <mesh ref={rollerRef} position={[0, -0.1, 0]} rotation={[0, 0, Math.PI/2]} receiveShadow castShadow>
          <cylinderGeometry args={[0.2, 0.2, 8.2, 32]} />
          <primitive object={materials.metal} attach="material" />
        </mesh>
        <group ref={paperGroupRef}>
          <mesh position={[0, 0, -40]} receiveShadow><boxGeometry args={[8, 0.1, 80]} /><primitive object={materials.paper} attach="material" /></mesh>
          <Grid position={[0, 0.05, -40]} args={[8, 80]} cellSize={0.5} cellThickness={1.5} cellColor="#e2e8f0" sectionSize={2} sectionColor="#cbd5e1" fadeDistance={40} />
          
          <line frustumCulled={false}>
            <bufferGeometry ref={lineGeoRef}>
              <bufferAttribute attach="attributes-position" count={MAX_POINTS} array={positions} itemSize={3} />
            </bufferGeometry>
            <lineBasicMaterial color="#1d4ed8" linewidth={3} />
          </line>
        </group>
      </group>

      <ContactShadows position={[0, -0.21, 0]} opacity={0.4} scale={30} blur={1.5} far={4} />
    </group>
  );
}

// ==========================================
// GIAO DIỆN ĐIỀU KHIỂN & CHỤP ẢNH ĐỐI CHIẾU
// ==========================================
export default function Experiment({ onNext, onPrev }: { onNext: () => void, onPrev: () => void }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [damping, setDamping] = useState(0.12); 
  const [paperSpeed, setPaperSpeed] = useState(3.5);
  const [hasStarted, setHasStarted] = useState(false);
  const [resetKey, setResetKey] = useState(0); 
  const [isCameraLocked, setIsCameraLocked] = useState(false);

  const [snapshots, setSnapshots] = useState<{ url: string, damping: number }[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (!hasStarted) setHasStarted(true);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setHasStarted(false);
    setResetKey(prev => prev + 1);
  };

  const captureSnapshot = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      setSnapshots(prev => {
        const newSnaps = [...prev, { url, damping }];
        if (newSnaps.length > 2) newSnaps.shift(); 
        return newSnaps;
      });
    }
  };

  const clearSnapshots = () => setSnapshots([]);

  return (
    <div className="w-full h-full flex flex-col md:flex-row bg-slate-50 overflow-hidden font-sans">
      
      {/* --- POPUP ĐỐI CHIẾU ẢNH (MODAL CẢI TIẾN THÊM ĐỒ THỊ 2D) --- */}
      {showComparison && snapshots.length > 0 && (
        <div className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-8 w-full max-w-7xl shadow-2xl flex flex-col gap-6 animate-in fade-in zoom-in duration-300 max-h-[95vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-2xl font-black text-slate-800 uppercase tracking-wide">
                📊 Đối chiếu biên độ dao động tắt dần
              </h2>
              <button 
                onClick={() => setShowComparison(false)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-700 font-bold rounded-xl transition-colors"
              >
                ✕ Đóng lại
              </button>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8">
              {snapshots.map((snap, index) => (
                <div key={index} className="flex-1 flex flex-col gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-slate-400 uppercase text-sm tracking-widest">Trường hợp {index + 1}</span>
                    <span className="font-black text-blue-600 bg-blue-100 px-4 py-1.5 rounded-lg text-xl border border-blue-200">
                      <InlineMath math="\beta =" /> {snap.damping.toFixed(2)}
                    </span>
                  </div>
                  
                  {/* Ảnh 3D */}
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                    <div className="absolute top-2 left-2 bg-black/50 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-md">Góc nhìn 3D</div>
                    <img src={snap.url} alt={`Snapshot ${index + 1}`} className="w-full object-cover aspect-video" />
                  </div>

                  {/* Đồ thị 2D Ngay ngắn */}
                  <MathGraph damping={snap.damping} />
                </div>
              ))}

              {snapshots.length === 1 && (
                <div className="flex-1 flex flex-col justify-center items-center gap-4 bg-slate-100/50 border-2 border-dashed border-slate-300 rounded-2xl p-8 text-slate-400">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm text-4xl mb-2">📸</div>
                  <p className="font-black text-xl text-slate-500">Đang chờ hình ảnh đối chiếu</p>
                  <p className="text-sm text-center font-medium max-w-[250px]">Hãy đóng bảng này lại, thay đổi thanh trượt <strong className="text-blue-500">Hệ số lực cản</strong> và bấm chụp thêm một bức nữa.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* KHU VỰC 3D (BÊN TRÁI) */}
      <div className="flex-1 relative bg-slate-100">
        <div className={`w-full h-full ${isCameraLocked ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'}`}>
          <Canvas gl={{ preserveDrawingBuffer: true }} shadows camera={{ position: [9, 6, 9], fov: 40 }} dpr={[1, 2]}>
            <color attach="background" args={["#f1f5f9"]} />
            <fog attach="fog" args={['#f1f5f9', 15, 45]} />
            <SimulationScene key={resetKey} isPlaying={isPlaying} damping={damping} paperSpeed={paperSpeed} />
            <OrbitControls 
              makeDefault maxPolarAngle={Math.PI/2 - 0.05} target={[0, 0, -2]} 
              enableRotate={!isCameraLocked} enableZoom={!isCameraLocked} enablePan={!isCameraLocked}
            />
          </Canvas>
        </div>
        
        <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md text-slate-700 px-6 py-2.5 rounded-full text-sm font-semibold border border-slate-200 shadow-sm pointer-events-none flex items-center gap-2 transition-all">
          {isCameraLocked ? (
            <><span className="text-xl">🔒</span> Góc nhìn đã được cố định</>
          ) : (
            <><span className="text-xl">🖱️</span> Giữ chuột để xoay và xem chi tiết đồ thị</>
          )}
        </div>

        <button
          onClick={() => setIsCameraLocked(!isCameraLocked)}
          className={`absolute top-6 right-6 px-4 py-2.5 rounded-xl text-sm font-bold border shadow-sm transition-all flex items-center gap-2 z-10 
            ${isCameraLocked ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' : 'bg-white/90 backdrop-blur-md text-slate-700 border-slate-200 hover:bg-slate-50'}`}
        >
          <span className="text-lg">{isCameraLocked ? '🔓' : '🔒'}</span>
          {isCameraLocked ? 'Mở khóa' : 'Khóa góc nhìn'}
        </button>
      </div>

      {/* KHU VỰC BẢNG ĐIỀU KHIỂN (BÊN PHẢI) */}
      <div className="w-full md:w-[400px] bg-white border-l border-slate-200 p-6 flex flex-col gap-6 z-10 shadow-xl overflow-y-auto">
        <div className="flex gap-3">
          <button 
            onClick={handlePlayPause}
            className={`flex-[2] py-4 font-bold rounded-xl text-white uppercase tracking-wider transition-all shadow-md ${isPlaying ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-500 hover:bg-emerald-600'}`}
          >
            {isPlaying ? '⏸ Tạm dừng' : (hasStarted ? '▶ Tiếp tục' : '▶ Bắt đầu')}
          </button>
          <button 
            onClick={handleReset} 
            className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl uppercase transition-colors border border-slate-200"
          >
            ↺ Chạy lại
          </button>
        </div>

        <div className="flex flex-col gap-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <label className="text-sm font-bold text-slate-700 flex justify-between mb-3">
              <span>Hệ số lực cản (<InlineMath math="\beta" />)</span>
              <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{damping.toFixed(2)}</span>
            </label>
            <input 
              type="range" min="0.05" max="0.4" step="0.01" value={damping} 
              disabled={hasStarted}
              onChange={(e) => setDamping(Number(e.target.value))} 
              className={`w-full h-2 rounded-lg cursor-pointer appearance-none ${hasStarted ? 'bg-slate-200 accent-slate-400' : 'bg-slate-200 accent-blue-600'}`} 
            />
          </div>
          <div>
            <label className="text-sm font-bold text-slate-700 flex justify-between mb-3">
              <span>Tốc độ cuộn giấy (<InlineMath math="v" />)</span>
              <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{paperSpeed.toFixed(1)} cm/s</span>
            </label>
            <input 
              type="range" min="1" max="6" step="0.5" value={paperSpeed} 
              disabled={hasStarted}
              onChange={(e) => setPaperSpeed(Number(e.target.value))} 
              className={`w-full h-2 rounded-lg cursor-pointer appearance-none ${hasStarted ? 'bg-slate-200 accent-slate-400' : 'bg-slate-200 accent-blue-600'}`} 
            />
          </div>
        </div>

        {/* TRẠM THU THẬP DỮ LIỆU ĐỐI CHIẾU */}
        <div className="flex flex-col gap-3 bg-indigo-50 p-5 rounded-2xl border border-indigo-100">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-indigo-900 text-sm uppercase">📸 Thu thập dữ liệu ({snapshots.length}/2)</h3>
            {snapshots.length > 0 && (
              <button onClick={clearSnapshots} className="text-xs font-bold text-indigo-500 hover:text-indigo-700 underline">Xóa ảnh</button>
            )}
          </div>
          
          <button 
            onClick={captureSnapshot}
            className="w-full py-3 bg-white hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            Chụp đồ thị hiện tại
          </button>

          {snapshots.length > 0 && (
            <button 
              onClick={() => setShowComparison(true)}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors shadow-md mt-1 animate-in slide-in-from-bottom-2"
            >
              Mở bảng đối chiếu ➔
            </button>
          )}
        </div>

        <div className="mt-auto flex gap-3 pt-4 border-t border-slate-100">
          <button onClick={onPrev} className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold uppercase rounded-xl transition-colors">Quay lại</button>
          <button onClick={onNext} className="flex-[1.5] py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase rounded-xl shadow-lg shadow-blue-600/30 transition-all">Kết luận ➔</button>
        </div>
      </div>
    </div>
  );
}