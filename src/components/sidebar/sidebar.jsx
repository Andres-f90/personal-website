import { Link } from "react-router-dom";
import {
    IconButton,
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure,
    Button
} from '@chakra-ui/react'
import {useRef} from "react";
import { HamburgerIcon } from '@chakra-ui/icons'

function Sidebar() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = useRef()

    return (
        <>
            <IconButton aria-label='Search database' icon={<HamburgerIcon />} onClick={onOpen} />

            <Drawer
                isOpen={isOpen}
                placement='left'
                onClose={onClose}
                finalFocusRef={btnRef}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Create your account</DrawerHeader>

                    <DrawerBody>
                        <li>
                            <Link to={`/projects`} onClick={onClose}>Projects</Link>
                        </li>
                        <li>
                            <Link to={`/about`} onClick={onClose}>About Me</Link>
                        </li>
                    </DrawerBody>

                    <DrawerFooter>
                        <Button variant='outline' mr={3} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button colorScheme='blue'>Save</Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>

        </>
    );
}

export default Sidebar;