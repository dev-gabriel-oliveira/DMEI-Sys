import React from 'react';
import { Sidebar, Menu, SubMenu, MenuItem } from 'react-pro-sidebar';
import { AiFillLayout } from 'react-icons/ai';
import { BsCpuFill } from 'react-icons/bs';
import { GoTasklist } from 'react-icons/go';
import { VscServerEnvironment, VscServer, VscServerProcess } from 'react-icons/vsc';
import { GoDiffAdded } from 'react-icons/go';
import { RiHistoryLine } from 'react-icons/ri';
import { FaUsers, FaBuilding, FaListUl, FaCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import useAuth from '../../contexts/useAuth';

import './side-menu.css';

export default function SideMenu() {
    const { signed } = useAuth();

    const navigate = useNavigate();

    if (signed === null) {
        return ('');
    }
    else if (signed.type === 1 || signed.type === 2) {
        return (
            <div className='side-menu'>
                <Sidebar className='side-bar'>
                    <Menu transitionDuration={1000}>
                        <h1 className='title'>DMEIsys</h1>
                        <hr/>

                        <MenuItem
                            icon={<AiFillLayout />}
                            onClick={()=>{navigate(`/dmei-sys/dashboard`)}}>
                            Dashboard
                        </MenuItem>

                        <hr/>
                        <SubMenu label="Entradas" icon={<VscServer />}>
                            <MenuItem
                                icon={<FaListUl />}
                                onClick={()=>{navigate(`/dmei-sys/inputs`)}}>
                                Listar
                            </MenuItem>
                            <MenuItem
                                icon={<GoDiffAdded />}
                                onClick={()=>{navigate(`/dmei-sys/inputs/create`)}}>
                                Adicionar
                            </MenuItem>
                            <MenuItem
                                icon={<GoTasklist />}
                                onClick={()=>{navigate(`/dmei-sys/inputs/terminateds`)}}>
                                Concluídos
                            </MenuItem>
                            <MenuItem
                                icon={<FaCheck />}
                                onClick={()=>{navigate(`/dmei-sys/inputs/terminate`)}}>
                                Finalizar
                            </MenuItem>
                        </SubMenu>

                        <SubMenu label="Externos" icon={<VscServerEnvironment />}>
                            <MenuItem
                                icon={<FaListUl />}
                                onClick={()=>{navigate(`/dmei-sys/externals`)}}>
                                Listar
                            </MenuItem>
                            <MenuItem
                                icon={<GoDiffAdded />}
                                onClick={()=>{navigate(`/dmei-sys/externals/create`)}}>
                                Adicionar
                            </MenuItem>
                        </SubMenu>

                        <SubMenu label="Internos" icon={<VscServerProcess />}>
                            <MenuItem
                                icon={<FaListUl />}
                                onClick={()=>{navigate(`/dmei-sys/internals`)}}>
                                Listar
                            </MenuItem>
                            <MenuItem
                                icon={<GoDiffAdded />}
                                onClick={()=>{navigate(`/dmei-sys/internals/create`)}}>
                                Adicionar
                            </MenuItem>
                        </SubMenu>

                        <hr/>

                        <SubMenu label="Máquinas" icon={<BsCpuFill />}>
                            <MenuItem
                                icon={<FaListUl />}
                                onClick={()=>{navigate(`/dmei-sys/machines`)}}>
                                Listar
                            </MenuItem>
                            <MenuItem
                                icon={<GoDiffAdded />}
                                onClick={()=>{navigate(`/dmei-sys/machines/create`)}}>
                                Adicionar
                            </MenuItem>
                            <MenuItem
                                icon={<RiHistoryLine />}
                                onClick={()=>{navigate(`/dmei-sys/machines/records`)}}>
                                Registros
                            </MenuItem>
                        </SubMenu>

                        <SubMenu label="Entidades" icon={<FaBuilding />}>
                            <MenuItem
                                icon={<FaListUl />}
                                onClick={()=>{navigate(`/dmei-sys/entities`)}}>
                                Listar
                            </MenuItem>
                            <MenuItem
                                icon={<GoDiffAdded />}
                                onClick={()=>{navigate(`/dmei-sys/entities/create`)}}>
                                Adicionar
                            </MenuItem>
                        </SubMenu>

                        <SubMenu label="Usuários" icon={<FaUsers />}>
                            <MenuItem
                                icon={<FaListUl />}
                                onClick={()=>{navigate(`/dmei-sys/users`)}}>
                                Listar
                            </MenuItem>
                            
                            {JSON.parse(localStorage.getItem("user")).type === 1 ? (
                                <MenuItem
                                    icon={<GoDiffAdded />}
                                    onClick={()=>{navigate(`/dmei-sys/users/create`)}}>
                                    Adicionar
                                </MenuItem>
                            ) : (
                                <MenuItem
                                    icon={<GoDiffAdded />}
                                    disabled>
                                    Adicionar
                                </MenuItem>
                            )}
                        </SubMenu>

                        <hr/>
                    </Menu>
                </Sidebar>
            </div>
        )
    }
    else if (signed.type === 3) {
        return (
            <div className='side-menu'>
                <Sidebar className='side-bar'>
                    <Menu transitionDuration={1000}>
                        <h1 className='title'>DMEIsys</h1>
                        <hr/>

                        <MenuItem
                            icon={<AiFillLayout />}
                            onClick={()=>{navigate(`/dmei-sys/anon/dashboard`)}}>
                            Dashboard
                        </MenuItem>

                        <hr/>

                        <SubMenu label="Externos" icon={<VscServerEnvironment />}>
                            <MenuItem
                                icon={<FaListUl />}
                                onClick={()=>{navigate(`/dmei-sys/anon/externals`)}}>
                                Listar
                            </MenuItem>
                        </SubMenu>

                        <hr/>
                    </Menu>
                </Sidebar>
            </div>
        )
    }
};