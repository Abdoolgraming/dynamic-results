import React from 'react';
import { BarChart3, TrendingUp, Users } from 'lucide-react';
import type { Result } from '../../types/results';

interface ResultsStatsProps {
  results: Result[];
}

const ResultsStats: React.FC<ResultsStatsProps> = ({ results }) => {
  const calculateStats = () => {
    if (results.length === 0) return { avgScore: 0, passRate: 0, gradeDistribution: {} };

    const totalScore = results.reduce((sum, r) => sum + r.totalScore, 0);
    const avgScore = totalScore / results.length;
    
    const passing = results.filter(r => r.totalScore >= 50).length;
    const passRate = (passing / results.length) * 100;

    const gradeDistribution = results.reduce((acc, r) => {
      acc[r.grade] = (acc[r.grade] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { avgScore, passRate, gradeDistribution };
  };

  const { avgScore, passRate, gradeDistribution } = calculateStats();

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Overview</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BarChart3 className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm text-gray-500">Average Score</span>
            </div>
            <span className="text-lg font-medium">{avgScore.toFixed(1)}%</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm text-gray-500">Pass Rate</span>
            </div>
            <span className="text-lg font-medium">{passRate.toFixed(1)}%</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm text-gray-500">Total Students</span>
            </div>
            <span className="text-lg font-medium">{results.length}</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Grade Distribution</h3>
        <div className="space-y-2">
          {Object.entries(gradeDistribution).map(([grade, count]) => (
            <div key={grade} className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Grade {grade}</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{
                      width: `${(count / results.length) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-sm font-medium">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResultsStats;