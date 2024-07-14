import React, { useState } from 'react';
import { Button, CircularProgress, Card, CardContent, Typography, Modal, Box, IconButton, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Papa from 'papaparse';
import { convertToCSV, downloadCSV } from '../Util/csvUtils.js';
import InfoIcon from '@mui/icons-material/Info';
import { useCountUp } from 'use-count-up';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '60%',
    maxHeight: '80%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    overflowY: 'auto',
};

const getBackgroundColor = (response) => {   

    const {result} = response;

    if (result == 'good')
        return '#59ff4a'
    else if (result == 'mid')
        return '#f5ec76'
    else if (result == 'bad')
        return '#f8d7da' 
};

export default function FC_insertData() {
    const [fileData, setFileData] = useState([]);
    const [fileUploaded, setFileUploaded] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [responses, setResponses] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [selectedModel, setSelectedModel] = useState("gpt-3.5-turbo");
    const [progress, setProgress] = useState(0);

    const { value: progressValue, reset: resetProgress } = useCountUp({
        isCounting: isSending,
        duration: 1,
        start: 0,
        end: progress,
    });

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            Papa.parse(file, {
                complete: (results) => {
                    const filteredData = results.data.filter(row => Object.values(row).some(value => value !== null && value !== ''));
                    setFileData(filteredData);
                    setFileUploaded(true);
                },
                header: true
            });
        }
    };

    const isValidResponseStructure = (response) => {
        const requiredKeys = [
            "questionId", "tag", "model", "question", "answer1", "answer2", "answer3",
            "better_question", "why_better", "rating_Answer1", "explanation_for_rating1",
            "rating_Answer2", "explanation_for_rating2", "rating_Answer3", "explanation_for_rating3"
        ];
        return requiredKeys.every(key => key in response);
    };

    const handleSendData = async () => {
        setIsSending(true);
        for (let i = 0; i < fileData.length; i++) {
            const data = fileData[i];
            if (Object.keys(data).length === 0) continue;
            let isValid = false;
            let response = null;
            while (!isValid) {
                response = await sendData(data);
                if (response !== null && isValidResponseStructure(response)) {
                    isValid = true;
                    setResponses(prevResponses => [...prevResponses, response]);
                    setProgress(Math.round(((i + 1) / fileData.length) * 100));
                } else {
                    console.error('Invalid response structure:', response);
                }
            }
        }
        setIsSending(false);
        alert('Data processing completed!');
    };

    const sendData = async (data) => {
        try {
            console.log("Sending data:", data);
            const response = await fetch('http://localhost:3000/compare', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: data, model: selectedModel }),
            });
            const jsonResponse = await response.json();
            if (jsonResponse.error) {
                console.error('Error in response:', jsonResponse.error);
                return null;
            }
            return jsonResponse.completion;
        } catch (error) {
            console.error('Error sending data: ', error);
            return null;
        }
    };

    const handleDownloadCSV = () => {
        const csv = convertToCSV(responses);
        downloadCSV(csv, 'response_data.csv');
    };

    const handleOpenModal = (content) => {
        setModalContent(content);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setModalContent(null);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '20vh' }}>
            <h1>Insert Data</h1>
            <FormControl variant="outlined" style={{ marginBottom: '20px', minWidth: 120 }}>
                <InputLabel id="select-model-label">Model</InputLabel>
                <Select
                    labelId="select-model-label"
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    label="Model"
                >
                    <MenuItem value="gpt-3.5-turbo">GPT-3.5 Turbo</MenuItem>
                    <MenuItem value="gpt-4">GPT-4</MenuItem>
                </Select>
            </FormControl>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <input
                    accept=".csv, .xml"
                    style={{ display: 'none' }}
                    id="raised-button-file"
                    type="file"
                    onChange={handleFileChange}
                />
                <label htmlFor="raised-button-file">
                    <Button variant="contained" component="span" startIcon={<CloudUploadIcon />}>
                        Upload
                    </Button>
                </label>
                {fileUploaded && <CheckCircleIcon color="success" style={{ marginLeft: 10 }} />}
                <div>{fileUploaded && <Typography style={{ marginLeft: 20 }}>{`Uploaded ${fileData.length} queries to be processed`}</Typography>}</div>
            </div>
            <Button variant="contained" onClick={handleSendData} disabled={!fileUploaded || isSending}>
                Send
            </Button>
            {isSending && (
                <div style={{ marginTop: '20px', position: 'relative', textAlign: 'center' }}>
                    <Typography variant="h6" component="div" color="textSecondary" gutterBottom>
                        Uploading
                    </Typography>
                    <Box position="relative" display="inline-flex">
                        <CircularProgress size={100} variant="determinate" value={progress} />
                        <Box
                            top={0}
                            left={0}
                            bottom={0}
                            right={0}
                            position="absolute"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Typography variant="h6" component="div" color="textSecondary">
                                {progressValue}%
                            </Typography>
                        </Box>
                    </Box>
                </div>
            )}
            <div style={{ width: '80%', marginTop: '20px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                {responses.map((response, index) => (
                    <Card key={index} style={{ margin: '10px', minWidth: '300px', maxWidth: '300px', flex: '1', position: 'relative', backgroundColor: getBackgroundColor(response) }}>
                        <CardContent>
                            <Typography variant="h6">Response {index + 1}</Typography>
                            {['questionId', 'rating_Answer1', 'rating_Answer2', 'rating_Answer3'].map((key) => (
                                <Typography key={key} variant="body2"><strong>{key}:</strong> {response[key]}</Typography>
                            ))}
                            <IconButton
                                onClick={() => handleOpenModal(response)}
                                style={{ position: 'absolute', top: 10, right: 10 }}
                            >
                                <InfoIcon />
                            </IconButton>
                        </CardContent>
                    </Card>
                ))}
            </div>
            {responses.length > 0 && (
                <Button variant="contained" onClick={handleDownloadCSV} style={{ marginTop: '20px' }}>
                    Download CSV
                </Button>
            )}
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box sx={modalStyle}>
                    <Typography id="modal-title" variant="h6" component="h2">
                        Detailed Response
                    </Typography>
                    {modalContent && Object.entries(modalContent).map(([key, value]) => (
                        <Typography key={key} id="modal-description" sx={{ mt: 2 }}>
                            <strong>{key}:</strong> {value}
                        </Typography>
                    ))}
                </Box>
            </Modal>
        </div>
    );
}
