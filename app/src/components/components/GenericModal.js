import React from "react";
import Modal from "react-native-modal";

/**
 *
 * @param {*} onOpen Callback to be executed when modal will show
 * @param {*} onClose Callback to be executed when modal will close
 * @param {*} open Boolean indicating if modal is visible
 *
 *
 */
const GenericModal = ({ open, onOpen, onClose, children }) => {
  return (
    <Modal
      useNativeDriver
      animationType="slide"
      onModalWillShow={onOpen && onOpen()}
      onModalWillHide={onClose && onClose()}
      isVisible={open}
      backdropColor="rgba(0,0,0,0.5)"
    >
      {children}
    </Modal>
  );
};

export default GenericModal;
