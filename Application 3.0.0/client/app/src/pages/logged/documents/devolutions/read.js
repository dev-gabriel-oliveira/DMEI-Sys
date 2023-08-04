import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { PDFDocument } from 'pdf-lib';
import { confirmAlert } from "react-confirm-alert";

import { Button, Input, InputGroup } from "reactstrap";
import { MdClear, MdOpenInNew } from 'react-icons/md';
import { GrDocumentUpload, GrDocumentDownload } from 'react-icons/gr';
import { RiDeleteBin2Line } from 'react-icons/ri';

import '../../../styles/read.css';
import 'react-confirm-alert/src/react-confirm-alert.css';

export default function Devolutions() {
    const navigate = useNavigate();

    const [page, setPage] = useState(1);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);

    const [devolutionsList, setDevolutionsList] = useState([]);
    const [filterText, setFilterText] = useState("");


    //Getting Devolutions
    useEffect(() => {
        //console.log('page = ',page-1, '\nperPage = ',perPage, '\ntotalRows = ', totalRows);
        let search = "";
        if (filterText === "" || filterText === " ") {
            search = 'null';
        } else {
            search = filterText;
        }
        axios.get(`http://10.10.136.100:3002/api/devolutions/page=${(page-1)}/perPage=${perPage}/search=${search}`,)
        .then((res) => {
            setDevolutionsList(res.data);
        });

        axios.get('http://10.10.136.100:3002/api/devolutions/')
        .then((res) => {
            setTotalRows(res.data.length);
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterText, page, perPage]);


     //Delete Request
     const dialogDelete = (cod) => {
        confirmAlert({
            title: 'Confirme a remoção',
            message: 'Você tem certeza?',
            buttons: [
                {
                label: 'Sim',
                onClick: () => {
                        deleteDevolution(cod);
                        setFilterText(" ");
                    }
                },
                {
                label: 'Não'
                }
            ]
        });
    };
    const deleteDevolution = (cod) => {
        let id = cod.split(' ')[2];
        let year = cod.split(' ')[4];
        axios.delete(`http://10.10.136.100:3002/api/devolutions/${id}/${year}/delete`)
        .then((res) => {
            alert('Devolução removida!');
            setFilterText("");
        });
    }

    //Download Document
    async function downloadDoc(id, documentPath) {
        try {
            const response = await axios.get(`http://10.10.136.100:3002/api/devolutions/download/${encodeURIComponent(documentPath)}`, {
                responseType: 'blob',
            });
            console.log(response);
    
            const blob = new Blob([response.data], { type: 'application/pdf' });
            
            const url = document.createElement('a');
            url.href = URL.createObjectURL(blob);
            console.log(url);
            window.open(url, '_blank');

            URL.revokeObjectURL(url.href);

        } catch (error) {
            console.error('Erro ao fazer o download do arquivo:', error);
        }
    };
    
    const openDevolution = (cod) => {
        const id = cod.split(' ')[2];
        const year = cod.split(' ')[4];
    
        navigate(`/dmei-sys/documents/devolutions/${id}/${year}`);
    }

    const openDevolutionUpload = (cod) => {
        const id = cod.split(' ')[2];
        const year = cod.split(' ')[4];
    
        navigate(`/dmei-sys/documents/devolutions/upload/${id}/${year}`);
    }

    //Add Machine
    const goToAdd = () => {
        navigate(`/dmei-sys/documents/devolutions/create`);
    }

    //Config Table and Search
    const columns = [
        {
            name: 'Id',
            selector: row => row.id,
            width: '20%',
            sortable: true,
            center: 'yes'
        },
        {
            name: 'Texto',
            selector: row => row.content,
            width: '35%',
            center: 'yes'
        },
        {
            name: 'Data',
            selector: row => {
                const date = new Date(row.date);
                const offset = date.getTimezoneOffset();
                date.setMinutes(date.getMinutes() - offset);
                return String(date.toLocaleString('pt-BR', { timeZone: 'UTC' })).slice(0,10);
            },
            width: '15%',
            center: 'yes'
        },
        {
            name: 'Documento',
            selector: row => {
                if (row.document){
                    return (
                        <Button
                            color="warning"
                            onClick={() => downloadDoc(row.id, row.document)}
                        >
                            <GrDocumentDownload/>
                        </Button>
                    )
                } else {
                    return (
                        <Button
                            color="success"
                            onClick={() => openDevolutionUpload(row.id)}
                        >
                            <GrDocumentUpload/>
                        </Button>
                    )
                }},
            width: '10%',
            center: 'yes'
        },
        {
            name: 'Abrir',
            selector: row => <Button
                                color="primary"
                                onClick={() => openDevolution(row.id)}
                            >
                                <MdOpenInNew/>
                            </Button>,
            width: '10%',
            center: 'yes'
        },
        {
            name: 'Remover',
            selector: row => {
                if (JSON.parse(localStorage.getItem("user")).type === 1) {
                    return(
                        <Button
                            color="danger"
                            onClick={() => dialogDelete(row.id)}
                        >
                            <RiDeleteBin2Line/>
                        </Button>)
                } else {
                    return(
                        <Button
                            color="danger"
                            disabled
                        >
                            <RiDeleteBin2Line/>
                        </Button>)
                }
            },
            width: '10%',
            center: 'yes'
        }    
    ];
    const tableData = devolutionsList?.map((obj) => {
      return {
        id: obj.id,
        content: obj.content,
        document: obj.document,
        date: obj.date,
      };
    });

    const handleClear = () => {
        if (filterText) {
        setFilterText("");
        }
    };

    const handlePerRowsChange = (newPerPage) => {
        setPerPage(newPerPage);
    };

    const handlePageChange = (page) => {
        setPage(page);
    };

    return(
        <div className="read">
            <div className='read-title'>
                <h1>Devolução</h1>
                <Button color='primary' onClick={goToAdd}>Adicionar</Button>
            </div>

            <InputGroup className="read-search">
                <Input
                    placeholder='Pesquise aqui'
                    type="text"
                    value={filterText}
                    onChange={(event) => {
                        setFilterText(event.target.value);
                    }}
                />
                <Button onClick={handleClear}>
                    <MdClear/>
                </Button>
            </InputGroup>

            <hr/>
            
            <DataTable
                columns={columns}
                data={tableData}
                pagination
                paginationServer
                paginationTotalRows={totalRows}
                paginationComponentOptions={{
                    rowsPerPageText: 'Filas por página',
                    rangeSeparatorText: 'de',
                    selectAllRowsItem: true,
                    selectAllRowsItemText: 'Todos',
                }}
                paginationRowsPerPageOptions={[5,10,50,100]}
                onChangeRowsPerPage={handlePerRowsChange}
                onChangePage={handlePageChange}
            />
        </div>
    );
};