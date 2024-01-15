import React, {useEffect, useState} from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, {Search} from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import "bootstrap/dist/css/bootstrap.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css';
import ButtonComponent from './ButtonComponent';
import ContactModal from './ContactModal';
import axios from 'axios';

const {SearchBar} = Search;
export default function TableComponent() {
    const [showModal, setShowModal] = useState(false);
    const [contacts, setContacts] = useState([]);
    const [actionType, setActionType] = useState("");
    const [modalTitle, setModalTitle] = useState("");
    const [id, setId] = useState(0);
    const columns = [
        {dataField: "id", text: "ID", sort: true},
        {dataField: "firstName", text: "First Name", sort: true},
        {dataField: "lastName", text: "Last Name", sort: true},
        {dataField: "codename", text: "Codename", sort: true},
        {dataField: "phoneNumber", text: "Phone Number"},
        {dataField: "change", text: "Change", formatter: changeButton},
        {dataField: "delete", text: "Delete", formatter: deleteButton},
    ];

    function toggleModal() {
        setShowModal(!showModal);
    }

    function handleClickAdd() {
        setActionType("A")
        setModalTitle("Add contact")
        setShowModal(true);
    }

    function handleClickChange(id) {
        setId(id);
        setModalTitle("Change contact");
        setActionType("C");
        setShowModal(true);
    }

    function handleClickDelete(id) {
        if (window.confirm("Are you sure you want to delete this contact?")) {
            deleteContact(id);
        }
    }

    function changeButton(cell, row, rowIndex, FormatExtraData) {
        return <ButtonComponent
            name={"Change"}
            variant={"outline-secondary"}
            handleClick={() => {
                handleClickChange(row.id);
            }}
        />
    }

    function deleteButton(cell, row, rowIndex, FormatExtraData) {
        return <ButtonComponent
            name={"Delete"}
            variant={"outline-danger"}
            handleClick={() => {
                handleClickDelete(row.id);
            }}
        />
    }

    function fetchContacts() {
        axios.get("/all")
            .then(response => {
                    setContacts(response.data);
                }
            )
            .catch(error => {
                console.log(error);
                window.alert("Something went wrong!");
            });
    }

    function deleteContact(id) {
        axios.delete("/delete", {params: {id: id}})
            .then(() => {
                fetchContacts();
            })
            .catch(error => {
                console.log(error.response.data)
                window.alert("Something went wrong!");
            });
    }

    useEffect(() => {
        fetchContacts();
    }, []);

    return (
        <>
            <ToolkitProvider
                bootstrap4
                keyField="id"
                data={contacts}
                columns={columns}
                search
            >
                {props => (
                    <div>
                        <SearchBar
                            {...props.searchProps}
                            style={{width: "400px", height: "40px"}}
                            srText={false}
                        />
                        <BootstrapTable
                            {...props.baseProps}
                            noDataIndication="There is no result"
                            striped
                            hover
                            defaultSorted={[{dataField: "id", order: "asc"}]}
                            pagination={paginationFactory({sizePerPage: 10})}
                        />
                    </div>
                )}
            </ToolkitProvider>
            <ButtonComponent
                name={"Add"}
                variant={"outline-primary"}
                handleClick={() => {
                    handleClickAdd();
                }}
            />
            {showModal &&
                <ContactModal
                    type={actionType}
                    title={modalTitle}
                    show={showModal}
                    id={id}
                    setId={setId}
                    fetch={fetchContacts}
                    toggle={toggleModal}
                />
            }
        </>
    )
}
