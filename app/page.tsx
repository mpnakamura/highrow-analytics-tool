'use client';
import { useState } from 'react';
import FileUpload from '../components/FileUpload';
import TradeAnalysis from '../components/TradeAnalysis';
import { AnalysisResult } from '../utils/types';

export default function Home() {
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null);

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-12">
      <h1 className="text-3xl font-bold mb-8">BTCトレード分析ツール</h1>
      
      <FileUpload onAnalysisComplete={setAnalysisData} />
      
      {analysisData && <TradeAnalysis data={analysisData} />}
    </main>
  );
}