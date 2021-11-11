import React from 'react'

import {
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  ResponsiveContainer,
} from 'recharts'

const _data = [
  {
    key: '15/10',
    value: 66.5,
  },
  {
    key: '16/10',
    value: 74,
  },
  {
    key: '17/10',
    value: 82.9,
  },
  {
    key: '18/10',
    value: 22,
  },
  {
    key: '19/10',
    value: 109,
  },
  {
    key: '20/10',
    value: 101,
  },
  {
    key: '21/10',
    value: 46.65,
  },
]

const Chart = ({ className = '', data = _data }) => (
  <div className={`w-full h-48 ${className}`}>
    <ResponsiveContainer>
      <LineChart className='text-sm bg-gray-200 rounded' data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey='key' axisLine={false} tickLine={false} />
        <YAxis
          className='text-sm'
          axisLine={false}
          tickLine={false}
          mirror={true}
        />
        <Tooltip formatter={value => ['€ ' + value.toFixed(2), 'Totale']} />
        <Line
          type='monotone'
          dataKey='value'
          strokeWidth='2'
          stroke='#1a6731'
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
)

export default Chart
