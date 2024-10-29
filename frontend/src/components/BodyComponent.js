import React from 'react';
import { Box, Heading, VStack, Text, List, ListItem, Container, Button, HStack, Flex } from '@chakra-ui/react';


// Primer Collection: Información principal de la clínica
function InfoCollection() {
    return (
        <Box
            bgImage="url('/path-to-your-background-image.jpg')" // Reemplaza con la ruta de tu imagen
            bgSize="cover"
            bgPosition="center"
            py={20}
            width="100%"
        >
            <Container maxW="container.lg">
                <VStack
                    spacing={6}
                    bg="rgba(255, 255, 255, 0.8)" // Fondo semitransparente para el texto
                    p={10}
                    borderRadius="md"
                    boxShadow="lg"
                >
                    <Text fontSize="3xl" fontWeight="bold" color="#319795" textAlign="center">
                        ESTUDIO DENTAL DE PRIMER NIVEL EN LA CIUDAD DE LA PAZ
                    </Text>
                    <Text fontSize="lg" color="gray.700" textAlign="center">
                        Cuando se trata de salud bucal, déjalo en manos de la práctica que te trate como si fueras de la familia.
                    </Text>
                </VStack>
            </Container>
        </Box>
    );
}

// Segundo Collection: Servicios de la clínica
function ServicesCollection() {
    return (
        <Box py={20} bg="gray.50" width="100%">
            <Container maxW="container.lg">
                <Flex
                    direction={{ base: 'column', md: 'row' }} // Para que se ajuste a dispositivos móviles y pantallas grandes
                    alignItems="center"
                    justifyContent="space-between"
                >
                    {/* Columna izquierda: Descripción y botón */}
                    <VStack align="flex-start" spacing={6} maxW="md">
                        <Heading as="h2" size="xl" color="#319795" textAlign="left">
                            Servicios
                        </Heading>
                        <Text fontSize="lg" color="gray.700">
                            En OdoMed todo está a disposición suya, los pacientes pueden esperar visitar un consultorio avanzado, acogedor y verdaderamente completo.
                        </Text>
                        <Button colorScheme="teal" size="md">
                            Reservar ahora
                        </Button>
                    </VStack>

                    {/* Columna derecha: Lista de servicios */}
                    <VStack align="flex-start" spacing={3} mt={{ base: 8, md: 0 }}>
                        <List spacing={2} pl={4}>
                            <ListItem>- ODONTOLOGIA PREVENTIVA</ListItem>
                            <ListItem>- TRATAMIENTOS DE EMERGENCIA</ListItem>
                            <ListItem>- ODONTOLOGIA RESTAURADORA</ListItem>
                            <ListItem>- ODONTOLOGIA COSMETICA</ListItem>
                            <ListItem>- ORTODONCIA</ListItem>
                            <ListItem>- CIRUGIA ORAL</ListItem>
                        </List>
                    </VStack>
                </Flex>
            </Container>
        </Box>
    );
}


// Componente principal que une los Collections
function BodyComponent() {
    return (
        <>
            <InfoCollection />
            <ServicesCollection />
            {/* Aquí se pueden agregar más Collections en el futuro */}
        </>
    );
}

export default BodyComponent;
