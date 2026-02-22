'use client'

import { 
  BarChart as RechartsBarChart, 
  Bar, 
  LineChart as RechartsLineChart, 
  Line, 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts'
import { formatCurrency, formatNumber } from '@/lib/format'

// Medicare color palette
const COLORS = ['#1a73e8', '#0d47a1', '#4285f4', '#1557b0', '#1976d2', '#2196f3', '#42a5f5', '#64b5f6']

interface ChartData {
  [key: string]: any
}

interface BaseChartProps {
  data: ChartData[]
  width?: number
  height?: number
  className?: string
}

interface BarChartProps extends BaseChartProps {
  xDataKey: string
  yDataKey: string
  title?: string
  color?: string
}

interface LineChartProps extends BaseChartProps {
  xDataKey: string
  yDataKey: string
  title?: string
  color?: string
  valueFormatter?: (value: number) => string
  tooltipFormatter?: (value: number) => string
}

interface PieChartProps extends BaseChartProps {
  dataKey: string
  nameKey: string
  title?: string
}

// Custom tooltip for currency formatting
const CurrencyTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 shadow-lg rounded">
        <p className="font-medium">{`${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {`${entry.dataKey}: ${formatCurrency(entry.value)}`}
          </p>
        ))}
      </div>
    )
  }
  return null
}

// Custom tooltip for number formatting
const NumberTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 shadow-lg rounded">
        <p className="font-medium">{`${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {`${entry.dataKey}: ${formatNumber(entry.value)}`}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function BarChart({ 
  data, 
  xDataKey, 
  yDataKey, 
  title, 
  color = '#1a73e8', 
  height = 300,
  className = ''
}: BarChartProps) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
      {title && <h3 className="text-lg font-semibold mb-4 text-gray-900">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis 
            dataKey={xDataKey} 
            stroke="#6b7280"
            fontSize={12}
          />
          <YAxis 
            stroke="#6b7280"
            fontSize={12}
            tickFormatter={(value) => formatCurrency(value)}
          />
          <Tooltip content={<CurrencyTooltip />} />
          <Bar dataKey={yDataKey} fill={color} radius={[4, 4, 0, 0]} />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function LineChart({ 
  data, 
  xDataKey, 
  yDataKey, 
  title, 
  color = '#1a73e8', 
  height = 300,
  className = ''
}: LineChartProps) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
      {title && <h3 className="text-lg font-semibold mb-4 text-gray-900">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <RechartsLineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis 
            dataKey={xDataKey} 
            stroke="#6b7280"
            fontSize={12}
          />
          <YAxis 
            stroke="#6b7280"
            fontSize={12}
            tickFormatter={(value) => formatCurrency(value)}
          />
          <Tooltip content={<CurrencyTooltip />} />
          <Line 
            type="monotone" 
            dataKey={yDataKey} 
            stroke={color} 
            strokeWidth={3}
            dot={{ r: 4, fill: color }}
            activeDot={{ r: 6, fill: color }}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  )
}

export function PieChart({ 
  data, 
  dataKey, 
  nameKey, 
  title, 
  height = 300,
  className = ''
}: PieChartProps) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
      {title && <h3 className="text-lg font-semibold mb-4 text-gray-900">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }: any) => `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey={dataKey}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: any) => [formatCurrency(value), 'Amount']}
          />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  )
}

// Trend chart specifically for time series data
export function TrendChart({ 
  data, 
  xDataKey, 
  yDataKey, 
  title, 
  height = 400,
  className = '',
  valueFormatter,
  tooltipFormatter,
}: LineChartProps) {
  const yTickFormatter = valueFormatter || ((value: number) => formatCurrency(value))
  const tipFormatter = tooltipFormatter || valueFormatter || ((value: number) => formatCurrency(value))

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null
    return (
      <div className="bg-white p-3 border rounded-lg shadow-lg">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-sm text-blue-600 font-semibold">{tipFormatter(payload[0].value)}</p>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
      {title && <h3 className="text-lg font-semibold mb-4 text-gray-900">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <RechartsLineChart data={data} margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis 
            dataKey={xDataKey} 
            stroke="#6b7280"
            fontSize={12}
          />
          <YAxis 
            stroke="#6b7280"
            fontSize={12}
            tickFormatter={yTickFormatter}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey={yDataKey} 
            stroke="#1a73e8" 
            strokeWidth={3}
            dot={{ r: 5, fill: '#1a73e8' }}
            activeDot={{ r: 7, fill: '#0d47a1' }}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  )
}