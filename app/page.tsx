'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [todos, setTodos] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
    
    // Fetch data on client side
    const fetchData = async () => {
      const { data } = await supabase.from('baby_profile').select();
      if (data) {
        setTodos(data);
      }
    };
    
    fetchData();
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <style jsx global>{`
        @layer base {
          html {
            font-family: "Noto Sans JP", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          }
          body {
            @apply bg-stone-100 text-stone-800;
            max-width: 480px;
            margin: 0 auto;
          }
        }
        
        .zen-rounded {
          font-family: "Zen Maru Gothic", "Noto Sans JP", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        
        .muji-card {
          @apply bg-white rounded-2xl shadow-sm border border-stone-200;
        }
        
        .muji-btn-primary {
          @apply rounded-full px-4 py-2 bg-stone-800 text-stone-50 text-sm tracking-wide;
        }
        
        .muji-btn-outline {
          @apply rounded-full px-4 py-2 border border-stone-300 text-stone-700 text-sm;
        }
        
        .tab-active {
          @apply text-stone-900;
        }
        
        .tab-inactive {
          @apply text-stone-400;
        }
        
        .chip {
          @apply text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-500;
        }
        
        .input-base {
          @apply w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-stone-400 focus:border-stone-400;
        }
        
        .section-title {
          @apply text-sm font-medium tracking-[0.15em] text-stone-500 uppercase;
        }
      `}</style>

      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="px-4 pt-4 pb-2 bg-stone-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="section-title">BABY LOG</div>
              <h1 className="zen-rounded text-2xl font-medium mt-1">食 · 瞓 · 痾 小助手</h1>
              <p className="text-[11px] text-stone-500 mt-1">依照月齡參考模板與歴史記錄，預測下一次食瞓痾時間。</p>
            </div>
            <div className="flex flex-col items-end text-right">
              <span className="chip mb-1" id="baby-age-chip">尚未設定生日</span>
              <button id="exportCsvBtn" className="muji-btn-outline flex items-center gap-1 text-[11px]">
                <i className="fa fa-download"></i><span>匯出 CSV</span>
              </button>
            </div>
          </div>
        </header>

        {/* Top Tabs */}
        <nav className="mt-2 px-4">
          <div className="muji-card flex items-center justify-between px-2 py-1">
            <button data-tab="plan" className="tab-btn flex-1 flex flex-col items-center py-2 text-xs tab-active">
              <span className="mb-1"><i className="fa fa-calendar-o"></i></span>
              <span>PLAN</span>
            </button>
            <button data-tab="record" className="tab-btn flex-1 flex flex-col items-center py-2 text-xs tab-inactive">
              <span className="mb-1"><i className="fa fa-pencil-square-o"></i></span>
              <span>RECORD</span>
            </button>
            <button data-tab="forecast" className="tab-btn flex-1 flex flex-col items-center py-2 text-xs tab-inactive">
              <span className="mb-1"><i className="fa fa-line-chart"></i></span>
              <span>FORECAST</span>
            </button>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto px-4 pb-24 pt-3 space-y-4">
          {/* Baby Profile Records Section */}
          <section className="muji-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="section-title">BABY PROFILE RECORDS</div>
                <p className="text-xs text-stone-500 mt-1">所有已儲存的嬰兒檔案記錄</p>
              </div>
              <i className="fa fa-user-circle-o text-stone-300 text-2xl"></i>
            </div>

            <div className="space-y-2">
              {todos && todos.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left text-stone-700">
                    <thead>
                      <tr className="border-b border-stone-200">
                        <th className="py-2 px-2 font-medium">ID</th>
                        <th className="py-2 px-2 font-medium">出生日期</th>
                        <th className="py-2 px-2 font-medium">建立時間</th>
                        <th className="py-2 px-2 font-medium">更新時間</th>
                      </tr>
                    </thead>
                    <tbody>
                      {todos.map((profile) => (
                        <tr key={profile.id} className="border-b border-stone-100 hover:bg-stone-50">
                          <td className="py-2 px-2">{profile.id}</td>
                          <td className="py-2 px-2 font-medium text-stone-800">{profile.birth_date}</td>
                          <td className="py-2 px-2 text-stone-500">
                            {profile.created_at ? new Date(profile.created_at).toLocaleString('zh-HK', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit'
                            }) : '-'}
                          </td>
                          <td className="py-2 px-2 text-stone-500">
                            {profile.updated_at ? new Date(profile.updated_at).toLocaleString('zh-HK', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit'
                            }) : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-6 text-stone-400">
                  <i className="fa fa-inbox text-3xl mb-2"></i>
                  <p className="text-xs">尚無嬰兒檔案記錄</p>
                </div>
              )}
            </div>
          </section>

          {/* Baby Profile Section */}
          <section className="muji-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="section-title">BABY PROFILE</div>
                <p className="text-xs text-stone-500 mt-1">設定生日，系統會依照月齡載入對應的參考作息。</p>
              </div>
              <i className="fa fa-leaf text-stone-300 text-2xl"></i>
            </div>

            <div className="space-y-2">
              <label className="block text-[11px] text-stone-500 mb-1">嬰兒出生日期</label>
              <input id="babyBirthDate" type="date" className="input-base text-xs" />
              <p className="text-[11px] text-stone-500 mt-1" id="babyAgeText">會依照月齡載入 0–12 個月的預設參考模板。</p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <span className="text-[11px] text-stone-500">目前月齡對應模板</span>
                <div id="currentRefMonthLabel" className="text-xs text-stone-800 mt-0.5">尚未計算</div>
              </div>
              <div className="text-right">
                <button id="reloadRefForAgeBtn" className="muji-btn-outline text-[11px]">
                  以月齡重設模板
                </button>
              </div>
            </div>

            <div className="border-t border-dashed border-stone-200 pt-3">
              <div className="flex items-center justify-between mb-2">
                <span className="section-title">REFERENCE PATTERN</span>
                <button id="loadReferenceBtn" className="muji-btn-outline text-[11px] flex items-center gap-1">
                  <i className="fa fa-refresh"></i><span>載入通用預設</span>
                </button>
              </div>
              <p className="text-[11px] text-stone-500 mb-2">
                參考嬰兒食瞓痾記錄（單日樣板）：會根據月齡選擇餵食次數與大約奶量，你仍可自行微調。
              </p>

              {/* Reference Pattern Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-[11px] text-left text-stone-700">
                  <thead>
                    <tr className="border-b border-stone-200">
                      <th className="py-1 px-2">時間</th>
                      <th className="py-1 px-2">餵食</th>
                      <th className="py-1 px-2">睡眠</th>
                      <th className="py-1 px-2">大便</th>
                    </tr>
                  </thead>
                  <tbody id="referenceTableBody">
                    <tr>
                      <td colSpan={4} className="text-center py-4 text-stone-400">尚未載入參考模板</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Plan Tab Content */}
          <div id="plan-tab" className="tab-content">
            <section className="muji-card p-4 space-y-3">
              <div className="section-title">TODAY'S PLAN</div>
              <p className="text-xs text-stone-500">根據參考模板與歴史記錄，預測今日作息。</p>
              <div id="planContent" className="text-xs text-stone-500">
                請先設定嬰兒生日並載入參考模板
              </div>
            </section>
          </div>

          {/* Record Tab Content */}
          <div id="record-tab" className="tab-content hidden">
            <section className="muji-card p-4 space-y-3">
              <div className="section-title">RECORD ENTRY</div>
              <p className="text-xs text-stone-500">記錄實際的食瞓痾時間。</p>
              
              <div className="space-y-2">
                <label className="block text-[11px] text-stone-500">時間</label>
                <input id="recordTime" type="time" className="input-base text-xs" />
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] text-stone-500">餵食</label>
                <input id="recordFeed" type="text" className="input-base text-xs" placeholder="例：母乳 120ml" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <label className="block text-[11px] text-stone-500">睡眠開始</label>
                  <input id="recordSleepStart" type="time" className="input-base text-xs" />
                </div>
                <div className="space-y-2">
                  <label className="block text-[11px] text-stone-500">睡眠結束</label>
                  <input id="recordSleepEnd" type="time" className="input-base text-xs" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] text-stone-500">大便</label>
                <input id="recordPoop" type="text" className="input-base text-xs" placeholder="例：正常" />
              </div>

              <button id="saveRecordBtn" className="muji-btn-primary w-full">
                儲存記錄
              </button>
            </section>

            <section className="muji-card p-4 space-y-3">
              <div className="section-title">RECENT RECORDS</div>
              <div id="recordsList" className="space-y-2">
                <p className="text-xs text-stone-500">尚無記錄</p>
              </div>
            </section>
          </div>

          {/* Forecast Tab Content */}
          <div id="forecast-tab" className="tab-content hidden">
            <section className="muji-card p-4 space-y-3">
              <div className="section-title">FORECAST & ANALYTICS</div>
              <p className="text-xs text-stone-500">基於歴史記錄的趨勢分析。</p>
              <div id="forecastChart" className="h-64">
                <canvas id="chartCanvas"></canvas>
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}

// Made with Bob