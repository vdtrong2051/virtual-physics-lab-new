import React, { useState, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Text, Trail } from '@react-three/drei';
import { InlineMath } from 'react-katex';

// ==========================================
// THUẬT TOÁN TẠO LÒ XO 3D BẰNG INSTANCED MESH
// (Không bị biến dạng độ dày dây khi co giãn)
// ==========================================
function RealisticSpring({ yBob, amplitude }: { yBob: React.MutableRefObject<number>, amplitude: number }) {
  const COIL_COUNT = 25;
  const CEILING_Y = 4;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    if (!meshRef.current) return;
    const currentY = yBob.current;
    const length = CEILING_Y - currentY;
    
    for (let i = 0; i < COIL_COUNT; i++) {
      const t = i / (COIL_COUNT - 1);
      // Rải đều các vòng lò xo từ trần nhà xuống quả nặng
      dummy.position.set(0, CEILING_Y - t * length, 0);
      dummy.rotation.x = Math.PI / 2;
      // Tạo độ nghiêng nhẹ để mô phỏng đường xoắn ốc
      dummy.rotation.y = Math.sin(t * Math.PI) * 0.3 * (length / 4);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, COIL_COUNT]} castShadow>
      <torusGeometry args={[0.25, 0.03, 16, 32]} />
      <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
    </instancedMesh>
  );
}

