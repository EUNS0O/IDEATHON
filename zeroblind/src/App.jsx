import React, { useState, useMemo, useEffect } from 'react';
import mainMap from "./assets/main_map.png";
import miniMap from "./assets/mini_map.png";

function EvacuationView({ setStep }) {
  const [pos, setPos] = useState({ x: 395, y: 535 });
  const [message, setMessage] = useState("안내하는 경로로 움직이세요");
  const [isPlaying, setIsPlaying] = useState(false);

  // 경로 삭제용 offset
  const [pathOffset, setPathOffset] = useState(0);

  // SVG Path Ref
  const pathRef = React.useRef(null);

  // 실제 path 총 길이
  const [pathLength, setPathLength] = useState(1000);

  // 미니맵 비율
  const MINI_MAP_SCALE_X = 110 / 1200;
  const MINI_MAP_SCALE_Y = 80 / 1000;

  // 경로
  const pathD = `
    M 395 535
    L 455 485
    L 335 435
    L 455 355
    L 455 355
    L 405 315
  `;

  // 실제 SVG Path 길이 계산
  useEffect(() => {
    if (pathRef.current) {
      const total = pathRef.current.getTotalLength();
      setPathLength(total);
    }
  }, []);

  // easing
  const easeLinear = (t) => t;

  // 실시간 경로 제거 애니메이션
  const animateRouteProgress = ({
    fromX,
    fromY,
    toX,
    toY,
    fromOffset,
    toOffset,
    duration,
    onDone
  }) => {
    const start = performance.now();

    const frame = (now) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);

      const eased = easeLinear(t);

      // 지도 위치 보간
      const currentX = fromX + (toX - fromX) * eased;
      const currentY = fromY + (toY - fromY) * eased;

      // 경로 삭제 보간
      const currentOffset =
        fromOffset + (toOffset - fromOffset) * eased;

      setPos({
        x: currentX,
        y: currentY
      });

      setPathOffset(currentOffset);

      if (t < 1) {
        requestAnimationFrame(frame);
      } else {
        onDone?.();
      }
    };

    requestAnimationFrame(frame);
  };

  const startScenario = () => {
    if (isPlaying) return;

    setIsPlaying(true);

    setPos({ x: 395, y: 535 });
    setPathOffset(0);

    const scenario = [
      {
        msg: "앞으로 200m 이동",
        x: 455,
        y: 485,
        dur: 2500,
        progress: 0.23
      },
      {
        msg: "왼쪽으로 꺾으세요",
        x: 335,
        y: 435,
        dur: 2500,
        progress: 0.48
      },
      {
        msg: "리프트를 이용하세요",
        x: 455,
        y: 355,
        dur: 2000,
        progress: 0.82
      },
      {
        msg: "리프트를 이용하세요",
        x: 455,
        y: 355,
        dur: 1000,
        progress: 0.82
      },
      {
        msg: "안전 구역 도착",
        x: 405,
        y: 315,
        dur: 1500,
        progress: 1
      }
    ];

    let currentX = 395;
    let currentY = 535;
    let currentProgress = 0;

    const runStep = (index) => {
      if (index >= scenario.length) {
        setIsPlaying(false);
        return;
      }

      const step = scenario[index];

      setMessage(step.msg);
    

      animateRouteProgress({
        fromX: currentX,
        fromY: currentY,

        toX: step.x,
        toY: step.y,

        fromOffset: pathLength * currentProgress,
        toOffset: pathLength * step.progress,

        duration: step.dur,

        onDone: () => {
          currentX = step.x;
          currentY = step.y;
          currentProgress = step.progress;

          runStep(index + 1);
        }
      });
    };

    runStep(0);
  };

  return (
    <div className="w-full h-full bg-[#F9F9F9] flex flex-col justify-between relative overflow-hidden text-left pb-8">

      {/* [상단 그룹] 로고 아래 여백을 벌려 자연스럽게 카드가 내려오도록 유도 */}
      <div className="pt-[100px] px-[28px] z-30 w-full shrink-0">
        <div className="bg-[#FA5E25] text-white p-4 rounded-[16px] flex items-center gap-3 shadow-lg">
          <div className="bg-white p-2 rounded-full text-xl text-[#FA5E25] w-10 h-10 flex items-center justify-center">
            🔥
          </div>
          <div>
            <h2 className="font-bold text-[16px]">[화재]발생</h2>
            <p className="text-[10px] opacity-90">3분 전 신도림역 대형 화재 발생</p>
          </div>
        </div>
      </div>

      {/* [중앙 지도 영역] ★핵심: flex-1과 py-4를 주어 상하단 바 사이 남는 여백만 온전히 차지하게 함 */}
      <div className="flex-1 w-full px-6 py-4 relative z-20 overflow-hidden min-h-0"> 
        <div className="w-full h-full bg-white rounded-[24px] border border-gray-100 shadow-inner overflow-hidden relative">

          {/* 안내 문구 */}
          <div className="absolute top-4 inset-x-0 mx-auto flex justify-center z-[100] pointer-events-none">
            <div className="bg-white/90 backdrop-blur-md border border-white/60 shadow-md px-4 py-1.5 rounded-[10px] flex items-center justify-center">
              <h3 className="text-center text-[15px] font-[800] text-[#FA5E25] tracking-tighter whitespace-nowrap">
                {message}
              </h3>
            </div>
          </div>

          {/* 이동 그룹 지도의 중심점을 컨테이너 크기에 맞춰 동적으로 중앙 정렬되도록 조정 */}
          <div
            className="absolute top-1/2 left-1/2"
            style={{
              transform: `translate(calc(-50% + ${175 - pos.x}px), calc(-50% + ${200 - pos.y}px))`, 
              width: "1200px",
              height: "1000px",
              willChange: "transform"
            }}
          >
            {/* 메인 지도 */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${mainMap})`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                width: "100%",
                height: "100%"
              }}
            />

            {/* 대피 경로 */}
            <svg className="absolute inset-0 pointer-events-none" viewBox="0 0 1200 1000" style={{ width: "100%", height: "100%" }}>
              <path
                ref={pathRef}
                d={pathD}
                stroke="#FF6A2B"
                strokeWidth="10"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  strokeDasharray: `${pathLength - pathOffset} ${pathLength}`,
                  strokeDashoffset: -pathOffset,
                  opacity: pathOffset >= pathLength - 1 ? 0 : 1, 
                  transition: 'opacity 0.0001s',
                  filter: 'drop-shadow(0 0 2px rgba(255,106,43,0.9)) drop-shadow(0 0 6px rgba(255,106,43,0.5))'
                }}
              />
            </svg>
          </div>

          {/* 미니맵 */}
          <div className="absolute top-4 right-4 z-50 shadow-md border-2 border-white rounded-lg overflow-hidden bg-white/80 backdrop-blur-sm">
            <div className="relative w-[110px] h-[80px]">
              <img src={miniMap} alt="미니맵" className="w-full h-full object-cover opacity-80" />
              <div
                className="absolute border-2 border-blue-500 bg-blue-500/20 rounded-sm"
                style={{
                  width: "35px", height: "25px",
                  left: `${(pos.x * MINI_MAP_SCALE_X)+25}px`, top: `${(pos.y * MINI_MAP_SCALE_Y)-2}px`,
                  transform: "translate(-50%, -50%)"
                }}
              />
            </div>
          </div>

          {/* 재생 버튼 */}
          <button 
            onClick={startScenario} 
            disabled={isPlaying}
            className={`absolute bottom-4 right-4 z-[60] w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${isPlaying ? 'bg-gray-200 text-gray-400' : 'bg-white text-[#FA5E25] active:scale-90'}`}
          >
            {isPlaying ? <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent animate-spin rounded-full" /> : "▶"}
          </button>

          {/* 사용자 위치 마커 (지도의 정중앙에 고정되도록 top-1/2 조정) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none">
            <div className="absolute left-1/2 top-[24px] -translate-x-1/2 w-10 h-4 bg-[#FF6A2B]/25 blur-md rounded-full" />
            <div className="relative w-[34px] h-[34px] bg-[#FF6A2B] rounded-full rotate-45 shadow-lg" style={{ borderBottomRightRadius: "4px" }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full -rotate-45" />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* [하단 버튼 영역] ★핵심: absolute를 배제하고 relative 레이아웃으로 변경해 지도 영역 하단에 깔끔하게 안착시킴 */}
      <div className="relative z-50 flex items-center justify-between px-6 w-full shrink-0 h-[82px] mt-2">
        
        {/* 1. 음성 안내 토글 */}
        <div className="relative flex items-center">
          <div className="w-[115px] h-[40px] bg-white rounded-full shadow-md border border-gray-100 flex items-center justify-between relative">
            <div className="absolute -left-1 w-[54px] h-[54px] bg-[#78A1A6] rounded-full flex items-center justify-center shadow-md z-10">
              <span className="text-white text-[11px] font-bold leading-tight text-center">음성<br/>안내</span>
            </div>
            <div className="flex-1 flex justify-end pr-1">
              <div className="w-[32px] h-[32px] bg-[#D1E5E0] rounded-full" />
            </div>
          </div>
        </div>

        {/* 2. 긴급 전화 버튼 */}
        <button className="w-[82px] h-[82px] bg-[#FF5C28] rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform border-[3px] border-white/20">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="white">
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
          </svg>
        </button>

        {/* 3. 현재위치 재탐색 버튼 */}
        <button className="h-[42px] px-4 bg-[#76BA7E] text-white rounded-full shadow-md flex items-center justify-center active:scale-95 transition-all border border-white/30">
          <span className="text-[14px] font-semibold tracking-tight">현재위치 재탐색</span>
        </button>

      </div>
    </div>
  );
}

export default function App() {
  const [step, setStep] = useState(1);

  return (
    <div className="flex justify-center items-center bg-gray-200 h-screen w-screen font-a2z overflow-hidden antialiased select-none">
      <div className="w-full h-full sm:w-[402px] sm:h-[874px] sm:max-h-[874px] bg-[#F9F9F9] sm:shadow-2xl sm:rounded-[40px] relative flex flex-col overflow-hidden">
        
        {/* --- [공통 헤더] --- */}
        <header className="absolute top-[26px] left-[28px] w-[346px] h-[28px] flex justify-between items-center z-20">
          <div className="flex items-center" style={{ height: '28px' }}>
            <svg width="31.74" height="24.08" viewBox="0 0 31.74 24.08" fill="none">
              <path d="M15.87 2V22.08M2 10.5L15.87 22.08L29.74 10.5" stroke="#FF7E50" strokeWidth="2.86" strokeLinecap="butt" strokeLinejoin="miter"/>
            </svg>
            <span className="text-[#FF7E50] text-[24px] font-[700] tracking-tight whitespace-nowrap leading-none ml-[4.26px]">
              ZEROBlind
            </span>
          </div>
          <div className="flex flex-col gap-1.5 cursor-pointer">
            <div className="w-8 h-[3px] bg-[#FF7E50] rounded-full"></div>
            <div className="w-8 h-[3px] bg-[#FF7E50] rounded-full"></div>
            <div className="w-8 h-[3px] bg-[#FF7E50] rounded-full"></div>
          </div>
        </header>

        {/* --- [재난감지 1번 화면] --- */}
        {step === 1 && (
          <div className="w-full h-full relative animate-in fade-in duration-300">
            <div 
              className="absolute top-[115px] left-1/2 -translate-x-1/2 w-[303px] h-[86px] bg-[#F5F5F5]/95 rounded-[16px] flex items-center p-[12px] pl-[16px] z-40"
              style={{ boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.25)' }}
            >
              <div className="shrink-0">
                 <svg width="39.17" height="35.25" viewBox="0 0 40 36" fill="none">
                    <path d="M20 4L36 32H4L20 4Z" fill="#FFD902" stroke="#FFD902" strokeWidth="4" strokeLinejoin="round"/>
                    <path d="M20 13V22M20 27V28" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                 </svg>
              </div>
              <div className="ml-[10px] w-[234px] h-[65px] flex flex-col justify-center">
                <p className="text-[11px] font-[600] text-black leading-none mb-1">안전안내문자</p>
                <p className="text-[11px] font-[300] text-black leading-[1.3] break-keep">
                  현재 2호선 신도림-대림역 사이 열차에서 화재 발생. 시청역-까치산역 간 열차운행 중단. 해당 구간 다른 교통수단을 이용해 주세요. [서울교통공사]
                </p>
              </div>
            </div>

            <div className="absolute top-[45%] left-1/2 -translate-x-1/2 w-[141px] h-[34.83px] flex justify-between items-center z-10">
              <div className="relative flex items-center justify-center" style={{ width: '34.83px', height: '34.83px' }}>
                <div className="absolute inset-0 bg-[#FFD1C1]/50 rounded-full"></div>
                <div className="absolute bg-[#FFD1C1] rounded-full" style={{ width: '23.03px', height: '23.59px' }}></div>
                <span className="relative z-10 text-white flex items-center justify-center font-[500] text-[14px] opacity-80">1</span>
              </div>
              <div className="w-[19px] h-[1.5px] bg-[#FFD1C1]/30"></div>
              <div className="relative flex items-center justify-center" style={{ width: '34.83px', height: '34.83px' }}>
                <div className="absolute inset-0 bg-[#FFD1C1]/50 rounded-full"></div>
                <div className="absolute bg-[#FFD1C1] rounded-full" style={{ width: '23.03px', height: '23.59px' }}></div>
                <span className="relative z-10 text-white flex items-center justify-center font-[500] text-[14px] opacity-80">2</span>
              </div>
              <div className="w-[19px] h-[1.5px] bg-[#FF7E50]"></div>
              <div className="relative flex items-center justify-center" style={{ width: '34.83px', height: '34.83px' }}>
                <div className="absolute inset-0 bg-[#FF7E50]/50 rounded-full"></div>
                <div className="absolute bg-[#FF7E50] rounded-full shadow-sm" style={{ width: '23.03px', height: '23.59px' }}></div>
                <span className="relative z-10 text-[#FBFBFB] font-[500] text-[14px] leading-none">3</span>
              </div>
            </div>

            <button className="absolute top-[58%] left-1/2 -translate-x-1/2 w-[274px] h-[68px] bg-[#FF7E50] text-[#FBFBFB] rounded-[20px] px-8 flex justify-between items-center shadow-lg active:scale-95 transition-all z-10">
              <span className="text-[15px] font-[500] whitespace-nowrap leading-none flex items-center">위치권한 승인</span>
              <div className="w-[30px] h-[30px] rounded-full border-2 border-white flex items-center justify-center font-[700]">
                <svg width="18" height="16" viewBox="0 0 18 16" fill="none">
                  <path d="M1.5 8.2L6.2 13L16.5 2.5" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </button>

            <button 
              onClick={() => setStep(2)}
              className="absolute bottom-[40px] left-1/2 -translate-x-1/2 w-[338px] h-[68px] bg-[#FF7E50] text-[#FBFBFB] rounded-[20px] font-[600] text-[20px] shadow-xl active:bg-[#e66d45] transition-colors leading-none z-10"
            >
              확인
            </button>
          </div>
        )}

        {/* --- [재난감지 2번 화면] --- */}
        {step === 2 && (
          <div className="w-full h-full relative animate-in fade-in zoom-in duration-300">
            <div className="absolute top-[40%] left-1/2 -translate-x-1/2 w-[278px] h-[196px] bg-[#FA5E25] rounded-[16px] shadow-2xl z-40 overflow-hidden">
              <img src="/fire.png" alt="화재 아이콘" className="absolute object-contain" style={{ top: '20px', left: '20px', width: '37.08px', height: '45.79px' }} />
              <div className="absolute flex items-center justify-center text-[#FBFBFB]" style={{ top: '27px', left: '70px', width: '100px', height: '24px' }}>
                <span className="tracking-tighter whitespace-nowrap flex items-center">
                  <span className="text-[24px] font-[700] mb-[2px]">[</span>
                  <span className="text-[20px] font-[700] mx-[1px]">화재</span>
                  <span className="text-[24px] font-[700] mb-[2pxShort]]">]</span>
                  <span className="text-[18px] font-[600] ml-1">발생</span>
                </span>
              </div>
              <div className="absolute flex flex-col items-center justify-center text-[#FBFBFB]" style={{ top: '65px', left: '59px', width: '160px', height: '50px' }}>
                <p className="text-[16px] font-[600] text-center leading-[1.3] tracking-tight whitespace-pre-line">
                 신도림역 인근 화재,{"\n"}현재위치 500m 앞
                </p>
              </div>
              <button onClick={()=>setStep(3)} className="absolute bottom-[33px] left-1/2 -translate-x-1/2 w-[130px] h-[44px] bg-[#FBFBFB] text-[#FA5E25] rounded-[10px] shadow-sm active:scale-95 transition-all">
                <span className="text-[15px] font-[600] leading-none tracking-tighter">지금 대피 시작</span>
              </button>
              <button className="absolute bottom-[14px] left-1/2 -translate-x-1/2 flex items-center gap-1 text-[#FBFBFB] opacity-90">
                <div className="w-[12px] h-[12px] rounded-full border border-white flex items-center justify-center text-[8px] font-bold">i</div>
                <span className="text-[10px] font-[400] whitespace-nowrap tracking-tight">상세보기</span>
              </button>
            </div>
            <button onClick={() => setStep(1)} className="absolute bottom-5 left-1/2 -translate-x-1/2 text-gray-400 text-[10px] underline z-50">
               이전 화면으로
            </button>
          </div>
        )}

        {/* --- [Step 3: 대피 안내] --- */}
        {step === 3 && <EvacuationView setStep={setStep} />}
      </div>
    </div>
  );
}