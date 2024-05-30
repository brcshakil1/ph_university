import { Schema, model } from 'mongoose';
import { TAcademicSemester } from './academicSemester.interface';
import {
  Months,
  academicSemesterCode,
  academicSemesterName,
} from './academicSemester.constant';

const academicSemesterSchema = new Schema<TAcademicSemester>({
  name: { type: String, required: true, enum: academicSemesterName },
  code: { type: String, enum: academicSemesterCode, required: true },
  year: { type: Date, required: true },
  startMonth: { type: String, enum: Months },
  endMonth: { type: String, enum: Months },
});

const AcademicSemester = model<TAcademicSemester>(
  'AcademicSemester',
  academicSemesterSchema,
);

export default AcademicSemester;
