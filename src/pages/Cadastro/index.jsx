import React from 'react';
import { styled } from '@mui/material/styles';
import UserRegistration from './components/UserRegistration';

const StyledPaper = styled('div')(({ theme }) => ({
    width: '90%',
    height: '90%',
    marginTop: '15px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    padding: theme.spacing(2),
    overflow: 'hidden',
}));

const EditableTable = () => {

    return (
        <div style={{ height: '90vh', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
            <StyledPaper>
                <UserRegistration />
            </StyledPaper>
        </div>
    );
};

export default EditableTable;
