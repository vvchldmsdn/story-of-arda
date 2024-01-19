'use client'

import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import {ScrollShadow} from "@nextui-org/react";
import ButtonWrapper from "./region-detail-buttons";
import { firaSans } from "@/app/lib/fonts";

export default function Modals({ regionName, regionDescription }: { regionName: string, regionDescription: string}) {

  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  return (
    <div className="absolute top-0 right-0 mt-4 mr-4">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-ardayellow" onClick={onOpen}>
        <path fillRule="evenodd" d="M15 3.75a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0V5.56l-3.97 3.97a.75.75 0 1 1-1.06-1.06l3.97-3.97h-2.69a.75.75 0 0 1-.75-.75Zm-12 0A.75.75 0 0 1 3.75 3h4.5a.75.75 0 0 1 0 1.5H5.56l3.97 3.97a.75.75 0 0 1-1.06 1.06L4.5 5.56v2.69a.75.75 0 0 1-1.5 0v-4.5Zm11.47 11.78a.75.75 0 1 1 1.06-1.06l3.97 3.97v-2.69a.75.75 0 0 1 1.5 0v4.5a.75.75 0 0 1-.75.75h-4.5a.75.75 0 0 1 0-1.5h2.69l-3.97-3.97Zm-4.94-1.06a.75.75 0 0 1 0 1.06L5.56 19.5h2.69a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 1 1.5 0v2.69l3.97-3.97a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
      </svg>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange} 
        backdrop="blur" 
        className="bg-backblack" 
        size="xl" 
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-eeeeee text-center text-3xl mb-4">{regionName}</ModalHeader>
              <div className="mb-4">
                <ButtonWrapper></ButtonWrapper>
              </div>
              <ModalBody className="text-eeeeee">
                <ScrollShadow hideScrollBar>
                  <p className={`text-eeeeee whitespace-pre-line ${firaSans.className}`}> 
                    {regionDescription}
                  </p>
                </ScrollShadow>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}