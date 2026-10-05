import {
  BlockMath,
  InlineMath,
} from "react-katex";

export default function Intro({
  onNext,
}: {
  onNext: () => void;
}) {
  return (
    <div className="relative w-full h-full min-h-screen bg-[#020617] flex items-center justify-center p-6 md:p-12 font-sans overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-30 pointer-events-none" />

      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-5xl flex flex-col gap-8">
        <header className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-bold uppercase tracking-[0.2em]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />

              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
            </span>

            Chuyên đề Dao động cơ
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Dao Động Điều Hòa
            <br />

            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-cyan-300 to-blue-500">
              & Chuyển Động Tròn Đều
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-slate-400 text-sm md:text-base leading-relaxed">
            Quan sát chuyển động tròn đều và hình
            chiếu của vật lên một đường kính để
            nhận ra mối liên hệ hình học với dao
            động điều hòa.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <article className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 p-7 md:p-8 rounded-3xl shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-300 text-2xl mb-5">
              ◯
            </div>

            <h2 className="text-xl font-bold text-white mb-3">
              Hình chiếu của chuyển động tròn đều
            </h2>

            <p className="text-slate-400 text-sm md:text-base leading-relaxed">
              Khi một chất điểm chuyển động tròn
              đều, hình chiếu của nó lên một đường
              kính dao động qua lại quanh vị trí
              cân bằng và thực hiện dao động điều
              hòa.
            </p>
          </article>

          <article className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 p-7 md:p-8 rounded-3xl shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-300 text-2xl mb-5">
              ↕
            </div>

            <h2 className="text-xl font-bold text-white mb-3">
              Các đại lượng tương ứng
            </h2>

            <ul className="space-y-3 text-slate-400 text-sm md:text-base leading-relaxed">
              <li>
                Bán kính quỹ đạo{" "}
                <InlineMath math="R" /> tương ứng
                với biên độ{" "}
                <InlineMath math="A" />.
              </li>

              <li>
                Tốc độ góc của chuyển động tròn
                tương ứng với tần số góc{" "}
                <InlineMath math="\omega" /> của
                dao động điều hòa.
              </li>

              <li>
                Góc ban đầu tương ứng với pha ban
                đầu{" "}
                <InlineMath math="\varphi" />.
              </li>
            </ul>
          </article>

          <article className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center bg-gradient-to-r from-indigo-900/40 to-slate-900/60 backdrop-blur-xl border border-indigo-500/30 p-7 md:p-8 rounded-3xl shadow-2xl">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.2em] text-indigo-300">
                Phương trình liên hệ
              </span>

              <h2 className="text-2xl font-black text-white mt-2 mb-3">
                Phương trình dao động điều hòa
              </h2>

              <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                Trong thí nghiệm, vật chuyển động
                tròn và vật dao động được cho chạy
                đồng thời. Khi quan sát hình chiếu
                của chúng trên cùng một trục, ta
                có thể trực tiếp kiểm chứng mối
                liên hệ giữa hai chuyển động.
              </p>
            </div>

            <div className="bg-[#020617]/80 border border-indigo-500/30 rounded-2xl p-5 md:p-6 text-indigo-200 text-center overflow-x-auto shadow-inner">
              <div className="text-lg md:text-2xl min-w-max">
                <BlockMath math="x = A\cos(\omega t + \varphi)" />
              </div>
            </div>
          </article>
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={onNext}
            className="group inline-flex items-center justify-center gap-3 px-8 md:px-10 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-wider shadow-lg shadow-indigo-900/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Chuẩn bị thí nghiệm

            <span
              aria-hidden="true"
              className="group-hover:translate-x-1 transition-transform"
            >
              →
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}