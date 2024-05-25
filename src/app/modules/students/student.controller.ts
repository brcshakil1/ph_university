/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express'
import { StudentServices } from './student.service'
import StudentValidationSchema from './student.validation'

const createStudent = async (req: Request, res: Response) => {
  try {
    const { student: studentData } = req.body

    // validate data by joi
    // const { error, } = studentValidationSchema.validate(studentData)

    // zod validation
    const zodParseData = StudentValidationSchema.parse(studentData)

    // will call service func to send the data
    const result = await StudentServices.createStudentIntoDB(zodParseData)

    res.status(200).json({
      success: true,
      message: 'Student create successfully!',
      data: result,
    })

    // if (error) {
    //   res.status(200).json({
    //     success: false,
    //     message: "You've got successfully error",
    //     error,
    //   })
    // }
  } catch (err: any) {
    res.status(200).json({
      success: false,
      message: err.message || "You've got successfully error",
      error: err,
    })
  }
}

const getAllStudent = async (req: Request, res: Response) => {
  try {
    const result = await StudentServices.getAllStudentFromDB()

    res.status(200).json({
      success: true,
      message: 'Students are retrieved successfully!',
      data: result,
    })
  } catch (err: any) {
    res.status(200).json({
      success: false,
      message: err.message || "You've got successfully error",
      error: err,
    })
  }
}

const getSingleStudent = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params
    const result = await StudentServices.getSingleStudentFromDB(studentId)

    res.status(200).json({
      success: true,
      message: 'Student info got successfully',
      data: result,
    })
  } catch (err: any) {
    res.status(200).json({
      success: false,
      message: err.message || "You've got successfully error",
      error: err,
    })
  }
}

const deleteSingleStudent = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params
    const result = await StudentServices.deleteStudentFromDB(studentId)

    res.status(200).json({
      success: true,
      message: 'Student has deleted successfully',
      data: result,
    })
  } catch (err: any) {
    res.status(200).json({
      success: false,
      message: err.message || "You've got successfully error",
      error: err,
    })
  }
}

export const StudentControllers = {
  createStudent,
  getAllStudent,
  getSingleStudent,
  deleteSingleStudent,
}
