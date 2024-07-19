import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box, FormControl, InputLabel, Select, MenuItem, Button, Grid } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DOMPurify from 'dompurify';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  margin: 0 auto;
  text-align: center;
  background-color: #121212; /* Dark background */
  color: #fff; /* Light text */
  min-height: 100vh;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 20px;
  font-size: 2.5rem;
  color: #bb86fc; /* Modern accent color */
`;

const FilterBox = styled(Box)`
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const StyledFormControl = styled(FormControl)`
  width: 250px; /* Fixed width */
  margin-bottom: 10px;

  & .MuiInputLabel-root {
    color: #bb86fc; /* Modern accent color */
  }

  & .MuiInputBase-root {
    color: #fff; /* Light text */
    border-color: #bb86fc !important; /* Colored border */
  }

  & .MuiOutlinedInput-root {
    fieldset {
      border-color: #bb86fc; /* Colored border */
    }

    &:hover fieldset {
      border-color: #bb86fc; /* Colored border on hover */
    }

    &.Mui-focused fieldset {
      border-color: #bb86fc; /* Colored border when focused */
    }
  }

  & .MuiSelect-selectMenu {
    overflow: hidden; /* Prevent overflow issues */
  }
`;

const StyledButton = styled(Button)`
  height: 56px;
  background-color: #bb86fc; /* Modern accent color */
  color: #121212; /* Dark background */

  &:hover {
    background-color: #3700b3; /* Darker accent color */
  }
`;

const StyledAccordion = styled(Accordion)`
  border-radius: 8px;
  width: 100%;
  margin: 5px 0;
  background-color: #1e1e1e; /* Darker background */
  overflow: hidden; /* Ensure no overflow issues */

  & .MuiAccordionSummary-root {
    padding: 10px 20px;
  }

  & .MuiAccordionDetails-root {
    background-color: #d3d3c9; /* Dark detail background */
    border-radius: 0 0 8px 8px;
    padding: 20px;
  }
`;

const StyledTypography = styled(Typography)`
  margin-right: 20px;
  margin-bottom: 10px; /* Add spacing between elements */
`;

const FC_previousResults = () => {
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedResult, setSelectedResult] = useState('');
  const [selectedModel, setSelectedModel] = useState('');

  useEffect(() => {
    fetchResults();
  }, []);

  useEffect(() => {
    const uniqueTags = [...new Set(results.map(result => result.tag))];
    setTags(uniqueTags);
    filterResults();
  }, [results, selectedTag, selectedResult, selectedModel]);

  const fetchResults = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/results');
      setResults(response.data);
    } catch (error) {
      console.error("Error fetching results:", error);
    }
  };

  const filterResults = () => {
    let filtered = results;

    if (selectedTag) {
      filtered = filtered.filter(result => result.tag === selectedTag);
    }

    if (selectedResult) {
      filtered = filtered.filter(result => result.result === selectedResult);
    }

    if (selectedModel) {
      filtered = filtered.filter(result => result.model === selectedModel);
    }

    setFilteredResults(filtered);
  };

  const handleTagChange = (event) => {
    setSelectedTag(event.target.value);
  };

  const handleResultChange = (event) => {
    setSelectedResult(event.target.value);
  };

  const handleModelChange = (event) => {
    setSelectedModel(event.target.value);
  };

  const getBackgroundColor = (result) => {
    if (result === 'good') return '#59ff4a';
    if (result === 'mid') return '#f5ec76';
    if (result === 'bad') return 'rgb(230 105 116)';
    return '#fff';
  };

  return (
    <Container>
      <Title>Previous Results</Title>
      <FilterBox>
        <StyledFormControl variant="outlined">
          <InputLabel id="select-tag-label">Tag</InputLabel>
          <Select
            labelId="select-tag-label"
            value={selectedTag}
            onChange={handleTagChange}
            label="Tag"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {tags.map((tag, index) => (
              <MenuItem key={index} value={tag}>{tag}</MenuItem>
            ))}
          </Select>
        </StyledFormControl>
        <StyledFormControl variant="outlined">
          <InputLabel id="select-result-label">Result</InputLabel>
          <Select
            labelId="select-result-label"
            value={selectedResult}
            onChange={handleResultChange}
            label="Result"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="good">Good</MenuItem>
            <MenuItem value="mid">Mid</MenuItem>
            <MenuItem value="bad">Bad</MenuItem>
          </Select>
        </StyledFormControl>
        <StyledFormControl variant="outlined">
          <InputLabel id="select-model-label">Model</InputLabel>
          <Select
            labelId="select-model-label"
            value={selectedModel}
            onChange={handleModelChange}
            label="Model"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="gpt-3.5-turbo">GPT-3.5 Turbo</MenuItem>
            <MenuItem value="gpt-4">GPT-4</MenuItem>
          </Select>
        </StyledFormControl>
        <StyledButton variant="contained" onClick={filterResults}>Filter</StyledButton>
      </FilterBox>
      <Grid container spacing={2}>
        {filteredResults.map((result, index) => (
          <Grid item xs={12} key={index}>
            <StyledAccordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${index}-content`}
                id={`panel${index}-header`}
                style={{ backgroundColor: getBackgroundColor(result.result) }}
              >
                <Box display="flex" alignItems="center" width="100%" flexWrap="wrap">
                  <StyledTypography style={{ fontWeight: 'bold' }}>Question ID: {result.questionId}</StyledTypography>
                  <StyledTypography style={{ margin: 'auto'}}><strong>Rating Answer 1:</strong> {result.ratingAnswer1}</StyledTypography>
                  <StyledTypography style={{ margin: 'auto'}}><strong>Rating Answer 2:</strong> {result.ratingAnswer2}</StyledTypography>
                  <StyledTypography style={{ margin: 'auto'}}><strong>Rating Answer 3:</strong> {result.ratingAnswer3}</StyledTypography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography component="div" style={{ marginBottom: '10px' }}><strong>Full Message:</strong> <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(result.fullMessage) }} /></Typography>
                <Typography component="div" style={{ marginBottom: '10px' }}><strong>Answer 1:</strong> <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(result.answer1) }} /></Typography>
                <Typography component="div" style={{ marginBottom: '10px' }}><strong>Explanation for Rating 1:</strong> <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(result.explanationForRating1) }} /></Typography>
                <Typography component="div" style={{ marginBottom: '10px' }}><strong>Answer 2:</strong> <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(result.answer2) }} /></Typography>
                <Typography component="div" style={{ marginBottom: '10px' }}><strong>Explanation for Rating 2:</strong> <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(result.explanationForRating2) }} /></Typography>
                <Typography component="div" style={{ marginBottom: '10px' }}><strong>Answer 3:</strong> <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(result.answer3) }} /></Typography>
                <Typography component="div" style={{ marginBottom: '10px' }}><strong>Explanation for Rating 3:</strong> <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(result.explanationForRating3) }} /></Typography>
              </AccordionDetails>
            </StyledAccordion>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default FC_previousResults;
