"use client"
import { Ellipsis } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts"

const data = [
  { name: "Jan", income: 400, expense: 240 },
  { name: "Feb", income: 3000, expense: 1398 },
  { name: "Mar", income: 2000, expense: 9800 },
  { name: "Apr", income: 2780, expense: 3908 },
  { name: "May", income: 1890, expense: 4800 },
  { name: "July", income: 2390, expense: 3800 },
  { name: "Aug", income: 3490, expense: 4300 },
  { name: "Sept", income: 3490, expense: 4300 },
  { name: "Oct", income: 3490, expense: 4300 },
  { name: "Nov", income: 3490, expense: 4300 },
  { name: "Dec", income: 3490, expense: 4300 }
]

const FinanceChart = () => {
  return (
    <div className="bg-white rounded-lg w-full p-3 shadow-sm sm:shadow-md">
      <div className="flex justify-between items-center mb-3 sm:mb-4">
        <h2 className="text-sm sm:text-base font-semibold">Finance Summary</h2>
        <Ellipsis className="w-4 h-4 text-gray-500 cursor-pointer" />
      </div>

      {/* Desktop Chart */}
      <div className="hidden sm:block">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} width={40} />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "6px",
                fontSize: "12px"
              }}
            />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
            <Line type="monotone" dataKey="income" stroke="#3b82f6" strokeWidth={2} />
            <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Mobile View */}
      <div className="sm:hidden">
        <div className="grid grid-cols-3 gap-2 mb-2 px-1 text-xs font-medium text-gray-500">
          <div>Month</div>
          <div className="text-right text-blue-500">Income</div>
          <div className="text-right text-red-500">Expense</div>
        </div>
        
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {data.map((item, index) => (
            <div 
              key={index} 
              className="grid grid-cols-3 gap-2 items-center p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="text-sm font-medium">{item.name}</div>
              <div className="text-right text-sm text-blue-500">
                ₦{item.income.toLocaleString()}
              </div>
              <div className="text-right text-sm text-red-500">
                ₦{item.expense.toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500 text-center">
          Scroll to view all months
        </div>
      </div>
    </div>
  )
}

export default FinanceChart