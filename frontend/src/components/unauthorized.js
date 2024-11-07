import React from 'react';
import { Box, Text } from '@chakra-ui/react';

const Unauthorized = () => {
    return (
        <Box p={4}>
            <Text fontSize="xl" color="red.500">No tienes permiso para acceder a esta página.</Text>
        </Box>
    );
};

export default Unauthorized;
