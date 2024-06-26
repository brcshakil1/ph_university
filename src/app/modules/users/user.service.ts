import mongoose from 'mongoose';
import config from '../../config';
import AcademicSemester from '../academicSemester/academicSemester.model';
// import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { TStudent } from '../students/student.interface';
import Student from '../students/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import { generateStudentId } from './user.utils';
import httpStatus from 'http-status';
import AppError from './../../errors/AppError';

const createStudentIntoDB = async (password: string, payload: TStudent) => {
  // create a user object
  const userData: Partial<TUser> = {};

  // if password is not given, use default password

  userData.password = password || (config.default_password as string);

  // set student role
  userData.role = 'student';

  // find academic semester info
  const admissionSemester = await AcademicSemester.findById(
    payload.admissionSemester,
  );

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    // manually generated id
    userData.id = await generateStudentId(admissionSemester);
    // create a user (transaction-1)
    const newUser = await User.create([userData], { session }); // built-in static method

    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create new user');
    }

    // create a student (transaction-1\2)
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; // reference _id

    const newStudent = await Student.create([payload], { session });

    if (!newStudent.length) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to create new student',
      );
    }

    await session.commitTransaction();
    await session.endSession();

    return newStudent;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(400, err);
  }
};

export const UserServices = {
  createStudentIntoDB,
};
