import React, { useState } from 'react';
import { format } from 'date-fns';
import { Edit2, Trash2, Eye, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { storage, STORAGE_KEYS } from '../../utils/storage';
import type { Student } from '../../types';
import AllocationForm from './AllocationForm';

interface StudentListProps {
  onEdit: (student: Student) => void;
}

const StudentList: React.FC<StudentListProps> = ({ onEdit }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showAllocationForm, setShowAllocationForm] = useState(false);
  const students = storage.get<Student>(STORAGE_KEYS.STUDENTS);

  const filteredStudents = students.filter(student => 
    student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      storage.remove(STORAGE_KEYS.STUDENTS, id);
      toast.success('Student deleted successfully');
    }
  };

  const handleAllocation = (student: Student) => {
    setSelectedStudent(student);
    setShowAllocationForm(true);
  };

  const handleAllocationSuccess = () => {
    setShowAllocationForm(false);
    setSelectedStudent(null);
  };

  return (
    <div className="space-y-6">
      {showAllocationForm && selectedStudent && (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              Manage Allocations for {selectedStudent.firstName} {selectedStudent.lastName}
            </h2>
            <button
              onClick={() => setShowAllocationForm(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
          <AllocationForm
            student={selectedStudent}
            onSuccess={handleAllocationSuccess}
          />
        </div>
      )}

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admission No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parent Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {student.firstName} {student.middleName} {student.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {format(new Date(student.dateOfBirth), 'PP')}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.class}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.admissionNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.parent.fatherContact}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                    <button
                      onClick={() => onEdit(student)}
                      className="text-indigo-600 hover:text-indigo-900"
                      title="Edit Student"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(student.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete Student"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleAllocation(student)}
                      className="text-green-600 hover:text-green-900"
                      title="Manage Allocations"
                    >
                      <Package className="h-4 w-4" />
                    </button>
                    <button 
                      className="text-gray-600 hover:text-gray-900"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentList;