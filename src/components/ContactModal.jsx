import React, {useEffect, useState} from 'react';
import {Form, InputGroup, Modal} from 'react-bootstrap';
import ButtonComponent from './ButtonComponent';
import axios from 'axios';

export default function ContactModal(props) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [codename, setCodename] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    const [firstNameError, setFirstNameError] = useState(false);
    const [lastNameError, setLastNameError] = useState(false);
    const [codenameError, setCodenameError] = useState(false);
    const [phoneNumberError1, setPhoneNumberError1] = useState(false);
    const [phoneNumberError2, setPhoneNumberError2] = useState(false);

    function closeModal() {
        props.toggle();
    }

    function handleClose() {
        closeModal();
        props.setId(0);
    }

    function handleSubmit() {
        if (validate()) {
            return;
        }
        if (props.type === "A") {
            postContact();
        } else if (props.type === "C") {
            updateContact();
        } else {
            alert("ERROR SUBMITTING INPUT!");
        }
    }

    function validate() {
        let invalid = false;

        if (firstName === "") {
            setFirstNameError(true);
            invalid = true;
        } else setFirstNameError(false);

        if (lastName === "") {
            setLastNameError(true);
            invalid = true;
        } else setLastNameError(false);

        if (codename === "") {
            setCodenameError(true);
            invalid = true;
        } else setCodenameError(false);

        if (phoneNumber === "") {
            setPhoneNumberError1(true);
            invalid = true;
        } else {
            setPhoneNumberError1(false);
            if (!phoneNumber.match("^\\+(?:\\d\\s?){6,14}\\d$")) {
                setPhoneNumberError2(true);
                invalid = true;
            } else setPhoneNumberError2(false);
        }

        return invalid;
    }

    function fetchContactById(id) {
        axios.get("/get", {params: {id: id}})
            .then(response => {
                    setFirstName(response.data.firstName);
                    setLastName(response.data.lastName);
                    setCodename(response.data.codename);
                    setPhoneNumber(response.data.phoneNumber);
                }
            )
            .catch(error => {
                console.log(error);
            });
    }

    function postContact() {
        let contact = {};
        contact.firstName = firstName;
        contact.lastName = lastName;
        contact.codename = codename;
        contact.phoneNumber = phoneNumber;

        axios.post("/post", contact)
            .then(() => {
                props.fetch();
                closeModal();
            })
            .catch(error => {
                // window.alert("Check form fields!");
                console.log(error);
            })
    }

    function updateContact() {
        let contact = {};
        contact.firstName = firstName;
        contact.lastName = lastName;
        contact.codename = codename;
        contact.phoneNumber = phoneNumber;

        axios.put("/update", contact, {params: {id: props.id}})
            .then(() => {
                props.fetch();
                closeModal();
            })
            .catch(error => {
                // window.alert("Check form fields!");
                console.log(error)
            });
    }

    useEffect(() => {
        if (props.type === "C") {
            fetchContactById(props.id);
        }
    }, [props.type, props.id]);

    return (
        <>
            <Modal
                show={props.show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form
                        id={"clientForm"}
                    >
                        {firstNameError &&
                            <div className={"small text-danger"}> First name is required!</div>
                        }
                        <InputGroup className="mb-3">
                            <InputGroup.Text id="firstName" required>First Name:</InputGroup.Text>
                            <Form.Control
                                name="firstName"
                                defaultValue={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                aria-describedby="firstName"
                                aria-label="First name"
                                required={true}/>
                        </InputGroup>
                        {lastNameError &&
                            <div className={"small text-danger"}> Last name is required!</div>
                        }
                        <InputGroup className="mb-3">
                            <InputGroup.Text id="lastName">Last Name:</InputGroup.Text>
                            <Form.Control
                                name="lastName"
                                defaultValue={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                aria-describedby="lastName"
                                aria-label="Last name"
                                required
                            />
                        </InputGroup>
                        {codenameError &&
                            <div className={"small text-danger"}> Codename is required!</div>
                        }
                        <InputGroup className="mb-3">
                            <InputGroup.Text id="codename">Codename:</InputGroup.Text>
                            <Form.Control
                                name="codename"
                                defaultValue={codename}
                                onChange={(e) => setCodename(e.target.value)}
                                aria-describedby="codename"
                                aria-label="Codename"
                                required
                            />
                        </InputGroup>
                        {phoneNumberError1 &&
                            <div className={"small text-danger"}> Phone number is required!</div>
                        }
                        {phoneNumberError2 &&
                            <div className={"small text-danger"}> Invalid phone number format!</div>
                        }
                        <div className={"small text-secondary"}> Must include country code!</div>
                        <InputGroup className="mb-3">
                            <InputGroup.Text id="phoneNumber">Phone Number:</InputGroup.Text>
                            <Form.Control
                                name="phoneNumber"
                                defaultValue={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                aria-describedby="phoneNumber"
                                aria-label="Phone number"
                                required
                            />
                        </InputGroup>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <ButtonComponent
                        name={"Submit"}
                        variant={"outline-primary"}
                        handleClick={() => {
                            handleSubmit()
                        }}/>
                    <ButtonComponent
                        name={"Cancel"}
                        variant={"outline-secondary"}
                        handleClick={() => {
                            handleClose()
                        }}/>
                </Modal.Footer>
            </Modal>
        </>
    );
}
