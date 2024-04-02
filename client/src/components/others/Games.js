import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';

let pageDetails = { page: 0, limit: 5 }

function GameHistory() {
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const divRef = useRef(null);

  divRef.onscroll = () => {

  }

  useEffect(() => {
    if (data !== null) return;

    axios.get(API_URL + '/games', {
      headers: {
        Authorization: localStorage.getItem('token')
      }, params: {
        page: pageDetails.page,
        limit: pageDetails.limit
      }
    }).then((res) => {
      setData(res.data);
    }).catch(() => {
      navigate('/login');
    })

  }, [])

  return (
    <div>
      <Header />
      {
        !data&&(
          <></>
        )
      }
      {
        data && (
          <div ref={divRef} >

          </div>
        )
      }
    </div>
  )
}

export default GameHistory