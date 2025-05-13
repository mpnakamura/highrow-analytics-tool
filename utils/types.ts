export interface Trade {
    取引番号: number;
    日付: string;
    取引銘柄: string;
    取引オプション: string;
    'HIGH/LOW': 'HIGH' | 'LOW';
    レート: number;
    終了時刻: string;
    判定レート: number;
    購入金額: string;
    ペイアウト: string;
    [key: string]: any;
  }
  
  export interface TradeWithResult extends Trade {
    result: '勝ち' | '負け' | '不明';
    cleanDate: string;
    dateOnly: string;
    hour: string;
  }
  
  export interface HourlyStats {
    hour: string;
    wins: number;
    losses: number;
    total: number;
    winRate: number;
  }
  
  export interface DateStats {
    date: string;
    wins: number;
    losses: number;
    total: number;
    winRate: number;
  }
  
  export interface DateHourStats {
    key: string;
    wins: number;
    losses: number;
    total: number;
    winRate: number;
  }
  
  export interface HighLowStats {
    name: string;
    wins: number;
    losses: number;
    total: number;
    winRate: number;
  }
  
  export interface AmountDistribution {
    amount: string;
    count: number;
    wins: number;
    losses: number;
    winRate: number;
  }
  
  export interface AnalysisResult {
    summary: {
      total: number;
      wins: number;
      losses: number;
      winRate: number;
      startDate: string;
      endDate: string;
      averageProfit: number;
      averageLoss: number;
      totalProfit: number;
      averageAmount: number;
    };
    highLow: HighLowStats[];
    hourly: HourlyStats[];
    dateStats: DateStats[];
    dateHourStats: DateHourStats[];
    strategy: {
      topHours: HourlyStats[];
      worstHours: HourlyStats[];
    };
    monthlyAnalysis: {
      [key: string]: {
        total: number;
        winRate: number;
        totalProfit: number;
      };
    };
    amountDistribution: AmountDistribution[];
  }
  
  export interface ChartDataItem {
    name: string;
    value: number;
    color?: string;
  }

export interface UploadedFile {
  id: string;
  name: string;
  status: 'uploading' | 'done' | 'error';
  error?: string;
  data?: Trade[];
}

export interface UploadState {
  files: UploadedFile[];
  isProcessing: boolean;
  combinedResult: AnalysisResult | null;
}