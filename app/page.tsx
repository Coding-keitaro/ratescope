'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import TabBar from '@/components/layout/TabBar';
import CapRateSimulator from '@/components/simulators/CapRateSimulator';
import LeverageSimulator from '@/components/simulators/LeverageSimulator';
import RefinanceSimulator from '@/components/simulators/RefinanceSimulator';
import DscrSimulator from '@/components/simulators/DscrSimulator';
import { TabId } from '@/types';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>('caprate');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header />
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="max-w-5xl mx-auto px-4 py-6">
        <div key={activeTab} style={{ animation: 'fadeIn 150ms ease-in-out' }}>
          {activeTab === 'caprate' && <CapRateSimulator />}
          {activeTab === 'leverage' && <LeverageSimulator />}
          {activeTab === 'refinance' && <RefinanceSimulator />}
          {activeTab === 'dscr' && <DscrSimulator />}
        </div>
      </main>
    </div>
  );
}
