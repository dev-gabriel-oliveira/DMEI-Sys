import { React, useEffect, useState } from "react";
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function TechnicianGraph() {
  const [ver, setVer] = useState(true);
  const [calls, setCalls] = useState([]);

  //Getting users
  useEffect(() => {
    axios.get(`http://10.10.136.100:3002/api/calls`,)
    .then((res) => {
      setCalls(res.data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ver]);

  //Reload after 5 seconds
  setTimeout(() => {
    setVer(!ver);
  }, 5000);

  const data = calls?.map((obj) => {
    return {
      name: obj.username,
      Concluídos: obj.score,
    };
  });

  return (
    <ResponsiveContainer width={"100%"} height={500}>
      <BarChart
        layout='vertical'
        width={'100%'}
        height={500}
        data={data}
        margin={{
          top: 30,
          right: 60,
          left: 60,
          bottom: 10,
        }}
      >
        <CartesianGrid strokeDasharray='2 2' layout={'vertical'} />
        <XAxis dataKey="Concluídos" type='number'/>
        <YAxis dataKey="name" type="category"/>
        <Tooltip />
        <Legend />
        <Bar dataKey="Concluídos" fill="#0070BC" />
      </BarChart>
    </ResponsiveContainer>
  );
}
