import React, { useState } from 'react';

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
              <button 
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

      </div>
    </div>
  );
}