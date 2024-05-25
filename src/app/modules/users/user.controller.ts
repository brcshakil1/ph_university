export interface User {
  id: string
  password: string
  needsPasswordChange: boolean
  role: 'admin' | 'student' | 'faculty'
}

export interface TStudent {
  _id: string
  id: string // generated
  user: User
  name: string
  gender: string
  dateOfBirth: Date
  email: string
  contactNo: string
  emergencyContactNo: string
  presentAddress: string
  permanentAddress: string
  guardian: string
  localGuardian: string
  profileImage: string
  status: string
  academicDepartment: string
  isDeleted: boolean
  createdAt: Date
  updatedAt: Date
}
