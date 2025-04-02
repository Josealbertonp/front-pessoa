import React from 'react';
import { TextField } from '@mui/material';

const SearchInput = ({ search, onSearchChange }) => {
  return (
    <TextField
      label="Buscar"
      variant="outlined"
      value={search}
      onChange={onSearchChange}
      style={{ marginBottom: '16px', width: '50%' }}
    />
  );
};

export default SearchInput;
