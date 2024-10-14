import Header from "../../components/Header";
import DrawingArea from "../../components/Canvas/DrawingArea";
import axios from "axios";
import { useEffect, useState } from "react";
import { CircularProgress, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;
const details = { height: null, width: null };

function PracticeDrawing() {
    const [drawingItem, setDrawingItem] = useState(null);
    const [drawing, setDrawing] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(API_URL + '/get-drawing-item', {
            headers: {
                Authorization: localStorage.getItem('token')
            }
        })
            .then((response) => {
                const data = response.data;
                setDrawingItem(data['drawingItem']);
            }).catch((err) => {
                // Auth error
                if (err.response.status === 401 || err.response.status === 403) {
                    navigate('/login');
                }
                // Server error
                if (err.response.status >= 500 || err.response.status < 600) {
                    setError(err.response.data.message);
                }
            })
    }, [])

    const onDrawingSubmit = () => {
        axios.post(API_URL + '/practice-drawing', drawing, {
            headers: {
                Authorization: localStorage.getItem('token')
            }
        })
            .then((response) => {
                const data = response.data
                return data.json();
            })
            .then((data) => {

            })
            .catch((err) => { console.error(err) })
    }

    return <>
        <Header />

        {
            drawingItem && (
                <div style={{ display: 'flex', height: 'calc(100vh - 100px)', width: '100vw', justifyContent: 'center', alignItems: 'space' }}>
                    <DrawingArea details={{ ...details, drawingItem, setDrawing }} onDrawingSubmit={onDrawingSubmit} />
                </div>
            )
        }

        {
            !error && !drawingItem && (
                <div style={{ display: 'flex', height: 'calc(100vh - 100px)', width: '100vw', justifyContent: 'center', alignItems: 'space' }}>
                    <CircularProgress />
                </div>
            )
        }

        {
            error && !drawingItem && (
                <div style={{ display: 'flex', height: 'calc(100vh - 100px)', width: '100vw', justifyContent: 'center', alignItems: 'space' }}>
                    <Typography color={'red'}>
                        {error}
                    </Typography>
                </div>
            )
        }
    </>
}

export default PracticeDrawing;