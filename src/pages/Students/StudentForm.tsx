import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { storage, STORAGE_KEYS } from '../../utils/storage';
import type { Student } from '../../types';

const studentSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  middleName: z.string().optional(),
  lastName: z.string().min(2, 'Last name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['male', 'female', 'other']),
  admissionNumber: z.string().min(1, 'Admission number is required'),
  class: z.string().min(1, 'Class is required'),
  address: z.object({
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zipCode: z.string().min(1, 'ZIP code is required'),
  }),
  parent: z.object({
    fatherName: z.string().min(1, 'Father\'s name is required'),
    fatherContact: z.string().min(1, 'Father\'s contact is required'),
    motherName: z.string().min(1, 'Mother\'s name is required'),
    motherContact: z.string().min(1, 'Mother\'s contact is required'),
    email: z.string().email('Invalid email address'),
  }),
  academics: z.object({
    books: z.object({
      textbooks: z.array(z.string()).optional(),
      workbooks: z.array(z.string()).optional(),
      notebooks: z.number().min(0).optional(),
    }).optional(),
    specialPrograms: z.object({
      tahfees: z.object({
        level: z.string().optional(),
        instructor: z.string().optional(),
        schedule: z.array(z.string()).optional(),
      }).optional(),
    }).optional(),
  }).optional(),
  extracurricular: z.object({
    clubs: z.array(z.object({
      name: z.string(),
      role: z.string(),
      joinDate: z.string(),
    })).optional(),
  }).optional(),
  resources: z.object({
    notebooks: z.object({
      allocated: z.number().min(0),
      received: z.array(z.string()),
    }).optional(),
  }).optional(),
});

type StudentFormData = z.infer<typeof studentSchema>;

interface StudentFormProps {
  onSuccess?: () => void;
  initialData?: Student;
}

const StudentForm: React.FC<StudentFormProps> = ({ onSuccess, initialData }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: initialData,
  });

  const classes = storage.get(STORAGE_KEYS.CLASSES);

  const onSubmit = (data: StudentFormData) => {
    try {
      if (initialData) {
        storage.update(STORAGE_KEYS.STUDENTS, initialData.id, {
          ...initialData,
          ...data,
        });
        toast.success('Student updated successfully');
      } else {
        const newStudent: Student = {
          id: crypto.randomUUID(),
          ...data,
          financials: {
            fees: {
              amount: 5000,
              paid: 0,
              due: 5000,
            },
          },
          uniform: {
            capsIssued: 0,
            uniformsIssued: 0,
          },
          academics: {
            books: {
              textbooks: [],
              workbooks: [],
              notebooks: 0,
            },
            specialPrograms: {},
          },
          extracurricular: {
            clubs: [],
          },
          resources: {
            notebooks: {
              allocated: 0,
              received: [],
            },
          },
        };
        storage.add(STORAGE_KEYS.STUDENTS, newStudent);
        
        // Create parent credentials
        const parentCredentials = {
          id: crypto.randomUUID(),
          studentId: newStudent.id,
          username: data.parent.email,
          password: `${data.firstName.toLowerCase()}${data.dateOfBirth.split('-')[0]}`,
        };
        storage.add(STORAGE_KEYS.PARENT_CREDENTIALS, parentCredentials);
        
        toast.success('Student added successfully');
        reset();
      }
      onSuccess?.();
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-sm rounded-lg p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">First Name</label>
          <input
            type="text"
            {...register('firstName')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Middle Name</label>
          <input
            type="text"
            {...register('middleName')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Last Name</label>
          <input
            type="text"
            {...register('lastName')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
          <input
            type="date"
            {...register('dateOfBirth')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.dateOfBirth && (
            <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Gender</label>
          <select
            {...register('gender')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && (
            <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Admission Number</label>
          <input
            type="text"
            {...register('admissionNumber')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.admissionNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.admissionNumber.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Class</label>
          <select
            {...register('class')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select Class</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.name}>
                {cls.name}
              </option>
            ))}
          </select>
          {errors.class && (
            <p className="mt-1 text-sm text-red-600">{errors.class.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Address Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Street</label>
            <input
              type="text"
              {...register('address.street')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.address?.street && (
              <p className="mt-1 text-sm text-red-600">{errors.address.street.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">City</label>
            <input
              type="text"
              {...register('address.city')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.address?.city && (
              <p className="mt-1 text-sm text-red-600">{errors.address.city.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">State</label>
            <input
              type="text"
              {...register('address.state')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.address?.state && (
              <p className="mt-1 text-sm text-red-600">{errors.address.state.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">ZIP Code</label>
            <input
              type="text"
              {...register('address.zipCode')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.address?.zipCode && (
              <p className="mt-1 text-sm text-red-600">{errors.address.zipCode.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Parent Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Father's Name</label>
            <input
              type="text"
              {...register('parent.fatherName')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.parent?.fatherName && (
              <p className="mt-1 text-sm text-red-600">{errors.parent.fatherName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Father's Contact</label>
            <input
              type="text"
              {...register('parent.fatherContact')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.parent?.fatherContact && (
              <p className="mt-1 text-sm text-red-600">{errors.parent.fatherContact.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Mother's Name</label>
            <input
              type="text"
              {...register('parent.motherName')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.parent?.motherName && (
              <p className="mt-1 text-sm text-red-600">{errors.parent.motherName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Mother's Contact</label>
            <input
              type="text"
              {...register('parent.motherContact')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.parent?.motherContact && (
              <p className="mt-1 text-sm text-red-600">{errors.parent.motherContact.message}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              {...register('parent.email')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.parent?.email && (
              <p className="mt-1 text-sm text-red-600">{errors.parent.email.message}</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Academic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Allocated Notebooks</label>
            <input
              type="number"
              {...register('resources.notebooks.allocated')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Tahfees Level</label>
            <input
              type="text"
              {...register('academics.specialPrograms.tahfees.level')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Tahfees Instructor</label>
            <input
              type="text"
              {...register('academics.specialPrograms.tahfees.instructor')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => reset()}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Reset
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {initialData ? 'Update Student' : 'Add Student'}
        </button>
      </div>
    </form>
  );
};

export default StudentForm;