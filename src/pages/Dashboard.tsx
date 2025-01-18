import React from 'react';
import { Users, BookOpen, Calendar, FileText } from 'lucide-react';
import { storage, STORAGE_KEYS } from '../utils/storage';

const StatCard: React.FC<{
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}> = ({ title, value, icon, color }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center">
      <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
        {icon}
      </div>
      <div className="ml-4">
        <h3 className="text-gray-500 text-sm">{title}</h3>
        <p className="text-2xl font-semibold">{value}</p>
      </div>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const students = storage.get(STORAGE_KEYS.STUDENTS);
  const subjects = storage.get(STORAGE_KEYS.SUBJECTS);
  const attendance = storage.get(STORAGE_KEYS.ATTENDANCE);
  const results = storage.get(STORAGE_KEYS.RESULTS);

  const todayAttendance = attendance.filter(
    (a) => a.date === new Date().toISOString().split('T')[0]
  );

  const attendanceRate = todayAttendance.length
    ? (todayAttendance.filter((a) => a.status === 'present').length /
        todayAttendance.length) *
      100
    : 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={students.length}
          icon={<Users className="h-6 w-6 text-blue-500" />}
          color="bg-blue-500"
        />
        <StatCard
          title="Total Subjects"
          value={subjects.length}
          icon={<BookOpen className="h-6 w-6 text-green-500" />}
          color="bg-green-500"
        />
        <StatCard
          title="Today's Attendance"
          value={Math.round(attendanceRate)}
          icon={<Calendar className="h-6 w-6 text-yellow-500" />}
          color="bg-yellow-500"
        />
        <StatCard
          title="Total Results"
          value={results.length}
          icon={<FileText className="h-6 w-6 text-purple-500" />}
          color="bg-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Announcements</h2>
          <div className="space-y-4">
            {storage.get(STORAGE_KEYS.ANNOUNCEMENTS).slice(0, 3).map((announcement) => (
              <div key={announcement.id} className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-medium">{announcement.title}</h3>
                <p className="text-sm text-gray-600">{announcement.content}</p>
                <span className="text-xs text-gray-400">{new Date(announcement.date).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 text-left rounded-lg border border-gray-200 hover:border-blue-500 transition-colors">
              <Users className="h-6 w-6 text-blue-500 mb-2" />
              <span className="font-medium">Add Student</span>
            </button>
            <button className="p-4 text-left rounded-lg border border-gray-200 hover:border-green-500 transition-colors">
              <Calendar className="h-6 w-6 text-green-500 mb-2" />
              <span className="font-medium">Mark Attendance</span>
            </button>
            <button className="p-4 text-left rounded-lg border border-gray-200 hover:border-yellow-500 transition-colors">
              <FileText className="h-6 w-6 text-yellow-500 mb-2" />
              <span className="font-medium">Add Result</span>
            </button>
            <button className="p-4 text-left rounded-lg border border-gray-200 hover:border-purple-500 transition-colors">
              <BookOpen className="h-6 w-6 text-purple-500 mb-2" />
              <span className="font-medium">Manage Subjects</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;