// ==========================================
// SCENE 3D CHUẨN AAA 
// ==========================================
function SimulationScene({ isPlaying, speed, amplitude, showRays }: { isPlaying: boolean, speed: number, amplitude: number, showRays: boolean }) {
  const timeRef = useRef(0);
  const pegRef = useRef<THREE.Group>(null);
  const bobRef = useRef<THREE.Group>(null);
  const bobYRef = useRef<number>(4 - amplitude); // Giá trị Y khởi tạo

  // Đích ngắm cho ánh sáng song song (Bắt buộc để bóng in thẳng lên màn)
  const lightTarget = useMemo(() => {
    const obj = new THREE.Object3D();
    obj.position.set(10, 0, 0);
    return obj;
  }, []);

  const materials = useMemo(() => ({
    metal: new THREE.MeshStandardMaterial({ color: '#334155', roughness: 0.2, metalness: 0.8 }),
    rod: new THREE.MeshStandardMaterial({ color: '#cbd5e1', roughness: 0.3, metalness: 0.9 }),
    redGlowing: new THREE.MeshStandardMaterial({ color: '#ef4444', emissive: '#ef4444', emissiveIntensity: 0.4 }),
    blueGlowing: new THREE.MeshStandardMaterial({ color: '#3b82f6', emissive: '#3b82f6', emissiveIntensity: 0.4 }),
    orangeScreen: new THREE.MeshStandardMaterial({ color: '#fdba74', roughness: 0.9, metalness: 0.1 }),
  }), []);

  useFrame((state, delta) => {
    if (isPlaying) timeRef.current += delta * speed;
    const t = timeRef.current;
    
    // PHƯƠNG TRÌNH DAO ĐỘNG: y = A * cos(wt)
    const yPos = amplitude * Math.cos(t);
    const zPos = amplitude * Math.sin(t); 
    bobYRef.current = yPos;

    // Cập nhật vị trí Môtơ (Chuyển động tròn trong mặt phẳng YZ)
    if (pegRef.current) pegRef.current.position.set(0, yPos, zPos);
    
    // Cập nhật vị trí Con lắc (Dao động thẳng dọc trục Y)
    if (bobRef.current) bobRef.current.position.set(0, yPos, 0);
  });

  return (
    <group position={[0, -1, 0]}>
      
      {/* 1. HỆ THỐNG ÁNH SÁNG VẬT LÝ TẠO BÓNG (RAY TRACING) */}
      <primitive object={lightTarget} />
      <directionalLight 
        position={[-15, 0, 0]} 
        target={lightTarget}
        intensity={2.5} 
        castShadow 
        shadow-mapSize={[4096, 4096]} 
        shadow-bias={-0.0005}
      >
        {/* Mở rộng vùng phủ bóng để bao trọn màn hình */}
        <orthographicCamera attach="shadow-camera" args={[-8, 8, 8, -8, 0.1, 40]} />
      </directionalLight>
      <ambientLight intensity={0.6} />
      <Environment preset="apartment" />

      {/* TIA SÁNG ĐỎ (TRỰC QUAN HÓA THEO SÁCH GIÁO KHOA) */}
      {showRays && (
        <group position={[-9, 0, 0]}>
          {[-4, -2, 0, 2, 4].map((y, i) => (
            <mesh key={i} position={[0, y, 0]} rotation={[0, 0, -Math.PI/2]}>
              <cylinderGeometry args={[0.02, 0.02, 10]} />
              <meshBasicMaterial color="#ef4444" transparent opacity={0.6} />
            </mesh>
          ))}
        </group>
      )}

      {/* 2. MÀN CHẮN HỨNG BÓNG (SCREEN) MÀU CAM NHÁM */}
      <group position={[6, 0, 0]} rotation={[0, -Math.PI/2, 0]}>
        <mesh receiveShadow>
          <planeGeometry args={[16, 12]} />
          <primitive object={materials.orangeScreen} attach="material" />
        </mesh>
        
        {/* Lưới Grid và Trục Tọa độ vẽ trực tiếp trên màn */}
        <mesh position={[0, 0, 0.01]}><planeGeometry args={[16, 0.03]} /><meshBasicMaterial color="#c2410c" /></mesh>
        <mesh position={[0, 0, 0.01]}><planeGeometry args={[0.03, 12]} /><meshBasicMaterial color="#c2410c" /></mesh>
        
        <Text position={[0.5, amplitude + 0.3, 0.02]} fontSize={0.5} color="#9a3412" font="https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu4mxM.woff">+A</Text>
        <Text position={[0.5, -amplitude - 0.3, 0.02]} fontSize={0.5} color="#9a3412" font="https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu4mxM.woff">-A</Text>
        <Text position={[-0.5, 0.4, 0.02]} fontSize={0.5} color="#9a3412" font="https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu4mxM.woff">O</Text>
        <Text position={[7, 0.5, 0.02]} fontSize={0.4} color="#9a3412" font="https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu4mxM.woff">Trục x</Text>
      </group>

      {/* 3. CỤM MÔ-TƠ (BÊN TRÁI ĐÓN ÁNH SÁNG) */}
      <group position={[-5, 0, 0]}>
        <mesh position={[0, -2.5, 0]} castShadow><cylinderGeometry args={[0.2, 0.3, 5, 32]} /><primitive object={materials.metal} attach="material" /></mesh>
        <mesh position={[0, 0, 0]} castShadow><boxGeometry args={[1.5, 1.2, 1.2]} /><primitive object={materials.metal} attach="material" /></mesh>
        <mesh position={[1.5, 0, 0]} rotation={[0, 0, Math.PI/2]} castShadow><cylinderGeometry args={[0.08, 0.08, 2, 16]} /><primitive object={materials.rod} attach="material" /></mesh>
        
        {/* Đĩa quay (Tàng hình hoặc trong suốt để không chắn bóng của vật) */}
        <mesh position={[2.5, 0, 0]} rotation={[0, 0, Math.PI/2]}>
          <cylinderGeometry args={[amplitude, amplitude, 0.05, 64]} />
          <meshPhysicalMaterial color="#ffffff" transmission={1} opacity={0.2} transparent depthWrite={false} />
        </mesh>

        {/* Vật hình trụ Đỏ có Hào quang quỹ đạo */}
        <group position={[2.5, 0, 0]}>
          <group ref={pegRef}>
            <Trail width={0.15} color="#ef4444" length={40} decay={1} local={false}>
              <mesh rotation={[0, 0, Math.PI/2]} castShadow>
                <cylinderGeometry args={[0.25, 0.25, 0.8, 32]} />
                <primitive object={materials.redGlowing} attach="material" />
              </mesh>
            </Trail>
          </group>
        </group>
      </group>

      {/* 4. CỤM CON LẮC LÒ XO (NẰM GIỮA) */}
      <group position={[1, 0, 0]}>
        <mesh position={[0, 4.1, 0]} castShadow><boxGeometry args={[2, 0.2, 2]} /><primitive object={materials.metal} attach="material" /></mesh>
        
        <RealisticSpring yBob={bobYRef} amplitude={amplitude} />

        <group ref={bobRef}>
          <Trail width={0.15} color="#3b82f6" length={20} decay={1} local={false}>
            <mesh castShadow>
              <sphereGeometry args={[0.5, 64, 64]} />
              <primitive object={materials.blueGlowing} attach="material" />
            </mesh>
          </Trail>
        </group>
      </group>

    </group>
  );
}

