import React from 'react'

import { utils } from 'ethers'

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
} from '@mui/material'

import langHook from '@hooks/localHook'
import { profileLang } from '@langs/index'

import { dateTimeConversion, scoreGrade } from '@utils/index'

import type { SourceDaoRes } from '..'

interface TestRecordProps {
  rows: SourceDaoRes[]
  handleRecord: (currentRecord: SourceDaoRes) => void
}

export default ({ rows, handleRecord }: TestRecordProps): JSX.Element => {
  const local = langHook()

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell colSpan={5}>
              <Typography variant="h6">
                {local(profileLang.testRecord)}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{local(profileLang.certificationName)}</TableCell>
            <TableCell>{local(profileLang.submittedTime)}</TableCell>
            <TableCell>{local(profileLang.result)}</TableCell>
            <TableCell>{local(profileLang.fee)}</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow
              key={index}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.typeName}
              </TableCell>
              <TableCell>
                {dateTimeConversion(
                  parseInt(row.time.toString()) * 1000,
                  'YYYY-MM-DD HH:mm:ss'
                )}
              </TableCell>
              <TableCell>{scoreGrade(row.score)}</TableCell>
              <TableCell>{utils.formatEther(row.lowCost.toString()) + row.costUnit}</TableCell>
              <TableCell>
                <Button
                  sx={{ color: '#2F79FF' }}
                  onClick={() => handleRecord(row)}
                >
                  {local(profileLang.details)}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
