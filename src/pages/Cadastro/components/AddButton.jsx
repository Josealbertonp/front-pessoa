import React from 'react';
import { Button } from '@mui/material';

const AddButton = ({ onClick }) => {
  return (
    <div className="flex justify-end mb-5">
      <Button 
        variant="contained" 
        color="primary" 
        onClick={onClick}
      >
        Adicionar
      </Button>
    </div>
  );
};

export default AddButton;
