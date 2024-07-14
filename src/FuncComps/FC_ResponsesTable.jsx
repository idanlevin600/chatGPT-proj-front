import React, { useState } from 'react';
import Box from "@mui/material/Box";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@mui/material';
import './ResponsesTable.css'; // Make sure to import the CSS file
import Container from '@mui/material/Container';

export default function ResponsesTable({ data }) {

  console.log("data:", data);
  const columns = [
    { id: 'questionId', name: 'QuestionId' },
    { id: 'fullMessage', name: 'FullMessage' },
    { id: 'answer1', name: 'Answer1' },
    { id: 'ratingAnswer1', name: 'RatingAnswer1' },
    { id: 'explanationForRating1', name: 'ExplanationForRating1' },
    { id: 'answer2', name: 'Answer2' },
    { id: 'ratingAnswer2', name: 'RatingAnswer2' },
    { id: 'explanationForRating2', name: 'ExplanationForRating2' },
    { id: 'answer3', name: 'Answer3' },
    { id: 'ratingAnswer3', name: 'RatingAnswer3' },
    { id: 'explanationForRating3', name: 'ExplanationForRating3' },
  ];

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <>
      <Container>
        <Box sx={{
          marginTop: "20px",
          backgroundColor: "grey.200",
          padding: 2,
          borderRadius: "3px",
          boxShadow: 4,
          overflowX: 'auto'
        }}>
          <TableContainer component={Paper}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead style={{ backgroundColor: 'white' }}>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell key={column.id} style={{ fontWeight: 'bold' }}>{column.name}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data && data
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, i) => {
                    return (
                      <TableRow key={i} className="table-row">
                        <TableCell>
                          {row.questionId}
                        </TableCell>
                        <TableCell>
                          {row.question}
                        </TableCell>
                        <TableCell style={{ color: "green" }}>
                          {row.answer1}
                        </TableCell>
                        <TableCell>
                          {row.rating_Answer1}
                        </TableCell>
                        <TableCell>
                          {row.explanation_for_rating1}
                        </TableCell>
                        <TableCell style={{ color: "orange" }}>
                          {row.answer2}
                        </TableCell>
                        <TableCell>
                          {row.rating_Answer2}
                        </TableCell>
                        <TableCell>
                          {row.explanation_for_rating2}
                        </TableCell>
                        <TableCell style={{ color: "red" }}>
                          {row.answer3}
                        </TableCell>
                        <TableCell>
                          {row.rating_Answer3}
                        </TableCell>
                        <TableCell>
                          {row.explanation_for_rating3}
                        </TableCell>
                      </TableRow>
                    )
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination 
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleChangeRowsPerPage} 
          />
        </Box>
      </Container>
    </>
  );
}
