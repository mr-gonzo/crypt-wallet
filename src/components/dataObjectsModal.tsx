import React, { useState } from 'react';
import CommitToBlockChain from './commitToBlockchainButton'; // Your existing component
import styles from '@/styles/dataObjectsModal.module.css'


const DataObjectsModal: React.FC<{ dataObjects: DataObject[] }> = ({ dataObjects }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const currentDataObject = dataObjects[currentIndex];

  const handleNext = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < dataObjects.length) {
      setCurrentIndex(nextIndex);
    } else {
      setShowModal(false); // Close modal if there are no more objects
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setCurrentIndex(0); // Reset to the first object or any desired behavior
  };

  return (
    <div>
      <button onClick={() => setShowModal(true)}>Review Transactions</button>
      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            {/* Display current data object information */}
            <pre>{JSON.stringify(currentDataObject, null, 2)}</pre>
            {/* CommitToBlockChain component expects a single DataObject */}
            <CommitToBlockChain data={currentDataObject} />
            <button onClick={handleNext}>Skip</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataObjectsModal;