import React from 'react';
import {Button} from 'react-bootstrap';

export default function ButtonComponent({name, variant, type, formId, handleClick}) {
    return (
        <Button
            form={formId}
            type={type}
            variant={variant}
            onClick={handleClick}
        >
            {name}
        </Button>
    );
}
