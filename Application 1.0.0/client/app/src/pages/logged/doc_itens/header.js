import React from "react";
import SEMEC from "./SEMEC.png";

import '../../styles/read-one.css';

export default function DocumentHeader() {
    return(
        <div style={{display:'flex', justifyContent:'center'}}>
            <img alt="" src={SEMEC} width='94px' height='43px'/>

            <p style={{fontSize: "8px", textAlign:"left", marginLeft:'10px', marginBottom:'5px'}}>
                PREFEITURA MUNICIPAL DE TERESINA
                <br/>
                SECRETARIA MUNICIPAL DA EDUCAÇÃO E CULTURA - SEMEC
                <br/>
                DIVISÃO DE MANUTENÇÃO EM EQUIPAMENTOS DE INFORMÁTICA - DMEI
                <br/>
                RUA: LISANDRO NOGUEIRA,1790 CENTRO-NORTE
                <br/>
                TEL: (86)3221-9044 / 3215-7975 / 218
            </p>
        </div>
    );
};