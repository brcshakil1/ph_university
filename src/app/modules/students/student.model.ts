import { Schema, model } from 'mongoose'
import {
  TGuardian,
  TLocalGuardian,
  TStudent,
  // TStudentMethods,
  StudentModel,
  TUserName,
} from './student.interface'
import validator from 'validator'
import bcrypt from 'bcrypt'
import config from '../../config'

// creating schemas
const userNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    // maxlength: [15, "First name's length have to me less than 15 characters"],
    trim: true,
    // validate: {
    //   validator: function (value: string) {
    //     const firstName = value.charAt(0).toUpperCase() + value.slice(1)
    //     return firstName === value
    //   },
    //   message: '{VALUE} is not capitalized',
    // },
  },
  middleName: { type: String },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    validate: {
      validator: (value: string) => validator.isAlpha(value),
      message: '{VALUE} is not only alpha character',
    },
  },
})

const guardianSchema = new Schema<TGuardian>({
  fatherName: { type: String, required: [true, "Father's name is required"] },
  fatherOccupation: {
    type: String,
    required: [true, "Father's occupation is required"],
  },
  fatherContactNo: {
    type: String,
    required: [true, "Father's contact number is required"],
  },
  motherName: { type: String, required: [true, "mother's name is required"] },
  motherOccupation: {
    type: String,
    required: [true, "mother's occupation is required"],
  },
  motherContactNo: {
    type: String,
    required: [true, "mother's contact is required"],
  },
})

const localGuardianSchema = new Schema<TLocalGuardian>({
  name: { type: String, required: true },
  occupation: { type: String, required: true },
  contactNo: { type: String, required: true },
  address: { type: String, required: true },
})

const studentSchema = new Schema<TStudent, StudentModel>(
  {
    id: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: true,
      maxlength: [20, 'Password will have less than 20 characters'],
    },
    name: {
      type: userNameSchema,
      required: [true, 'Student name is required'],
    },
    gender: {
      type: String,
      enum: {
        values: ['male', 'female', 'other'],
        message: '{VALUE} is not valid.',
      },
      required: true,
    }, // enum type
    dateOfBirth: { type: String },
    email: {
      type: String,
      required: [true, 'Email is required. Please, provide an email.'],
      unique: true,
      validate: {
        validator: (value: string) => validator.isEmail(value),
        message: '{VALUE} is not a valid email.',
      },
    },
    contactNumber: {
      type: String,
      required: [true, 'Contact number is required field'],
    },
    emergencyContactNo: {
      type: String,
      required: [true, 'Emergency contact number is required'],
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    }, // enam type
    presentAddress: {
      type: String,
      required: [true, 'Present address is required'],
    },
    permanentAddress: {
      type: String,
      required: [true, 'Permanent address is required'],
    },
    guardian: {
      type: guardianSchema,
      required: true,
    },
    localGuardian: {
      type: localGuardianSchema,
      required: true,
    },
    profileImage: { type: String },
    isActive: {
      type: String,
      enum: {
        values: ['active', 'inactive'],
        message: 'The student is active or inactive?',
      },
      default: 'active',
      required: true,
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    toJSON: {
      virtuals: true,
    },
  },
)

// virtual
studentSchema.virtual('fullName').get(function () {
  return `${this.name.firstName} ${this.name.middleName && this.name.middleName} ${this.name.lastName}`
})

// pre save middleware/ hooks: will work in create(), save()
studentSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_routes),
  )
  next()
})

// pre find middleware/ hook
// Query middleware
studentSchema.pre('find', function (next) {
  // console.log(this, 'query middleware')
  this.find({ isDeleted: { $ne: true } })
  next()
})
studentSchema.pre('findOne', function (next) {
  // console.log(this, 'query middleware')
  this.find({ isDeleted: { $ne: true } })
  next()
})
studentSchema.pre('aggregate', function (next) {
  // console.log(this, 'query middleware')
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } })
  next()
})

// post save middleware/ hooks
studentSchema.post('save', function (doc, next) {
  doc.password = ''
  next()
})

// creating a custom static method
studentSchema.statics.isUserExists = async function (id: string) {
  const existingUser = await Student.findOne({ id })
  return existingUser
}

// creating a custom instance method

// studentSchema.methods.isUserExists = async function (id: string) {
//   const existingUser = await Student.findOne({ id })
//   return existingUser
// }

// create a model for student
const Student = model<TStudent, StudentModel>('Student', studentSchema)

export default Student
