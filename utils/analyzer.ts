import { Trade, TradeWithResult, AnalysisResult, HourlyStats, DateStats, DateHourStats } from './types';

export function analyzeTrades(trades: Trade[]): AnalysisResult {
  // BTCのトレードだけをフィルタリング
  const btcTrades = trades.filter(row => {
    const symbol = String(row['取引銘柄'] || '');
    return symbol.includes('BTC');
  });

  if (btcTrades.length === 0) {
    throw new Error('BTCの取引データが見つかりませんでした');
  }
  
  // 重複を除去（取引番号で判断）
  const uniqueBtcTrades = btcTrades.filter((trade, index, self) => 
    index === self.findIndex(t => t['取引番号'] === trade['取引番号'])
  );
  
  console.log(`元のデータ: ${trades.length}件, BTCデータ: ${btcTrades.length}件, 重複除外後: ${uniqueBtcTrades.length}件`);
  
  // 勝敗を判定
  const tradesWithResult = uniqueBtcTrades.map(trade => {
    // 日付を整形
    let date = String(trade['日付'] || '');
    date = date.replace(/[="]/g, '').trim();
    
    // 日付形式を統一（YYYY-MM-DD HH:mm:ss）
    const [datePart, timePart] = date.split(' ');
    let year, month, day;
    
    // 日付のパース（MM/DD/YYYY形式）
    const parts = datePart.split('/');
    [day, month, year] = parts;  // 月と日を逆に
    
    // 数値に変換して2桁の文字列に
    month = String(parseInt(month, 10)).padStart(2, '0');
    day = String(parseInt(day, 10)).padStart(2, '0');
    year = String(parseInt(year, 10));
    
    // 日付の妥当性チェック
    const dateObj = new Date(`${year}-${month}-${day}`);
    if (isNaN(dateObj.getTime())) {
      console.error(`無効な日付です: ${datePart}`);
      throw new Error(`無効な日付です: ${datePart}`);
    }
    
    const time = timePart ? timePart.split(':').map(n => n.padStart(2, '0')).join(':') : '00:00:00';
    const cleanDate = `${year}-${month}-${day} ${time}`;
    
    // 時間帯を抽出
    const hour = timePart ? timePart.split(':')[0] : '00';
    
    // 日付部分を抽出
    const dateOnly = `${year}-${month}-${day}`;
    
    // 勝敗判定
    let result: '勝ち' | '負け' | '不明';
    if (trade['HIGH/LOW'] === 'HIGH') {
      result = trade['判定レート'] > trade['レート'] ? '勝ち' : '負け';
    } else if (trade['HIGH/LOW'] === 'LOW') {
      result = trade['判定レート'] < trade['レート'] ? '勝ち' : '負け';
    } else {
      result = '不明';
    }
    
    return {
      ...trade,
      result,
      cleanDate,
      dateOnly,
      hour
    } as TradeWithResult;
  });
  
  // 全体の勝率
  const wins = tradesWithResult.filter(t => t.result === '勝ち').length;
  const losses = tradesWithResult.filter(t => t.result === '負け').length;
  const total = wins + losses;
  const winRate = (wins / total) * 100;
  
  // HIGH/LOWごとの勝率
  const highTrades = tradesWithResult.filter(t => t['HIGH/LOW'] === 'HIGH');
  const lowTrades = tradesWithResult.filter(t => t['HIGH/LOW'] === 'LOW');
  
  const highWins = highTrades.filter(t => t.result === '勝ち').length;
  const lowWins = lowTrades.filter(t => t.result === '勝ち').length;
  
  // 時間帯ごとの勝率
  const hourlyStats: Record<string, { wins: number; losses: number; total: number }> = {};
  tradesWithResult.forEach(trade => {
    if (!trade.hour) return;
    
    if (!hourlyStats[trade.hour]) {
      hourlyStats[trade.hour] = { wins: 0, losses: 0, total: 0 };
    }
    
    if (trade.result === '勝ち') {
      hourlyStats[trade.hour].wins++;
    } else if (trade.result === '負け') {
      hourlyStats[trade.hour].losses++;
    }
    
    hourlyStats[trade.hour].total++;
  });
  
  // 時間帯ごとの勝率を計算して配列に変換
  const hourlyData: HourlyStats[] = Object.entries(hourlyStats).map(([hour, stats]) => {
    return {
      hour: `${hour}時台`,
      wins: stats.wins,
      losses: stats.losses,
      total: stats.total,
      winRate: (stats.wins / stats.total) * 100
    };
  });
  
  // 日付ごとの勝率
  const dateStats: Record<string, { wins: number; losses: number; total: number }> = {};
  tradesWithResult.forEach(trade => {
    if (!trade.dateOnly) return;
    
    if (!dateStats[trade.dateOnly]) {
      dateStats[trade.dateOnly] = { wins: 0, losses: 0, total: 0 };
    }
    
    if (trade.result === '勝ち') {
      dateStats[trade.dateOnly].wins++;
    } else if (trade.result === '負け') {
      dateStats[trade.dateOnly].losses++;
    }
    
    dateStats[trade.dateOnly].total++;
  });
  
  // 日付ごとの勝率を計算して配列に変換
  const dateData: DateStats[] = Object.entries(dateStats).map(([date, stats]) => {
    return {
      date,
      wins: stats.wins,
      losses: stats.losses,
      total: stats.total,
      winRate: (stats.wins / stats.total) * 100
    };
  });
  
  // 日付 × 時間帯の組み合わせ
  const dateHourStats: Record<string, { wins: number; losses: number; total: number }> = {};
  tradesWithResult.forEach(trade => {
    if (!trade.dateOnly || !trade.hour) return;
    
    const key = `${trade.dateOnly} ${trade.hour}時台`;
    
    if (!dateHourStats[key]) {
      dateHourStats[key] = { wins: 0, losses: 0, total: 0 };
    }
    
    if (trade.result === '勝ち') {
      dateHourStats[key].wins++;
    } else if (trade.result === '負け') {
      dateHourStats[key].losses++;
    }
    
    dateHourStats[key].total++;
  });
  
  // 日付×時間帯の勝率を計算して配列に変換
  const dateHourData: DateHourStats[] = Object.entries(dateHourStats)
    .filter(([_, stats]) => stats.total >= 3) // 3回以上の取引がある組み合わせのみ
    .map(([key, stats]) => {
      return {
        key,
        wins: stats.wins,
        losses: stats.losses,
        total: stats.total,
        winRate: (stats.wins / stats.total) * 100
      };
    });
  
  // 戦略提案の作成
  // 勝率が高い時間帯トップ3
  const topHours = [...hourlyData]
    .filter(h => h.total >= 5)
    .sort((a, b) => b.winRate - a.winRate)
    .slice(0, 3);
    
  // 勝率が低い時間帯ワースト3
  const worstHours = [...hourlyData]
    .filter(h => h.total >= 5)
    .sort((a, b) => a.winRate - b.winRate)
    .slice(0, 3);
  
  // 月別分析の計算
  const monthlyStats: Record<string, { wins: number; losses: number; total: number; profit: number }> = {};
  tradesWithResult.forEach(trade => {
    const date = new Date(trade.cleanDate);
    const monthKey = `${date.getFullYear()}年${date.getMonth() + 1}月`;
    
    if (!monthlyStats[monthKey]) {
      monthlyStats[monthKey] = { wins: 0, losses: 0, total: 0, profit: 0 };
    }
    
    if (trade.result === '勝ち') {
      monthlyStats[monthKey].wins++;
      monthlyStats[monthKey].profit += Number(trade.ペイアウト.replace(/[^0-9.-]+/g, ''));
    } else if (trade.result === '負け') {
      monthlyStats[monthKey].losses++;
      monthlyStats[monthKey].profit -= Number(trade.購入金額.replace(/[^0-9.-]+/g, ''));
    }
    
    monthlyStats[monthKey].total++;
  });

  // 月別分析データの作成
  const monthlyAnalysis = Object.entries(monthlyStats).reduce((acc, [month, stats]) => {
    acc[month] = {
      total: stats.total,
      winRate: (stats.wins / stats.total) * 100,
      totalProfit: stats.profit
    };
    return acc;
  }, {} as Record<string, { total: number; winRate: number; totalProfit: number }>);

  // 日付の範囲を取得
  const validDates = tradesWithResult
    .map(t => {
      try {
        const date = new Date(t.cleanDate);
        console.log('変換前の日付:', t['日付'], '変換後の日付:', t.cleanDate);
        return isNaN(date.getTime()) ? null : date;
      } catch {
        return null;
      }
    })
    .filter((date): date is Date => date !== null);

  if (validDates.length === 0) {
    throw new Error('有効な日付データが見つかりませんでした');
  }

  // 日本時間に変換して日付のみを取得
  const startDate = new Date(Math.min(...validDates.map(d => d.getTime())))
    .toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo' });
  const endDate = new Date(Math.max(...validDates.map(d => d.getTime())))
    .toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo' });

  console.log('最終的な開始日:', startDate);
  console.log('最終的な終了日:', endDate);

  // 利益の計算
  const profits = tradesWithResult.map(trade => {
    if (trade.result === '勝ち') {
      return Number(trade.ペイアウト.replace(/[^0-9.-]+/g, ''));
    } else {
      return -Number(trade.購入金額.replace(/[^0-9.-]+/g, ''));
    }
  });

  const totalProfit = profits.reduce((sum, profit) => sum + profit, 0);
  const averageProfit = profits.filter(p => p > 0).reduce((sum, p) => sum + p, 0) / wins;
  const averageLoss = profits.filter(p => p < 0).reduce((sum, p) => sum + p, 0) / losses;

  return {
    summary: {
      total,
      wins,
      losses,
      winRate,
      startDate,
      endDate,
      averageProfit,
      averageLoss,
      totalProfit
    },
    highLow: [
      { name: 'HIGH', wins: highWins, losses: highTrades.length - highWins, total: highTrades.length, winRate: (highWins / highTrades.length) * 100 },
      { name: 'LOW', wins: lowWins, losses: lowTrades.length - lowWins, total: lowTrades.length, winRate: (lowWins / lowTrades.length) * 100 }
    ],
    hourly: hourlyData,
    dateStats: dateData,
    dateHourStats: dateHourData,
    strategy: {
      topHours,
      worstHours
    },
    monthlyAnalysis
  };
}