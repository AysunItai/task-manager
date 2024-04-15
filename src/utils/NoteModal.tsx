// NoteModal.tsx
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

interface NoteModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    onSave: (note: string) => void;
    currentNote: string;
}

const NoteModal: React.FC<NoteModalProps> = ({
    isOpen,
    onRequestClose,
    onSave,
    currentNote,
}) => {
    const [note, setNote] = useState(currentNote);

    // Update the local state when the currentNote prop changes
    useEffect(() => {
        setNote(currentNote);
    }, [currentNote]);

    const handleSave = () => {
        onSave(note);
        onRequestClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Edit Note"
            // Add your styling here or in CSS
        >
            <h2>Edit Note</h2>
            <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                style={{ width: '100%', height: '200px' }} // Style as needed
            />
            <button onClick={handleSave}>Save</button>
            <button onClick={onRequestClose}>Cancel</button>
        </Modal>
    );
};

export default NoteModal;
