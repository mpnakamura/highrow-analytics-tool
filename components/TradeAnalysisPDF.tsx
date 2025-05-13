import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { AnalysisResult } from '../utils/types';

// 日本語フォントの登録（Google Noto Sans JPを使用）
Font.register({
  family: 'NotoSansJP',
  src: 'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-jp@4.5.0/files/noto-sans-jp-all-400-normal.woff',
});

const styles = StyleSheet.create({
  page: {
    padding: 15,
    fontSize: 10,
    fontFamily: 'NotoSansJP',
  },
  title: {
    fontSize: 16,
    marginBottom: 7,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 7,
    borderBottom: '1px solid #eee',
    paddingBottom: 5,
  },
  sectionTitle: {
    fontSize: 12,
    marginBottom: 4,
    fontWeight: 'bold',
    backgroundColor: '#f5f5f5',
    padding: 5,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    width: '40%',
    fontWeight: 'light',
  },
  value: {
    width: '60%',
    fontWeight: 'medium',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
    backgroundColor: '#f0f0f0',
    padding: 5,
    marginBottom: 5,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    borderBottomStyle: 'solid',
    padding: 3,
  },
  col1: { width: '25%' },
  col2: { width: '15%' },
  col3: { width: '15%' },
  col4: { width: '15%' },
  col5: { width: '30%' },
  positiveValue: {
    color: '#10b981',
  },
  negativeValue: {
    color: '#ef4444',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    textAlign: 'center',
    fontSize: 8,
    color: '#666',
  },
});

interface TradeAnalysisPDFProps {
  data: AnalysisResult;
}

export const TradeAnalysisPDF = ({ data }: TradeAnalysisPDFProps) => {
  // 最も勝率の高い時間帯と低い時間帯
  const topHours = [...data.hourly]
    .filter(h => h.total >= 5)
    .sort((a, b) => b.winRate - a.winRate)
    .slice(0, 5);
    
  const worstHours = [...data.hourly]
    .filter(h => h.total >= 5)
    .sort((a, b) => a.winRate - b.winRate)
    .slice(0, 5);
  
  // 日付別の勝率トップ
  const topDates = [...data.dateStats]
    .filter(d => d.total >= 3)
    .sort((a, b) => b.winRate - a.winRate)
    .slice(0, 5);
  
  // 日付表示のフォーマット
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };
  
  // 通貨フォーマット
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ja-JP', { 
      style: 'currency', 
      currency: 'JPY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0 
    }).format(value);
  };
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>BTC取引分析レポート</Text>

        {/* 基本情報セクション */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>基本情報</Text>
          <View style={styles.row}>
            <Text style={styles.label}>総取引数:</Text>
            <Text style={styles.value}>{data.summary.total}件</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>分析期間:</Text>
            <Text style={styles.value}>
              {formatDate(data.summary.startDate)} 〜 {formatDate(data.summary.endDate)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>勝率:</Text>
            <Text style={styles.value}>{data.summary.winRate.toFixed(2)}%（{data.summary.wins}勝 {data.summary.losses}敗）</Text>
          </View>
        </View>

        {/* 損益情報セクション */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>損益分析</Text>
          <View style={styles.row}>
            <Text style={styles.label}>総損益:</Text>
            <Text style={[styles.value, data.summary.totalProfit >= 0 ? styles.positiveValue : styles.negativeValue]}>
              {data.summary.totalProfit >= 0 ? '+' : ''}{formatCurrency(data.summary.totalProfit)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>平均利益:</Text>
            <Text style={[styles.value, styles.positiveValue]}>{formatCurrency(data.summary.averageProfit)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>平均損失:</Text>
            <Text style={[styles.value, styles.negativeValue]}>{formatCurrency(Math.abs(data.summary.averageLoss))}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>平均購入金額:</Text>
            <Text style={styles.value}>{formatCurrency(data.summary.averageAmount)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>期待値（1回あたり）:</Text>
            <Text style={[styles.value, (data.summary.totalProfit / data.summary.total) >= 0 ? styles.positiveValue : styles.negativeValue]}>
              {(data.summary.totalProfit / data.summary.total) >= 0 ? '+' : ''}{formatCurrency(data.summary.totalProfit / data.summary.total)}
            </Text>
          </View>
        </View>

        {/* HIGH/LOW分析 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>HIGH/LOW分析</Text>
          <View style={styles.tableHeader}>
            <Text style={styles.col1}>方向</Text>
            <Text style={styles.col2}>取引数</Text>
            <Text style={styles.col3}>勝ち</Text>
            <Text style={styles.col4}>負け</Text>
            <Text style={styles.col5}>勝率</Text>
          </View>
          {data.highLow.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.col1}>{item.name}</Text>
              <Text style={styles.col2}>{item.total}回</Text>
              <Text style={styles.col3}>{item.wins}回</Text>
              <Text style={styles.col4}>{item.losses}回</Text>
              <Text style={styles.col5}>{item.winRate.toFixed(2)}%</Text>
            </View>
          ))}
        </View>

        {/* 時間帯分析 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>時間帯分析</Text>
          <Text style={{ fontSize: 12, marginBottom: 5 }}>勝率が高い時間帯（上位5件）</Text>
          <View style={styles.tableHeader}>
            <Text style={styles.col1}>時間帯</Text>
            <Text style={styles.col2}>取引数</Text>
            <Text style={styles.col3}>勝ち</Text>
            <Text style={styles.col4}>負け</Text>
            <Text style={styles.col5}>勝率</Text>
          </View>
          {topHours.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.col1}>{item.hour}</Text>
              <Text style={styles.col2}>{item.total}回</Text>
              <Text style={styles.col3}>{item.wins}回</Text>
              <Text style={styles.col4}>{item.losses}回</Text>
              <Text style={styles.col5}>{item.winRate.toFixed(2)}%</Text>
            </View>
          ))}
          
          <Text style={{ fontSize: 12, marginTop: 10, marginBottom: 5 }}>勝率が低い時間帯（下位5件）</Text>
          <View style={styles.tableHeader}>
            <Text style={styles.col1}>時間帯</Text>
            <Text style={styles.col2}>取引数</Text>
            <Text style={styles.col3}>勝ち</Text>
            <Text style={styles.col4}>負け</Text>
            <Text style={styles.col5}>勝率</Text>
          </View>
          {worstHours.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.col1}>{item.hour}</Text>
              <Text style={styles.col2}>{item.total}回</Text>
              <Text style={styles.col3}>{item.wins}回</Text>
              <Text style={styles.col4}>{item.losses}回</Text>
              <Text style={styles.col5}>{item.winRate.toFixed(2)}%</Text>
            </View>
          ))}
        </View>

        {/* フッター */}
        <Text style={styles.footer}>
          このレポートはBTCトレード分析ツールによって自動生成されました。作成日時：{new Date().toLocaleDateString('ja-JP')}
        </Text>
      </Page>
    </Document>
  );
}; 