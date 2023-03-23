import { React, useEffect, useState } from "react";
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { PDFDocument } from 'pdf-lib';

import { Button, Form, Input, UncontrolledPopover, PopoverHeader, PopoverBody } from "reactstrap";
import { MdClear } from "react-icons/md";
import { GrDocumentPdf, GrTextAlignCenter } from 'react-icons/gr';

import '../../styles/read.css';
import 'react-confirm-alert/src/react-confirm-alert.css';

export default function Records() {

    const [page, setPage] = useState(1);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);

    const [recordsList, setRecordsList] = useState([]);
    const [filterText, setFilterText] = useState("");

    //Getting records
    useEffect(() => {
        console.log('page = ',page-1, '\nperPage = ',perPage, '\ntotalRows = ', totalRows);

        axios.get(`http://10.10.136.100:3002/api/records/page=${(page-1)}/perPage=${perPage}`,)
        .then((res) => {
            console.log(res)
            setRecordsList(res.data);
        });

        axios.get('http://10.10.136.100:3002/api/records/')
        .then((res) => {
            setTotalRows(res.data.length);
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterText, page, perPage]);

    //Download Deactivate Document
    async function downloadDeadDoc(buffer, id) {
        const pdfDoc = await PDFDocument.load(new Uint8Array(buffer.data));
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `M-${id}-LAUDO(Assinado).pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    //Config Table and Search
    const columns = [
        {
            name: 'Registro',
            id: 'id',
            selector: row => row.id,
            width: '100px',
            center: 'yes'
        },
        {
            name: 'Máquina N/S',
            selector: row => row.machine_serial,
            center: 'yes'
        },
        {
            name: 'Entidade',
            selector: row => row.entity,
            center: 'yes'
        },
        {
            name: 'Data e Hora',
            selector: row => {
                const date = new Date(row.date);
                const offset = date.getTimezoneOffset();
                date.setMinutes(date.getMinutes() - offset);
                return String(date.toLocaleString('pt-BR', { timeZone: 'UTC' }));
            },
            sortable: true,
            center: 'yes'
        },
        {
            name: 'Ação',
            selector: row => row.action,
            width: '140px',
            center: 'yes'
        },
        {
            name: 'Documento',
            selector: row => row.action === "Desativado" ?
                            (<Button
                                title="Laudo Assinado"
                                color="warning"
                                style={{fontFamily:'FontAll'}}
                                onClick={() => {downloadDeadDoc(row.deactivate_doc, row.machine_id)}}
                            >
                                <GrDocumentPdf/>
                            </Button>) : ("- - - -"),
            width: '100px',
            center: 'yes'
        },
        {
            name: 'Obs',
            selector: row => row.action === "Desativado" || row.action === "Aguardando" ?
                            (<>
                            <Button id={`Popover${row.id}`} type="button" title="Observação">
                                <GrTextAlignCenter/>
                            </Button>
                            <br></br>
                            <UncontrolledPopover
                                placement="left"
                                target={`Popover${row.id}`}
                                trigger="click">
                                <PopoverHeader>Observação</PopoverHeader>
                                <PopoverBody>{row.observation}</PopoverBody>
                            </UncontrolledPopover>
                            </>) : ("- - - -"),
            width: '100px',
            center: 'yes'
        },
    ];
    const tableData = recordsList?.filter(
      (record) =>
        String(record.machine) && String(record.machine).toLowerCase().includes(filterText.toLowerCase())
    )
    .map((record) => {
      return {
        id: record.id,
        machine_id: record.machine_id,
        machine_serial: record.machine_serial,
        entity: record.entity,
        date: record.date,
        action: record.action,
        deactivate_doc: record.deactivate_doc,
        observation: record.observation
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
                <h1>Registros</h1>
                <br/>
            </div>

            <Form className="read-search">
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
            </Form>

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
                paginationRowsPerPageOptions={[2,10,50,100]}
                defaultSortFieldId={'id'}
                defaultSortAsc={false}
                onChangeRowsPerPage={handlePerRowsChange}
                onChangePage={handlePageChange}
            />
        </div>
    );
};