// ==========================================
// GIAO DIỆN ĐIỀU KHIỂN & BỌC NGOÀI
// ==========================================
export default function Experiment({ onNext, onPrev }: { onNext: () => void, onPrev: () => void }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1.5); 
  const [amplitude, setAmplitude] = useState(2.5);
  const [showRays, setShowRays] = useState(true);

  const playClick = () => {
    if (typeof window !== 'undefined' && typeof (window as any).playAudio === 'function') {
      (window as any).playAudio('click');
    }
  };

  return (
    <div className="w-full h-full flex flex-col md:flex-row bg-[#020617] overflow-hidden font-sans">
      
      {/* 3D CANVAS VIEWPORT */}
      <div className="flex-1 relative cursor-grab active:cursor-grabbing">
        <Canvas shadows camera={{ position: [-6, 3, 14], fov: 45 }} gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }} dpr={[1, 2]}>
          <color attach="background" args={["#020617"]} />
          <fog attach="fog" args={['#020617', 15, 40]} />
          
          <SimulationScene isPlaying={isPlaying} speed={speed} amplitude={amplitude} showRays={showRays} />
          
          <OrbitControls makeDefault enablePan={false} minDistance={5} maxDistance={25} maxPolarAngle={Math.PI/2 + 0.1} target={[2, 0, 0]} />
        </Canvas>
        
        {/* Floating Hint */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-slate-800/80 backdrop-blur-md text-white px-6 py-2.5 rounded-full text-sm font-bold border border-slate-700/50 shadow-2xl flex items-center gap-2 pointer-events-none">
          <span className="animate-pulse">👆</span> Hãy xoay góc nhìn để thấy rõ <span className="text-amber-400">BÓNG ĐỔ TRÊN MÀN</span>
        </div>
      </div>

      {/* BẢNG ĐIỀU KHIỂN BÊN PHẢI */}
      <div className="w-full md:w-[380px] bg-slate-900 border-l border-slate-800 p-6 flex flex-col gap-6 z-10 shadow-2xl overflow-y-auto custom-scrollbar text-slate-200">
        
        <div className="bg-indigo-900/40 p-5 rounded-2xl border border-indigo-500/30 shadow-inner">
          <h3 className="font-black text-indigo-300 mb-2 uppercase tracking-wide text-sm flex items-center gap-2">
            <span>👁️</span> Hiện tượng
          </h3>
          <p className="text-sm text-indigo-100/80 leading-relaxed font-medium text-justify">
            Bóng của vật hình trụ và bóng của quả cầu lò xo luôn <strong className="text-amber-400">di chuyển đồng bộ và chồng khít lên nhau</strong> trên trục Ox.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <button 
            onClick={() => { playClick(); setIsPlaying(!isPlaying); }}
            className={`w-full py-4 font-black rounded-xl text-white uppercase tracking-widest transition-all duration-300 ${isPlaying ? 'bg-rose-600 hover:bg-rose-500 shadow-[0_0_30px_rgba(225,29,72,0.4)] scale-[0.98]' : 'bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_30px_rgba(5,150,105,0.4)]'}`}
          >
            {isPlaying ? '⏸ Tạm dừng' : '▶ Chạy Thí nghiệm'}
          </button>
        </div>

        <div className="flex flex-col gap-6 bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-inner">
          
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input type="checkbox" checked={showRays} onChange={() => { playClick(); setShowRays(!showRays); }} className="sr-only" />
              <div className={`block w-12 h-7 rounded-full transition-colors ${showRays ? 'bg-amber-500' : 'bg-slate-600'}`}></div>
              <div className={`absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform ${showRays ? 'translate-x-5' : ''}`}></div>
            </div>
            <span className="text-sm font-bold text-slate-300 uppercase tracking-wider group-hover:text-white">Hiện Chùm Tia Sáng</span>
          </label>

          <hr className="border-slate-700" />

          {/* ĐÃ TÍCH HỢP LATEX CHO OMEGA */}
          <div>
            <label className="text-xs font-black text-slate-400 uppercase flex justify-between mb-3 tracking-widest">
              <span className="normal-case flex items-center gap-1">Tốc độ góc (<InlineMath math="\omega" />)</span>
              <span className="text-emerald-400 bg-emerald-900/50 px-2 py-0.5 rounded-md border border-emerald-500/30">{speed.toFixed(1)} rad/s</span>
            </label>
            <input 
              type="range" min="0.5" max="4" step="0.1" value={speed} 
              onChange={(e) => setSpeed(Number(e.target.value))} 
              className="w-full accent-emerald-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" 
            />
          </div>
          
          {/* ĐÃ TÍCH HỢP LATEX CHO BIÊN ĐỘ A */}
          <div>
            <label className="text-xs font-black text-slate-400 uppercase flex justify-between mb-3 tracking-widest">
              <span className="normal-case flex items-center gap-1">Biên độ (<InlineMath math="A" />)</span>
              <span className="text-emerald-400 bg-emerald-900/50 px-2 py-0.5 rounded-md border border-emerald-500/30">{amplitude.toFixed(1)} m</span>
            </label>
            <input 
              type="range" min="1.5" max="3.5" step="0.5" value={amplitude} 
              onChange={(e) => setAmplitude(Number(e.target.value))} 
              className="w-full accent-emerald-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" 
            />
          </div>
        </div>

        <div className="mt-auto flex gap-3 pt-4">
          <button onClick={() => { playClick(); onPrev(); }} className="flex-1 py-3.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-black uppercase tracking-wider rounded-xl transition-colors text-sm">Quay lại</button>
          <button onClick={() => { playClick(); onNext(); }} className="flex-[1.5] py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-wider rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all text-sm">Kết luận ➔</button>
        </div>
      </div>
    </div>
  );
}