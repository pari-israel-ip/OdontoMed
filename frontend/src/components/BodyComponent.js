import React from 'react';
import {
    Box,
    Heading,
    VStack,
    Text,
    List,
    ListItem,
    Container,
    Button,
    Flex,
    Image
} from '@chakra-ui/react';
import { motion } from 'framer-motion'; // Para animaciones

// Framer Motion Components
const MotionBox = motion(Box);
const MotionHeading = motion(Heading);
const MotionText = motion(Text);
const MotionButton = motion(Button);
const MotionListItem = motion(ListItem);

// Primera Sección: Banner con Animación
function InfoCollection() {
    return (
        <MotionBox
            bgImage="url('https://wallpapers.com/images/hd/dentistry-1920-x-1080-background-tggdb4qtgswxqu55.jpg')"
            bgSize="cover"
            bgPosition="center"
            py={32}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            width="100%"
        >
            <Container maxW="container.xl">
                <VStack
                    spacing={6}
                    bg="rgba(255, 255, 255, 0.8)" // Fondo semitransparente
                    p={10}
                    borderRadius="md"
                    boxShadow="2xl"
                    align="center"
                >
                    <MotionText
                        fontSize={{ base: '2xl', md: '4xl' }}
                        fontWeight="bold"
                        color="#319795"
                        textAlign="center"
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 1 }}
                    >
                        BIENVENIDO A ODOMED
                    </MotionText>
                    <MotionText
                        fontSize={{ base: 'md', md: 'lg' }}
                        color="gray.700"
                        textAlign="center"
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 1.2 }}
                    >
                        Donde el cuidado bucal se combina con la excelencia y la tecnología avanzada para brindar una experiencia inolvidable.
                    </MotionText>
                    <MotionButton
                        bg="#319795"
                        color="white"
                        size="lg"
                        _hover={{ bg: "#287066" }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })}
                    >
                        Explorar Servicios
                    </MotionButton>
                </VStack>
            </Container>
        </MotionBox>
    );
}

// Segunda Sección: Servicios
function ServicesCollection() {
    return (
        <Box
            id="services-section" // Agrega el ID aquí
            bgImage="url('https://wallpapers.com/images/hd/dentistry-7680-x-4320-background-6da47vdw5amhts87.jpg')"
            bgSize="cover"
            bgPosition="center"
            py={32}
            width="100%"
        >
            <Container maxW="container.xl">
                <MotionBox
                
                    bg="rgba(255, 255, 255, 0.9)"
                    p={10}
                    borderRadius="md"
                    boxShadow="2xl"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <Flex
                        direction={{ base: 'column', md: 'row' }}
                        alignItems="flex-start"
                        justifyContent="space-between"
                        gap={10}
                    >
                        {/* Columna izquierda: Título y descripción */}
                        <VStack align="flex-start" spacing={6} maxW="md">
                            <MotionHeading
                                as="h2"
                                size="xl"
                                color="#319795"
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                Nuestros Servicios
                            </MotionHeading>
                            <MotionText
                                fontSize="lg"
                                color="gray.700"
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 1, delay: 0.3 }}
                            >
                                En Odomed, ofrecemos una amplia gama de servicios dentales para satisfacer todas tus necesidades de salud bucal.
                            </MotionText>
                        </VStack>

                        {/* Lista de servicios */}
                        <VStack align="flex-start" spacing={3}>
                            <List spacing={3} fontSize="lg" color="gray.700">
                                {[
                                    'Odontología Preventiva',
                                    'Tratamientos de Emergencia',
                                    'Odontología Restauradora',
                                    'Odontología Cosmética',
                                    'Ortodoncia',
                                    'Cirugía Oral'
                                ].map((item, index) => (
                                    <MotionListItem
                                        key={index}
                                        initial={{ opacity: 0, x: 50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 1, delay: index * 0.2 }}
                                    >
                                        - {item}
                                    </MotionListItem>
                                ))}
                            </List>
                        </VStack>
                    </Flex>
                </MotionBox>
            </Container>
        </Box>
    );
}

// Tercera Sección: Testimonios
function TestimonialsCollection() {
    return (
        <Box py={20} bg="white" width="100%">
            <Container maxW="container.xl" textAlign="center">
                <Heading as="h2" size="xl" color="#319795" mb={10}>
                    Lo Que Dicen Nuestros Pacientes
                </Heading>
                <Flex direction={{ base: 'column', md: 'row' }} spacing={10} justify="space-between">
                    <VStack
                        bg="gray.50"
                        p={6}
                        borderRadius="md"
                        boxShadow="lg"
                        spacing={4}
                        maxW="sm"
                        textAlign="left"
                    >
                        <Text fontSize="lg" color="gray.700">
                            “Un servicio excepcional y un equipo profesional que siempre cuida de mi sonrisa. ¡Altamente recomendados!”
                        </Text>
                        <Text fontWeight="bold" color="#319795">
                            - María López
                        </Text>
                    </VStack>
                    <VStack
                        bg="gray.50"
                        p={6}
                        borderRadius="md"
                        boxShadow="lg"
                        spacing={4}
                        maxW="sm"
                        textAlign="left"
                    >
                        <Text fontSize="lg" color="gray.700">
                            “La mejor experiencia dental que he tenido. Tecnología avanzada y atención personalizada.”
                        </Text>
                        <Text fontWeight="bold" color="#319795">
                            - Juan Pérez
                        </Text>
                    </VStack>
                </Flex>
            </Container>
        </Box>
    );
}

// Componente Principal
function BodyComponent() {
    return (
        <>
            <InfoCollection />
            <ServicesCollection />
            <TestimonialsCollection />
        </>
    );
}

export default BodyComponent;
