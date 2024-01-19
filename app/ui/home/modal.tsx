'use client'

import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import ButtonWrapper from "./region-detail-buttons";

export default function Modals() {
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
        size="lg" 
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-eeeeee">Modal Title</ModalHeader>
              <div className="mb-4">
                <ButtonWrapper></ButtonWrapper>
              </div>
              <ModalBody className="text-eeeeee">
                <p> 
                Helm's Deep, a key location in J.R.R. Tolkien's "The Lord of the Rings," has a rich history that intertwines with the narrative of Middle Earth. Known as the Hornburg, it is a fortress in the White Mountains, located in the realm of Rohan.

The history of Helm's Deep is deeply connected to the story of Helm Hammerhand, the ninth King of Rohan. During the Long Winter, a devastating period of famine and cold, Rohan was invaded by the Dunlendings under Wulf, their chieftain. Helm's sons were killed, and Helm himself retreated to the fortress, which subsequently came to be known as Helm's Deep. During the siege, Helm would go out into the enemy camp and blow his horn, and his ghostly figure, along with the echoes of the horn in the Deep, struck fear into the hearts of the Dunlendings. Helm died during the winter, standing alone and frozen at the Dike. After his death, his nephew Frealáf drove out the Dunlendings, and Helm's Deep became a symbol of the resilience and strength of Rohan.

In "The Two Towers," the second volume of "The Lord of the Rings," Helm's Deep is the site of a major battle, the Battle of Helm's Deep. The fortress, thought to be impenetrable, is attacked by Saruman's Uruk-hai and Dunlendings. The defenders, primarily Rohirrim with a small contingent of Elves (in the film adaptation), are vastly outnumbered. Despite the odds, they manage to hold out until the arrival of Gandalf, who leads a force of Riders of Rohan to break the siege. This battle is a turning point in the War of the Ring, marking the beginning of Saruman's downfall and a significant victory for the forces of good.

Following the War of the Ring, Helm's Deep is repaired and continues to serve as a stronghold of Rohan. It stands as a testament to the bravery and resilience of the Rohirrim, embodying the spirit of resistance against overwhelming odds.

In essence, Helm's Deep's history is a tapestry of courage, resilience, and hope against despair. Its significance, both historical and symbolic, resonates deeply within the narrative and thematic framework of "The Lord of the Rings."
                </p>
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