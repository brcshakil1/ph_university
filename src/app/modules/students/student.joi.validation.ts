const Joi = require('joi')

// UserName schema
const userNameValidationSchema = Joi.object({
  firstName: Joi.string()
    .trim()
    .max(15)
    .regex(/^[A-Z][a-z]*$/, 'capitalized')
    .required()
    .messages({
      'string.empty': 'First name is required',
      'string.max': "First name's length have to be less than 15 characters",
      'string.pattern.name': '{#label} is not capitalized',
    }),
  middleName: Joi.string().allow(''), // Optional
  lastName: Joi.string()
    .regex(/^[A-Za-z]+$/, 'alpha')
    .required()
    .messages({
      'string.empty': 'Last name is required',
      'string.pattern.name': '{#label} is not only alpha character',
    }),
})

// Guardian schema
const guardianValidationSchema = Joi.object({
  fatherName: Joi.string().required().messages({
    'string.empty': "Father's name is required",
  }),
  fatherOccupation: Joi.string().required().messages({
    'string.empty': "Father's occupation is required",
  }),
  fatherContactNo: Joi.string().required().messages({
    'string.empty': "Father's contact number is required",
  }),
  motherName: Joi.string().required().messages({
    'string.empty': "Mother's name is required",
  }),
  motherOccupation: Joi.string().required().messages({
    'string.empty': "Mother's occupation is required",
  }),
  motherContactNo: Joi.string().required().messages({
    'string.empty': "Mother's contact is required",
  }),
})

// LocalGuardian schema
const localGuardianValidationSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': 'Local guardian name is required',
  }),
  occupation: Joi.string().required().messages({
    'string.empty': 'Local guardian occupation is required',
  }),
  contactNo: Joi.string().required().messages({
    'string.empty': 'Local guardian contact number is required',
  }),
  address: Joi.string().required().messages({
    'string.empty': 'Local guardian address is required',
  }),
})

// Student schema
const studentValidationSchema = Joi.object({
  id: Joi.string().required().messages({
    'string.empty': 'Student ID is required',
  }),
  name: userNameValidationSchema.required().messages({
    'any.required': 'Student name is required',
  }),
  gender: Joi.string().valid('male', 'female', 'other').required().messages({
    'any.only': '{#label} is not valid.',
    'string.empty': 'Gender is required',
  }),
  dateOfBirth: Joi.date().iso(), // Assuming dateOfBirth should be in ISO format
  email: Joi.string().email().required().messages({
    'string.email': '{#label} is not a valid email.',
    'string.empty': 'Email is required. Please, provide an email.',
  }),
  contactNumber: Joi.string().required().messages({
    'string.empty': 'Contact number is required',
  }),
  emergencyContactNo: Joi.string().required().messages({
    'string.empty': 'Emergency contact number is required',
  }),
  bloodGroup: Joi.string()
    .valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')
    .messages({
      'any.only': '{#label} is not a valid blood group',
    }),
  presentAddress: Joi.string().required().messages({
    'string.empty': 'Present address is required',
  }),
  permanentAddress: Joi.string().required().messages({
    'string.empty': 'Permanent address is required',
  }),
  guardian: guardianValidationSchema.required().messages({
    'any.required': 'Guardian information is required',
  }),
  localGuardian: localGuardianValidationSchema.required().messages({
    'any.required': 'Local guardian information is required',
  }),
  profileImage: Joi.string().uri(), // Assuming profileImage should be a URL
  isActive: Joi.string()
    .valid('active', 'inactive')
    .default('active')
    .required()
    .messages({
      'any.only': 'The student is active or inactive?',
      'string.empty': 'Student status is required',
    }),
})

export default studentValidationSchema
