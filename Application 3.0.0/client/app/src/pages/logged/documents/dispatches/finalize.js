import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Select from 'react-select';

import { Button, Card, CardBody, Form, Input, Label } from "reactstrap";

import '../../../styles/create-update.css';

export default function DispatchUpload() {
    //Verificação de Carregamento Único
    const [ver] = useState(1);

    const navigate = useNavigate();

    const [dispatch, setDispatch] = useState("");
    const [dispatchList, setDispatchList] = useState([]);

    const [machines, setMachines] = useState(null);

    const [dispatch_doc, setDispatch_doc] = useState(null);
    const [docSelected, setDocSelected] = useState(null);

    //Get the Dispatch data
    useEffect(() => {
        axios.get(`http://10.10.136.100:3002/api/dispatches/doc-null`)
        .then((res) => {
            setDispatchList(res.data?.map((obj) => {
                return {
                    value: obj.id,
                    label: obj.id
                }
            }));
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ver]);

    //Get the Machines data
    useEffect(() => {
        if (dispatch !== ""){
            let id = dispatch.value.split(' ')[2];
            let year = dispatch.value.split(' ')[4];

            axios.get(`http://10.10.136.100:3002/api/dispatches/${id}/${year}/itens`)
            .then((res) => {
                setMachines(res.data);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    //Confirm Dispatch
    const dispatchMachine = () => {
        //Alert if there is Empty Fields
        if (dispatch_doc === null) {
            alert('Erro, o campo Documento está vazio!');
        }
        else{
            let id = dispatch.value.split(' ')[2];
            let year = dispatch.value.split(' ')[4];

            axios.patch(`http://10.10.136.100:3002/api/dispatches/create/doc/${id}/${year}`, dispatch_doc, {
                headers: {
                'Content-Type': 'multipart/form-data'
                }
            })
            .then((r) => {
                for (let count = 0; count < machines.length; count++) {
                    axios.patch(`http://10.10.136.100:3002/api/machines/${machines[count].id_machine_dis}/dispatch`)
                    .then((r) => {
                        //console.log(r);
                    })
                    .catch((e) => {
                        alert('Erro de Conexão com o Banco!');
                    });
                }
                alert('Despachado com sucesso!');
                navigate(`/dmei-sys/documents/dispatches`)
            })
            .catch((e) => {
                alert('Erro de Conexão com o Banco!');
            });
        };
    };

    //Cancel Dispatch
    const cancelDispatch = () => {
        navigate(`/dmei-sys/documents/dispatches`);
    }

    return(
        <div className="read-one">
            <h1>Despacho</h1>
            <h4>Guardar Laudo</h4>

            <hr/>

            <Card color="light" outline>
                <CardBody>
                    <Label>Despacho:</Label>
                    <Select
                        placeholder='Código do Despacho...'
                        options={dispatchList}
                        defaultValue={dispatch}
                        value={dispatch}
                        onChange={setDispatch}
                    />
                </CardBody>
                <br/>
            </Card>

            {machines !== null ? (
                <Form className="form-create-update">
                    <hr/>
                    <h5><strong>{dispatch.value}</strong></h5>
                    <hr/>
                    
                    <Card color="light" outline>
                        <CardBody>
                            <Label>Laudo de Despacho:</Label>
                            <Input
                                placeholder="Laudo de Despacho"
                                type="file"
                                name="file"
                                accept="application/pdf"
                                onChange={(event) =>{
                                    if (!event.target.value === true) {
                                        setDispatch_doc(null);
                                        setDocSelected(null);
                                    } else {
                                        const file = event.target.files[0];
                                        const formData = new FormData();
                                        formData.append('file', file);
                                        setDispatch_doc(formData);
                                        setDocSelected(event.target.value);
                                    }
                                }}
                            />

                            <hr/>

                            {docSelected ? (
                                <p>Documento carregado! Finalize para despachar a Máquina</p>
                            ) : (
                                <p>Carregue o Laudo de Despacho para despachar a Máquina</p>
                            )}
                        </CardBody>
                        <br/>
                    </Card>

                    <hr/>
                    
                    {docSelected ? (
                        <Button color="success" onClick={dispatchMachine}>Finalizar</Button>
                    ) : ("")}
                </Form>
            ) : ('')}

            <hr/>

            <Form className="form-read-one">
                <Button color="secondary" onClick={cancelDispatch}>Cancelar</Button>
            </Form>
        </div>
    );
};