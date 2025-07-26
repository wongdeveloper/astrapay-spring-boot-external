package com.astrapay.service;

import com.astrapay.dto.NoteDto;
import com.astrapay.entity.Note;
import com.astrapay.exception.NoteNotFoundException;

import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.astrapay.repository.NoteRepository;
import java.util.List;

@Service
@Slf4j
public class NoteService {
    private final NoteRepository noteRepository;

    @Autowired
    public NoteService(NoteRepository noteRepository) {
        this.noteRepository = noteRepository;
    }

    public List<Note> getAllNotes() {
        return noteRepository.findAllByOrderByIdDesc();
    }

    public Note createNote(NoteDto note){
        Note newNote = new Note();
        newNote.setContent(note.getContent());
        newNote.setTimestamp(LocalDateTime.now());
        return noteRepository.save(newNote);
    }

    public Note updateNote(long id, NoteDto note) {
        Note existingNote = noteRepository.findById(id).orElseThrow(() -> new NoteNotFoundException("Note not found"));
        existingNote.setContent(note.getContent());
        existingNote.setTimestamp(LocalDateTime.now());
        return noteRepository.save(existingNote);
    }

    public void deleteNote(long id) {
        if(!noteRepository.existsById(id)) {
            throw new NoteNotFoundException("Note not found");
        }
        noteRepository.deleteById(id);
    }
}
