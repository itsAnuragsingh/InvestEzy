import Link from 'next/link'
import {
  Home,
  LineChart,
  DollarSign,
  BarChart2,
  Sparkles
} from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="w-64 bg-card text-card-foreground p-6 border-r">
      <h1 className="text-2xl font-bold mb-8 text-purple-600 dark:text-purple-400">InvestEzy</h1>
      <nav>
        <ul className="space-y-4">
          <li>
            <Link href="/dashboard" className="flex items-center space-x-2 text-pink-600 hover:text-pink-700 dark:text-pink-400 dark:hover:text-pink-300">
              <Home size={20} />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link href="/dashboard/study-plan" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
              <LineChart size={20} />
              <span>Stock Analysis</span>
            </Link>
          </li>
          <li>
            <Link href="/dashboard/exam" className="flex items-center space-x-2 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300">
              <DollarSign size={20} />
              <span>Prize Predication</span>
            </Link>
          </li>
          
          <li>
            <Link href="/dashboard/performance" className="flex items-center space-x-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
              <BarChart2 size={20} />
              <span>Compare</span>
            </Link>
          </li>
          <li>
            <Link href="/dashboard/performance" className="flex items-center space-x-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
              <Sparkles size={20} />
              <span>Recomendation</span>
            </Link>
          </li>
           
        </ul>
      </nav>
    </div>
  )
}

export default Sidebar
