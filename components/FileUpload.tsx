// components/FileUpload.tsx
'use client';
import { useState, ChangeEvent, useRef, useEffect } from 'react';
import Papa from 'papaparse';
import { analyzeTrades } from '../utils/analyzer';
import { AnalysisResult, Trade, UploadedFile, UploadState } from '../utils/types';
import PDFDownloadButton from './PDFDownloadButton';

interface FileUploadProps {
  onAnalysisComplete: (data: AnalysisResult) => void;
}

export default function FileUpload({ onAnalysisComplete }: FileUploadProps) {
  const [uploadState, setUploadState] = useState<UploadState>({
    files: [],
    isProcessing: false,
    combinedResult: null
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const MAX_FILES = 5;

  // 分析結果が更新されたときに親コンポーネントに通知
  useEffect(() => {
    if (uploadState.combinedResult) {
      onAnalysisComplete(uploadState.combinedResult);
    }
  }, [uploadState.combinedResult, onAnalysisComplete]);
  
  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;
    
    // 最大ファイル数のチェック
    if (uploadState.files.length + selectedFiles.length > MAX_FILES) {
      alert(`最大${MAX_FILES}ファイルまでアップロードできます。`);
      return;
    }
    
    // 新しいファイルを追加
    const newFiles: UploadedFile[] = Array.from(selectedFiles).map(file => ({
      id: crypto.randomUUID(),
      name: file.name,
      status: 'uploading'
    }));
    
    setUploadState(prev => ({
      ...prev,
      files: [...prev.files, ...newFiles],
      isProcessing: true,
      combinedResult: null // 新しいファイルが追加されたら分析結果をリセット
    }));
    
    // 各ファイルを処理
    Array.from(selectedFiles).forEach((file, index) => {
      const fileId = newFiles[index].id;
      
      Papa.parse<Trade>(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length) {
            updateFileStatus(fileId, 'error', 'CSVファイルの解析に失敗しました');
            return;
          }
          
          updateFileStatus(fileId, 'done', undefined, results.data);
        },
        error: (err) => {
          updateFileStatus(fileId, 'error', `ファイル読み込みエラー: ${err.message}`);
        }
      });
    });
    
    // ファイル入力をリセット（同じファイルを再度選択可能に）
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const updateFileStatus = (fileId: string, status: 'uploading' | 'done' | 'error', error?: string, data?: Trade[]) => {
    setUploadState(prev => {
      const updatedFiles = prev.files.map(file => 
        file.id === fileId ? { ...file, status, error, data } : file
      );
      
      // すべてのファイルが処理完了したか確認
      const allDone = updatedFiles.every(file => file.status !== 'uploading');
      
      return {
        files: updatedFiles,
        isProcessing: !allDone,
        combinedResult: prev.combinedResult
      };
    });
  };
  
  const removeFile = (fileId: string) => {
    setUploadState(prev => {
      const updatedFiles = prev.files.filter(file => file.id !== fileId);
      return {
        files: updatedFiles,
        isProcessing: false,
        combinedResult: null // ファイルが削除されたら分析結果をリセット
      };
    });
  };

  const handleAnalyze = () => {
    const allData = uploadState.files
      .filter(file => file.status === 'done' && file.data)
      .flatMap(file => file.data || []);
    
    if (allData.length === 0) {
      alert('分析可能なデータがありません。');
      return;
    }

    setUploadState(prev => ({
      ...prev,
      isProcessing: true
    }));

    try {
      const combinedResult = analyzeTrades(allData);
      setUploadState(prev => ({
        ...prev,
        isProcessing: false,
        combinedResult
      }));
    } catch (err) {
      console.error('データ分析中にエラーが発生しました:', err);
      setUploadState(prev => ({
        ...prev,
        isProcessing: false
      }));
      alert('データ分析中にエラーが発生しました。');
    }
  };
  
  const FileStatusIcon = ({ status }: { status: string }) => {
    if (status === 'uploading') return <span className="animate-pulse">⏳</span>;
    if (status === 'done') return <span className="text-[var(--success)]">✓</span>;
    if (status === 'error') return <span className="text-[var(--danger)]">✗</span>;
    return null;
  };

  const canAnalyze = uploadState.files.some(file => file.status === 'done') && !uploadState.isProcessing;
  
  return (
    <div className="card w-full max-w-lg mb-8">
      <h2 className="text-xl font-bold mb-4">CSVファイルをアップロード</h2>
      
      <div className="mb-4">
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          multiple
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-[var(--primary)] file:text-[var(--primary-foreground)]
            hover:file:bg-blue-600 cursor-pointer"
        />
      </div>
      
      {uploadState.files.length > 0 && (
        <div className="mb-4">
          <h3 className="font-medium mb-2">アップロードされたファイル ({uploadState.files.length}/{MAX_FILES})</h3>
          <ul className="space-y-2 list-disc pl-4">
            {uploadState.files.map(file => (
              <li key={file.id} className="flex items-center justify-between py-2 px-3 rounded bg-[var(--muted)]">
                <div className="flex items-center gap-2">
                  <FileStatusIcon status={file.status} />
                  <span>{file.name}</span>
                  {file.error && <span className="ml-2 text-xs text-[var(--danger)]">({file.error})</span>}
                </div>
                <button 
                  onClick={() => removeFile(file.id)}
                  className="text-[var(--muted-foreground)] hover:text-[var(--danger)] ml-2"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {uploadState.isProcessing && <p className="text-[var(--primary)]">分析中...</p>}
      
      {uploadState.files.length > 0 && !uploadState.isProcessing && (
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={handleAnalyze}
            disabled={!canAnalyze}
            className={`px-4 py-2 rounded-full font-semibold
              ${canAnalyze 
                ? 'bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)]' 
                : 'bg-[var(--muted)] text-[var(--muted-foreground)] cursor-not-allowed'}`}
          >
            分析を実行
          </button>
          
          {uploadState.combinedResult && (
            <div className="w-full space-y-3">
              <div className="flex items-center justify-center gap-2 text-[var(--success)]">
                <span className="text-lg">✓</span>
                <p>
                  {uploadState.files.filter(f => f.status === 'done').length}ファイルのデータを分析しました
                </p>
              </div>
              <div className="text-center text-sm">
                <p>全{uploadState.combinedResult.summary.total}件のBTC取引データを検出</p>
              </div>
              <div className="flex justify-center mt-4">
                <PDFDownloadButton data={uploadState.combinedResult} />
              </div>
            </div>
          )}
        </div>
      )}
      
      {!uploadState.combinedResult && (
        <div className="text-sm text-[var(--muted-foreground)] mt-4">
          <p className="mb-2">以下の列を含むCSVファイルをアップロードしてください：</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>取引番号</li>
            <li>日付</li>
            <li>取引銘柄</li>
            <li>HIGH/LOW</li>
            <li>レート</li>
            <li>判定レート</li>
          </ul>
          <p className="mt-2">※最大{MAX_FILES}ファイルまでアップロード可能です。</p>
        </div>
      )}
    </div>
  );
}