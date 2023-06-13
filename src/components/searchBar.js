import React, { useState } from 'react';
import { Container, Input } from 'semantic-ui-react';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
    onSearch(searchTerm);
  };

  return (
    <Container textAlign="center">
      <Input 
        fluid
        transparent
        size='large'
        placeholder="Build your lineage..."
        value={searchTerm}
        onChange={handleSearch}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSearch();
          }
        }}
      />
    </Container>
  );
};

export default SearchBar;
