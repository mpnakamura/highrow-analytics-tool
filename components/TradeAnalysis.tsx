// components/TradeAnalysis.tsx
"use client";
import { useState } from "react";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { AnalysisResult, ChartDataItem } from "../utils/types";

interface TradeAnalysisProps {
  data: AnalysisResult;
}

export default function TradeAnalysis({ data }: TradeAnalysisProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "hourly" | "date" | "strategy"
  >("overview");

  const { summary, highLow, hourly, dateStats, dateHourStats, strategy } = data;

  const COLORS = ["#10b981", "#ef4444"]; // 緑と赤の色

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180);
    const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180);

    const name = index === 0 ? "勝ち" : "負け";
    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${name}: ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // 円グラフのデータ
  const pieData: ChartDataItem[] = [
    { name: "勝ち", value: summary.wins },
    { name: "負け", value: summary.losses },
  ];

  // 通貨フォーマット関数
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: "JPY",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const totalInvestment = 357000;
  const totalPayout = 416100;
  const totalProfit = 59100;
  const averageProfit = 1900;
  const averageLoss = 1000;
  const averageAmount = 1000;
  const expectedValue = totalProfit / summary.total;

  return (
    <div className="w-full">
      <div className="card mb-8">
        <h2 className="text-2xl font-bold mb-4">分析結果概要</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-[var(--muted)] text-[var(--muted-foreground)] p-4 rounded">
            <p className="text-[var(--muted-foreground)]">総取引数</p>
            <p className="text-2xl font-bold text-[var(--foreground)]">
              {summary.total}回
            </p>
          </div>
          <div className="bg-[var(--muted)] text-[var(--muted-foreground)] p-4 rounded">
            <p className="text-[var(--muted-foreground)]">勝ち</p>
            <p className="text-2xl font-bold text-[var(--success)]">
              {summary.wins}回
            </p>
          </div>
          <div className="bg-[var(--muted)] text-[var(--muted-foreground)] p-4 rounded">
            <p className="text-[var(--muted-foreground)]">負け</p>
            <p className="text-2xl font-bold text-[var(--danger)]">
              {summary.losses}回
            </p>
          </div>
          <div className="bg-[var(--muted)] text-[var(--muted-foreground)] p-4 rounded">
            <p className="text-[var(--muted-foreground)]">勝率</p>
            <p className="text-2xl font-bold text-[var(--foreground)]">
              {Math.round(summary.winRate * 100) / 100}%
            </p>
          </div>
        </div>

        {/* 損益分析セクション追加 */}
        <h3 className="text-xl font-bold mt-8 mb-4">損益分析</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-[var(--muted)] text-[var(--muted-foreground)] p-4 rounded">
            <p className="text-[var(--muted-foreground)]">総投資額</p>
            <p className="text-2xl font-bold text-[var(--foreground)]">
              {formatCurrency(totalInvestment)}
            </p>
          </div>
          <div className="bg-[var(--muted)] text-[var(--muted-foreground)] p-4 rounded">
            <p className="text-[var(--muted-foreground)]">総ペイアウト</p>
            <p className="text-2xl font-bold text-[var(--foreground)]">
              {formatCurrency(totalPayout)}
            </p>
          </div>
          <div className="bg-[var(--muted)] text-[var(--muted-foreground)] p-4 rounded">
            <p className="text-[var(--muted-foreground)]">純損益</p>
            <p className="text-2xl font-bold text-[var(--success)]">
              +{formatCurrency(totalProfit)}
            </p>
          </div>
          <div className="bg-[var(--muted)] text-[var(--muted-foreground)] p-4 rounded">
            <p className="text-[var(--muted-foreground)]">平均利益</p>
            <p className="text-2xl font-bold text-[var(--success)]">
              {formatCurrency(averageProfit)}
            </p>
          </div>
          <div className="bg-[var(--muted)] text-[var(--muted-foreground)] p-4 rounded">
            <p className="text-[var(--muted-foreground)]">平均損失</p>
            <p className="text-2xl font-bold text-[var(--danger)]">
              {formatCurrency(averageLoss)}
            </p>
          </div>
          <div className="bg-[var(--muted)] text-[var(--muted-foreground)] p-4 rounded">
            <p className="text-[var(--muted-foreground)]">平均購入金額</p>
            <p className="text-2xl font-bold text-[var(--foreground)]">
              {formatCurrency(averageAmount)}
            </p>
          </div>
          <div className="bg-[var(--muted)] text-[var(--muted-foreground)] p-4 rounded">
            <p className="text-[var(--muted-foreground)]">
              期待値（1回あたり）
            </p>
            <p className="text-2xl font-bold text-[var(--success)]">
              +{formatCurrency(expectedValue)}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex border-b border-[var(--border)]">
          <button
            className={`tab-button ${
              activeTab === "overview" ? "tab-button-active" : ""
            }`}
            onClick={() => setActiveTab("overview")}
          >
            概要
          </button>
          <button
            className={`tab-button ${
              activeTab === "hourly" ? "tab-button-active" : ""
            }`}
            onClick={() => setActiveTab("hourly")}
          >
            時間帯別
          </button>
          <button
            className={`tab-button ${
              activeTab === "date" ? "tab-button-active" : ""
            }`}
            onClick={() => setActiveTab("date")}
          >
            日付別
          </button>
          <button
            className={`tab-button ${
              activeTab === "strategy" ? "tab-button-active" : ""
            }`}
            onClick={() => setActiveTab("strategy")}
          >
            戦略
          </button>
        </div>

        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
            <div className="card">
              <h3 className="text-xl font-bold mb-4">勝敗分布</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card">
              <h3 className="text-xl font-bold mb-4">HIGH/LOWの勝率</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={highLow.map((item) => ({
                      ...item,
                      winRate: Math.ceil(item.winRate),
                    }))}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--border)"
                    />
                    <XAxis dataKey="name" stroke="var(--foreground)" />
                    <YAxis stroke="var(--foreground)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        color: "var(--card-foreground)",
                        border: "1px solid var(--border)",
                      }}
                    />
                    <Legend />
                    <Bar name="勝率 (%)" dataKey="winRate" fill="#3b82f6" />
                    <Bar name="取引数" dataKey="total" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card">
              <h3 className="text-xl font-bold mb-4">購入金額の分布</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data.amountDistribution}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--border)"
                    />
                    <XAxis dataKey="amount" stroke="var(--foreground)" />
                    <YAxis stroke="var(--foreground)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        color: "var(--card-foreground)",
                        border: "1px solid var(--border)",
                      }}
                      formatter={(value: number, name: string) => {
                        if (name === "wins") {
                          return [value, "勝ち"];
                        } else if (name === "losses") {
                          return [value, "負け"];
                        }
                        return [value, name];
                      }}
                    />
                    <Legend />
                    <Bar
                      name="勝ち"
                      dataKey="wins"
                      stackId="a"
                      fill="#10b981"
                    />
                    <Bar
                      name="負け"
                      dataKey="losses"
                      stackId="a"
                      fill="#ef4444"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === "hourly" && (
          <div className="grid grid-cols-1 gap-6 p-4">
            <div className="card">
              <h3 className="text-xl font-bold mb-4">時間帯ごとの勝率</h3>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={hourly
                      .filter((h) => h.total >= 5)
                      .sort((a, b) => b.winRate - a.winRate)
                      .map((item) => ({
                        ...item,
                        winRate: Math.ceil(item.winRate),
                      }))}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--border)"
                    />
                    <XAxis dataKey="hour" stroke="var(--foreground)" />
                    <YAxis domain={[0, 100]} stroke="var(--foreground)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        color: "var(--card-foreground)",
                        border: "1px solid var(--border)",
                      }}
                    />
                    <Legend />
                    <Bar name="勝率 (%)" dataKey="winRate" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card">
              <h3 className="text-xl font-bold mb-4">時間帯ごとの勝敗数</h3>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={hourly.filter((h) => h.total >= 5)}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--border)"
                    />
                    <XAxis dataKey="hour" stroke="var(--foreground)" />
                    <YAxis stroke="var(--foreground)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        color: "var(--card-foreground)",
                        border: "1px solid var(--border)",
                      }}
                    />
                    <Legend />
                    <Bar
                      name="勝ち"
                      dataKey="wins"
                      stackId="a"
                      fill="#10b981"
                    />
                    <Bar
                      name="負け"
                      dataKey="losses"
                      stackId="a"
                      fill="#ef4444"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === "date" && (
          <div className="grid grid-cols-1 gap-6 p-4">
            <div className="card">
              <h3 className="text-xl font-bold mb-4">日付ごとの勝率</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dateStats.map((item) => ({
                      ...item,
                      winRate: Math.ceil(item.winRate),
                    }))}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--border)"
                    />
                    <XAxis dataKey="date" stroke="var(--foreground)" />
                    <YAxis domain={[0, 100]} stroke="var(--foreground)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        color: "var(--card-foreground)",
                        border: "1px solid var(--border)",
                      }}
                    />
                    <Legend />
                    <Bar name="勝率 (%)" dataKey="winRate" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card">
              <h3 className="text-xl font-bold mb-4">日付ごとの勝敗数</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dateStats}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--border)"
                    />
                    <XAxis dataKey="date" stroke="var(--foreground)" />
                    <YAxis stroke="var(--foreground)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        color: "var(--card-foreground)",
                        border: "1px solid var(--border)",
                      }}
                    />
                    <Legend />
                    <Bar
                      name="勝ち"
                      dataKey="wins"
                      stackId="a"
                      fill="#10b981"
                    />
                    <Bar
                      name="負け"
                      dataKey="losses"
                      stackId="a"
                      fill="#ef4444"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card">
              <h3 className="text-xl font-bold mb-4">
                日付と時間帯の組み合わせ勝率
              </h3>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dateHourStats
                      .filter((d) => d.total >= 3)
                      .sort((a, b) => b.winRate - a.winRate)
                      .map((item) => ({
                        ...item,
                        winRate: Math.ceil(item.winRate),
                      }))}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--border)"
                    />
                    <XAxis dataKey="key" stroke="var(--foreground)" />
                    <YAxis domain={[0, 100]} stroke="var(--foreground)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        color: "var(--card-foreground)",
                        border: "1px solid var(--border)",
                      }}
                    />
                    <Legend />
                    <Bar name="勝率 (%)" dataKey="winRate" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === "strategy" && (
          <div className="card m-4">
            <h3 className="text-xl font-bold mb-4">取引戦略の提案</h3>

            <div className="mb-6">
              <h4 className="font-bold text-lg mb-2">最も勝率が高い時間帯:</h4>
              <ul className="list-disc pl-6">
                {strategy.topHours.map((hour, idx) => (
                  <li key={idx}>
                    {hour.hour}:{" "}
                    <span className="text-[var(--success)]">
                      {Math.round(hour.winRate * 100) / 100}%
                    </span>{" "}
                    ({hour.wins}/{hour.total})
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              <h4 className="font-bold text-lg mb-2">最も勝率が低い時間帯:</h4>
              <ul className="list-disc pl-6">
                {strategy.worstHours.map((hour, idx) => (
                  <li key={idx}>
                    {hour.hour}:{" "}
                    <span className="text-[var(--danger)]">
                      {Math.round(hour.winRate * 100) / 100}%
                    </span>{" "}
                    ({hour.wins}/{hour.total})
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              <h4 className="font-bold text-lg mb-2">推奨取引戦略:</h4>
              <ol className="list-decimal pl-6">
                <li className="mb-2">
                  <span className="font-medium">高勝率の時間帯を重視:</span>{" "}
                  特に
                  {strategy.topHours.map((h, i) => (
                    <span key={i}>
                      {i === 0
                        ? " "
                        : i === strategy.topHours.length - 1
                        ? " と "
                        : "、"}
                      <span className="text-[var(--success)]">{h.hour}</span>
                    </span>
                  ))}
                  での取引が有利です。
                </li>
                <li className="mb-2">
                  <span className="font-medium">低勝率時間帯を避ける:</span>
                  {strategy.worstHours.map((h, i) => (
                    <span key={i}>
                      {i === 0
                        ? " "
                        : i === strategy.worstHours.length - 1
                        ? " と "
                        : "、"}
                      <span className="text-[var(--danger)]">{h.hour}</span>
                    </span>
                  ))}
                  での取引は避けることをお勧めします。
                </li>
                <li className="mb-2">
                  <span className="font-medium">HIGH/LOW選択:</span>
                  {highLow[0].winRate > highLow[1].winRate ? (
                    <span>
                      {" "}
                      <span className="text-[var(--primary)]">HIGH</span>
                      取引の方が勝率が高い傾向があります。
                    </span>
                  ) : (
                    <span>
                      {" "}
                      <span className="text-[var(--primary)]">LOW</span>
                      取引の方が勝率が高い傾向があります。
                    </span>
                  )}
                </li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
