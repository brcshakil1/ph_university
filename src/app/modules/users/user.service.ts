import config from '../../config';
import { TStudent } from '../students/student.interface';
import Student from '../students/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';

const createStudentIntoDB = async (password: string, studentData: TStudent) => {
  // create a user object
  const userData: Partial<TUser> = {};

  // if password is not given, use default password

  userData.password = password || (config.default_password as string);

  // set student role
  userData.role = 'student';

  // manually generated id
  userData.id = '2030100011';

  // create a user
  const mewUser = await User.create(userData); // built-in static method

  // create a student
  if (Object.keys(mewUser).length) {
    // set id, _id as user
    studentData.id = mewUser.id;
    studentData.user = mewUser._id; // reference _id

    const newStudent = await Student.create(studentData);

    return newStudent;
  }

  return mewUser;
};

export const UserServices = {
  createStudentIntoDB,
};
