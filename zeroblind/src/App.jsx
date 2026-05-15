

import React, { useState } from 'react';

function EvacuationView({ setStep }) {
  // 1. 상태 관리
  const [pos, setPos] = useState({ x: -60, y: -280 }); 
  const [message, setMessage] = useState("안내하는 경로로 움직이세요");
  const [subMessage, setSubMessage] = useState("대피 시뮬레이션을 시작합니다");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  
  // ★ 마커 이동 시간과 선 사라지는 시간을 동기화하기 위한 상태
  const [transitionTime, setTransitionTime] = useState(2000);

  // 2. 전체 경로 좌표 (은수님과 맞춘 최종본)
  const fullPath = [
    "M 395 535", 
    "L 455 485", 
    "L 335 435", 
    "L 455 355", 
    "L 455 355", 
    "L 405 315"
  ];

  // 3. 시나리오 실행 함수
  const startScenario = () => {
    if (isPlaying) return;
    setIsPlaying(true);
    setCurrentStep(0);

    // 각 구간별 이동 시간(duration)을 명시하여 동기화 정밀도를 높임
    const scenario = [
      { time: 0, msg: "안내하는 경로로 움직이세요", sub: "대피 시뮬레이션을 시작합니다", x: -60, y: -280, step: 0, duration: 0 },
      { time: 2500, msg: "앞으로 200m 이동", sub: "복도를 따라 직진하세요", x: -120, y: -210, step: 1, duration: 2500 },
      { time: 5000, msg: "왼쪽으로 꺾으세요", sub: "역무실 방향으로 회전하세요", x: -45, y: -180, step: 2, duration: 2500 },
      { time: 7000, msg: "리프트를 이용하세요", sub: "1번 출구 리프트 방향으로 이동합니다", x: -125, y: -100, step: 3, duration: 2000 },
      { time: 8000, msg: "리프트를 이용하세요", sub: "출구 방향으로 이동합니다", x: -125, y: -100, step: 4, duration: 1000 },
      { time: 8500, msg: "안전 구역에 도착했습니다", sub: "구조 대원의 안내를 기다리세요", x: -95, y: -65, step: 5, duration: 500 }
    ];

    scenario.forEach(({ time, msg, sub, x, y, step, duration }) => {
      setTimeout(() => {
        setTransitionTime(duration); // 애니메이션 지속 시간을 구간 속도에 맞춤
        setMessage(msg);
        setSubMessage(sub);
        setPos({ x, y });
        setCurrentStep(step);
        
        if (step === 5) {
          setTimeout(() => setIsPlaying(false), duration + 500);
        }
      }, time);
    });
  };

  // 실시간 선 줄어들기 오프셋 계산 (전체 단계 5 기준)
  const offsetValue = (currentStep / 5) * 1000;

  return (
    <div className="w-full h-full bg-[#F9F9F9] flex flex-col relative animate-in fade-in duration-500 overflow-hidden text-left">
      
      {/* 상단 화재 알림 바 */}
      <div className="mt-[100px] mx-[28px] bg-[#FA5E25] text-white p-4 rounded-[16px] flex items-center gap-3 shadow-lg z-30">
        <div className="bg-white p-2 rounded-full text-xl text-[#FA5E25] w-10 h-10 flex items-center justify-center">🔥</div>
        <div>
          <h2 className="font-bold text-[16px]">[화재]발생</h2>
          <p className="text-[10px] opacity-90">3분 전 신도림역 B1 대합실 대형 화재 발생</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col mt-2 relative z-20">
        <div className="relative mx-6 flex-1 max-h-[440px] bg-white rounded-[24px] border border-gray-100 shadow-inner overflow-hidden">
          
          {/* 안내 문구 */}
          <div className="absolute top-4 inset-x-0 mx-auto w-[85%] z-50 pointer-events-none">
            <div className="bg-white/85 backdrop-blur-md border border-[#FA5E25]/10 p-3 rounded-[18px] shadow-lg text-center">
              <h3 className="text-[18px] font-bold text-[#FA5E25]">{message}</h3>
              <p className="text-[11px] text-gray-500 mt-0.5">{subMessage}</p>
            </div>
          </div>

          {/* [Moving Group] 지도와 선의 애니메이션 속도를 transitionTime으로 동기화 */}
          <div 
            className="absolute"
            style={{ 
              transition: `transform ${transitionTime}ms ease-in-out`,
              transform: `translate(${pos.x}px, ${pos.y}px)`,
              width: '1200px', height: '1000px',
              top: '-50px', left: '-150px'
            }}
          >
            <div 
              className="absolute inset-0"
              style={{ 
                backgroundImage: `url('/src/assets/main_map.png')`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                width: '100%', height: '100%'
              }}
            />

            <svg 
              className="absolute inset-0 pointer-events-none" 
              viewBox="0 0 1200 1000"
              style={{ width: '100%', height: '100%' }}
            >
              <path 
                d={fullPath.join(" ")} 
                stroke="#FA5E25" 
                strokeWidth="15" 
                fill="none" 
                strokeLinecap="round"
                strokeLinejoin="round"
                className="drop-shadow-[0_0_12px_rgba(250,94,37,0.9)]"
                style={{ 
                  strokeDasharray: 1000, 
                  strokeDashoffset: offsetValue,
                  // 지도가 움직이는 시간과 동일하게 설정하여 실시간 동기화
                  transition: `stroke-dashoffset ${transitionTime}ms ease-in-out`
                }} 
              />
            </svg>
          </div>

          {/* 미니맵 */}
          <div className="absolute top-4 right-4 z-50 shadow-md border-2 border-white rounded-lg overflow-hidden bg-white/80 backdrop-blur-sm">
            <div className="relative w-[110px] h-[80px]">
              <img src="/src/assets/mini_map.png" alt="미니맵" className="w-full h-full object-cover opacity-80" />
              <div 
                className="absolute border-2 border-blue-500 bg-blue-500/20"
                style={{
                  width: '35px', height: '25px', top: '18px', left: '38px',
                  transition: `transform ${transitionTime}ms ease-in-out`,
                  transform: `translate(${-pos.x * 0.12}px, ${-pos.y * 0.12}px)`
                }}
              />
            </div>
          </div>

          {/* 사용자 위치 마커 (중앙 고정) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none">
            <div className="relative">
              <div className="w-5 h-5 bg-[#007AFF] rounded-full border-4 border-white shadow-lg animate-bounce" />
              <div className="absolute -top-1 w-5 h-5 bg-[#007AFF] rounded-full opacity-30 animate-ping" />
            </div>
          </div>
        </div>
      </div>

      {/* 하단 컨트롤 영역 */}
      <div className="py-8 px-6 flex flex-col items-center gap-4 z-30">
        <button 
          onClick={startScenario}
          disabled={isPlaying}
          className={`w-full max-w-[240px] py-4 rounded-full font-bold shadow-xl transition-all ${
            isPlaying ? 'bg-gray-300 text-gray-600' : 'bg-[#FA5E25] text-white active:scale-95'
          }`}
        >
          {isPlaying ? '시뮬레이션 진행 중...' : '▶ 전체 시나리오 재생'}
        </button>
        <button onClick={() => setStep(1)} className="text-gray-400 text-[11px] underline">
          처음 화면으로
        </button>
      </div>
    </div>
  );
}

