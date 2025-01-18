import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import StudentList from './StudentList';
import StudentForm from './StudentForm';
import { Toast } from '../../components/ui/Toast';
import type { Student } from '../../types';

const Students: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | undefined>();

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingStudent(undefined);
  };

  return (
    <div className="space-y-6">
      <Toast />
      
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Students Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {showForm ? (
            <>
              <X className="h-5 w-5" />
              <span>Close Form</span>
            </>
          ) : (
            <>
              <Plus className="h-5 w-5" />
              <span>Add Student</span>
            </>
          )}
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {editingStudent ? 'Edit Student' : 'Add New Student'}
          </h2>
          <StudentForm
            initialData={editingStudent}
            onSuccess={handleFormSuccess}
          />
        </div>
      )}

      <StudentList onEdit={handleEdit} />
    </div>
  );
};

export default Students;