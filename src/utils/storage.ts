export const STORAGE_KEYS = {
  STUDENTS: 'students',
  CLASSES: 'classes',
  SUBJECTS: 'subjects',
  ATTENDANCE: 'attendance',
  RESULTS: 'results',
  ANNOUNCEMENTS: 'announcements',
  PARENT_CREDENTIALS: 'parent_credentials',
} as const;

class Storage {
  private getItem<T>(key: string): T[] {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : [];
  }

  private setItem(key: string, value: unknown): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  get<T>(key: string): T[] {
    return this.getItem<T>(key);
  }

  set(key: string, value: unknown): void {
    this.setItem(key, value);
  }

  add<T extends { id: string }>(key: string, item: T): void {
    const items = this.get<T>(key);
    items.push(item);
    this.set(key, items);
  }

  update<T extends { id: string }>(key: string, id: string, updatedItem: T): void {
    const items = this.get<T>(key);
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
      items[index] = updatedItem;
      this.set(key, items);
    }
  }

  remove(key: string, id: string): void {
    const items = this.get(key);
    const filtered = items.filter(item => item.id !== id);
    this.set(key, filtered);
  }

  init(): void {
    // Initialize sample data if not exists
    if (this.get(STORAGE_KEYS.STUDENTS).length === 0) {
      this.set(STORAGE_KEYS.STUDENTS, [
        {
          id: '1',
          firstName: 'John',
          middleName: 'Robert',
          lastName: 'Doe',
          dateOfBirth: '2005-05-15',
          gender: 'male',
          admissionNumber: 'ADM001',
          class: '10A',
          address: {
            street: '123 School Lane',
            city: 'Springfield',
            state: 'IL',
            zipCode: '62701'
          },
          parent: {
            fatherName: 'Robert Doe',
            fatherContact: '+1234567890',
            motherName: 'Jane Doe',
            motherContact: '+1234567891',
            email: 'parents@example.com'
          },
          financials: {
            fees: {
              amount: 5000,
              paid: 3000,
              due: 2000,
              lastPaymentDate: '2024-02-15'
            }
          },
          uniform: {
            capsIssued: 2,
            uniformsIssued: 2,
            lastIssuedDate: '2024-01-10'
          }
        }
      ]);
    }

    if (this.get(STORAGE_KEYS.CLASSES).length === 0) {
      this.set(STORAGE_KEYS.CLASSES, [
        { id: '1', name: '10A', capacity: 30, currentStrength: 25, academicYear: '2023-2024', teacher: 'Mr. Johnson', subjects: ['1', '2'] },
        { id: '2', name: '10B', capacity: 30, currentStrength: 28, academicYear: '2023-2024', teacher: 'Mrs. Davis', subjects: ['1', '2'] },
        { id: '3', name: '9A', capacity: 30, currentStrength: 22, academicYear: '2023-2024', teacher: 'Ms. Wilson', subjects: ['1', '2'] }
      ]);
    }

    if (this.get(STORAGE_KEYS.SUBJECTS).length === 0) {
      this.set(STORAGE_KEYS.SUBJECTS, [
        { id: '1', name: 'Mathematics', teacher: 'Mr. Johnson', maxScore: 100 },
        { id: '2', name: 'English', teacher: 'Mrs. Davis', maxScore: 100 },
        { id: '3', name: 'Science', teacher: 'Ms. Wilson', maxScore: 100 }
      ]);
    }

    if (this.get(STORAGE_KEYS.RESULTS).length === 0) {
      this.set(STORAGE_KEYS.RESULTS, [
        {
          id: '1',
          studentId: '1',
          classId: '1',
          subjectId: '1',
          teacherId: 'teacher1',
          term: '1st Term',
          academicYear: '2023-2024',
          assessments: [
            { type: 'CW', score: 85, maxScore: 100, date: '2024-01-15' },
            { type: 'HW', score: 90, maxScore: 100, date: '2024-01-20' },
            { type: 'EXAM', score: 88, maxScore: 100, date: '2024-02-01' }
          ],
          totalScore: 88,
          grade: 'A',
          status: 'PENDING',
          submittedAt: '2024-02-02T10:00:00Z',
          attendance: 95
        }
      ]);
    }

    if (this.get(STORAGE_KEYS.ANNOUNCEMENTS).length === 0) {
      this.set(STORAGE_KEYS.ANNOUNCEMENTS, [
        {
          id: '1',
          title: 'Welcome to New Academic Year',
          content: 'We are excited to start the new academic year. Please check the notice board for important dates.',
          date: '2024-01-15'
        },
        {
          id: '2',
          title: 'Parent-Teacher Meeting',
          content: 'The first parent-teacher meeting will be held next week. Schedule will be shared soon.',
          date: '2024-02-01'
        }
      ]);
    }
  }
}

export const storage = new Storage();