export default function App() {
  // step 1: 재난감지 1번 (기본) / step 2: 재난발생 안내 (오렌지 카드)
  const [step, setStep] = useState(1);

  return (
    /* 프로젝트 전체 A2Z 폰트 적용 */
    <div className="flex justify-center bg-gray-200 min-h-screen font-a2z overflow-hidden antialiased">
      
      {/* 전체 화면 프레임: 402px x 874px (하얀 배경 고정) */}
      <div className="w-[402px] h-[874px] bg-[#F9F9F9] shadow-2xl relative flex flex-col overflow-hidden">
        
        {/* --- [공통 헤더]: 로고 화살표 라운드 제거 및 고정 배치 --- */}
        <header className="absolute top-[26px] left-[28px] w-[346px] h-[28px] flex justify-between items-center z-20">
          <div className="flex items-center" style={{ height: '28px' }}>
            <svg width="31.74" height="24.08" viewBox="0 0 31.74 24.08" fill="none">
              <path 
                d="M15.87 2V22.08M2 10.5L15.87 22.08L29.74 10.5" 
                stroke="#FF7E50" 
                strokeWidth="2.86" 
                strokeLinecap="butt" 
                strokeLinejoin="miter"
              />
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

        {/* --- [재난감지 1번 화면: 기존 코드 절대 보존] --- */}
        {step === 1 && (
          <div className="w-full h-full relative animate-in fade-in duration-300">
            <div 
              className="absolute top-[17px] left-[49px] w-[303px] h-[86px] bg-[#F5F5F5]/95 rounded-[16px] flex items-center p-[12px] pl-[16px] z-40"
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

            <div className="absolute top-[320px] left-[130.5px] w-[141px] h-[34.83px] flex justify-between items-center z-10">
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

            <button className="absolute top-[428px] left-[64px] w-[274px] h-[68px] bg-[#FF7E50] text-[#FBFBFB] rounded-[20px] px-8 flex justify-between items-center shadow-lg active:scale-95 transition-all z-10">
              <span className="text-[15px] font-[500] whitespace-nowrap leading-none flex items-center">위치권한 승인</span>
              <div className="w-[30px] h-[30px] rounded-full border-2 border-white flex items-center justify-center font-[700]">
                <svg width="18" height="16" viewBox="0 0 18 16" fill="none">
                  <path d="M1.5 8.2L6.2 13L16.5 2.5" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </button>

            <button 
              onClick={() => setStep(2)}
              className="absolute bottom-[33px] left-[32px] w-[338px] h-[68px] bg-[#FF7E50] text-[#FBFBFB] rounded-[20px] font-[600] text-[20px] shadow-xl active:bg-[#e66d45] transition-colors leading-none z-10"
            >
              확인
            </button>
          </div>
        )}

        {/* --- [재난감지 2번 화면: 대괄호 및 아이콘 정밀 수정] --- */}
        {step === 2 && (
          <div className="w-full h-full relative animate-in fade-in zoom-in duration-300">
            
            <div 
              className="absolute top-[357px] left-[62px] w-[278px] h-[196px] bg-[#FA5E25] rounded-[16px] shadow-2xl z-40 overflow-hidden"
            >
              {/* [방법] public 폴더의 fire.png를 불러와 정확한 수치로 배치 */}
              <img 
                src="/fire.png" 
                alt="화재 아이콘"
                className="absolute object-contain"
                style={{ top: '20px', left: '20px', width: '37.08px', height: '45.79px' }}
              />

              {/* [수정] [화재]발생 문구: 대괄호[]를 텍스트보다 훨씬 크게(24px) 조정 */}
              <div 
                className="absolute flex items-center justify-center text-[#FBFBFB]"
                style={{ top: '27px', left: '70px', width: '100px', height: '24px' }}
              >
                <span className="tracking-tighter whitespace-nowrap flex items-center">
                  {/* 대괄호: 24px Bold */}
                  <span className="text-[24px] font-[700] mb-[2px]">[</span>
                  {/* 화재: 20px Bold */}
                  <span className="text-[20px] font-[700] mx-[1px]">화재</span>
                  <span className="text-[24px] font-[700] mb-[2px]">]</span>
                  {/* 발생: 18px Medium */}
                  <span className="text-[18px] font-[600] ml-1">발생</span>
                </span>
              </div>

              {/* 본문 문구 */}
              <div 
                className="absolute flex flex-col items-center justify-center text-[#FBFBFB]"
                style={{ top: '65px', left: '59px', width: '160px', height: '50px' }}
              >
                <p className="text-[16px] font-[600] text-center leading-[1.3] tracking-tight whitespace-pre-line">
                 신도림역 인근 화재,{"\n"}현재위치 500m 앞
                </p>
              </div>

              {/* 지금 대피 시작 버튼 */}
              <button onClick={()=>setStep(3)}
                className="absolute bottom-[33px] left-1/2 -translate-x-1/2 w-[130px] h-[44px] bg-[#FBFBFB] text-[#FA5E25] rounded-[10px] shadow-sm active:scale-95 transition-all"
              >
                <span className="text-[15px] font-[600] leading-none tracking-tighter">지금 대피 시작</span>
              </button>

              {/* 상세보기 */}
              <button className="absolute bottom-[14px] left-1/2 -translate-x-1/2 flex items-center gap-1 text-[#FBFBFB] opacity-90">
                <div className="w-[12px] h-[12px] rounded-full border border-white flex items-center justify-center text-[8px] font-bold">i</div>
                <span className="text-[10px] font-[400] whitespace-nowrap tracking-tight">상세보기</span>
              </button>
            </div>

            <button 
              onClick={() => setStep(1)}
              className="absolute bottom-5 left-1/2 -translate-x-1/2 text-gray-400 text-[10px] underline z-50"
            >
              이전 화면으로
            </button>
          </div>
        )}

        {/* --- [Step 3: 대피 안내] --- */}
        {/* App.jsx 내부 */}
        {step === 3 && (
          <EvacuationView setStep={setStep} />
        )}
      </div>
    </div>
  );
}