import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { storage, STORAGE_KEYS } from '../../utils/storage';
import type { Student } from '../../types';

const allocationSchema = z.object({
  notebooks: z.object({
    quantity: z.number().min(0, 'Quantity must be 0 or greater'),
    dateAllocated: z.string(),
  }),
  textbooks: z.array(z.object({
    name: z.string().min(1, 'Textbook name is required'),
    quantity: z.number().min(1, 'Quantity must be at least 1'),
  })),
  uniform: z.object({
    cardigans: z.number().min(0, 'Quantity must be 0 or greater'),
    uniforms: z.number().min(0, 'Quantity must be 0 or greater'),
    caps: z.number().min(0, 'Quantity must be 0 or greater'),
    hijabs: z.number().min(0, 'Quantity must be 0 or greater'),
  }),
  tahfeez: z.object({
    level: z.string().min(1, 'Level is required'),
    instructor: z.string().min(1, 'Instructor name is required'),
    schedule: z.array(z.string()),
  }),
  fees: z.object({
    amount: z.number().min(0, 'Amount must be 0 or greater'),
    dueDate: z.string(),
    paymentType: z.enum(['FULL', 'INSTALLMENT']),
  }),
});

type AllocationFormData = z.infer<typeof allocationSchema>;

interface AllocationFormProps {
  student: Student;
  onSuccess: () => void;
}

const AllocationForm: React.FC<AllocationFormProps> = ({ student, onSuccess }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<AllocationFormData>({
    resolver: zodResolver(allocationSchema),
    defaultValues: {
      notebooks: {
        quantity: student.resources?.notebooks.allocated || 0,
        dateAllocated: new Date().toISOString().split('T')[0],
      },
      textbooks: student.academics?.books.textbooks.map(name => ({ name, quantity: 1 })) || [],
      uniform: {
        cardigans: 0,
        uniforms: student.uniform.uniformsIssued,
        caps: student.uniform.capsIssued,
        hijabs: 0,
      },
      tahfeez: {
        level: student.academics?.specialPrograms.tahfees?.level || '',
        instructor: student.academics?.specialPrograms.tahfees?.instructor || '',
        schedule: student.academics?.specialPrograms.tahfees?.schedule || [],
      },
      fees: {
        amount: student.financials.fees.amount,
        dueDate: new Date().toISOString().split('T')[0],
        paymentType: 'FULL',
      },
    },
  });

  const onSubmit = (data: AllocationFormData) => {
    try {
      const updatedStudent = {
        ...student,
        resources: {
          ...student.resources,
          notebooks: {
            allocated: data.notebooks.quantity,
            received: [...(student.resources?.notebooks.received || []), data.notebooks.dateAllocated],
          },
        },
        academics: {
          ...student.academics,
          books: {
            textbooks: data.textbooks.map(book => book.name),
            workbooks: student.academics?.books.workbooks || [],
            notebooks: data.notebooks.quantity,
          },
          specialPrograms: {
            tahfees: {
              level: data.tahfeez.level,
              instructor: data.tahfeez.instructor,
              schedule: data.tahfeez.schedule,
            },
          },
        },
        uniform: {
          capsIssued: data.uniform.caps,
          uniformsIssued: data.uniform.uniforms,
          lastIssuedDate: new Date().toISOString(),
        },
        financials: {
          ...student.financials,
          fees: {
            ...student.financials.fees,
            amount: data.fees.amount,
          },
        },
      };

      storage.update(STORAGE_KEYS.STUDENTS, student.id, updatedStudent);
      toast.success('Allocations updated successfully');
      onSuccess();
    } catch (error) {
      toast.error('Failed to update allocations');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Notebooks Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Notebooks Allocation</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              {...register('notebooks.quantity', { valueAsNumber: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.notebooks?.quantity && (
              <p className="mt-1 text-sm text-red-600">{errors.notebooks.quantity.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date Allocated</label>
            <input
              type="date"
              {...register('notebooks.dateAllocated')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Uniform Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Uniform Items</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Cardigans</label>
            <input
              type="number"
              {...register('uniform.cardigans', { valueAsNumber: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Uniforms</label>
            <input
              type="number"
              {...register('uniform.uniforms', { valueAsNumber: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Caps</label>
            <input
              type="number"
              {...register('uniform.caps', { valueAsNumber: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Hijabs</label>
            <input
              type="number"
              {...register('uniform.hijabs', { valueAsNumber: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Tahfeez Program */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Tahfeez Program</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Level</label>
            <input
              type="text"
              {...register('tahfeez.level')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Instructor</label>
            <input
              type="text"
              {...register('tahfeez.instructor')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* School Fees */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-4">School Fees</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <input
              type="number"
              {...register('fees.amount', { valueAsNumber: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Due Date</label>
            <input
              type="date"
              {...register('fees.dueDate')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Type</label>
            <select
              {...register('fees.paymentType')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="FULL">Full Payment</option>
              <option value="INSTALLMENT">Installment</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Save Allocations
        </button>
      </div>
    </form>
  );
};

export default AllocationForm;