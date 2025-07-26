package com.astrapay.controller;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.astrapay.dto.NoteDto;
import com.astrapay.entity.Note;
import com.astrapay.exception.NoteNotFoundException;
import com.astrapay.service.NoteService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
@RequestMapping("/api/notes")
@CrossOrigin("http://localhost:4200")
public class NoteController {
    private final NoteService noteService;

    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }

    @GetMapping()
    public ResponseEntity<List<Note>> getAllNotes(@RequestParam(required = false) String keyword) {
        List<Note> notes = noteService.getAllNotes().stream()
                .filter(note -> keyword == null || note.getContent().toLowerCase().contains(keyword.toLowerCase()))
                .toList();
        return ResponseEntity.ok(notes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Note> getNoteById(@PathVariable long id) {
        Note note = noteService.getAllNotes().stream()
                .filter(n -> n.getId() == id)
                .findFirst()
                .orElseThrow(() -> new NoteNotFoundException("Note not found"));
        return ResponseEntity.ok(note);
    }

    @PostMapping()
    public ResponseEntity<Note> createNote(@RequestBody NoteDto entity) {
        NoteDto noteDto = new NoteDto();
        noteDto.setContent(entity.getContent());
        Note createdNote = noteService.createNote(noteDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdNote);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Note> updateNote(@PathVariable long id, @RequestBody NoteDto entity) {
        NoteDto noteDto = new NoteDto();
        noteDto.setContent(entity.getContent());
        Note updatedNote = noteService.updateNote(id, noteDto);
        return ResponseEntity.ok(updatedNote);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNote(@PathVariable long id) {
        noteService.deleteNote(id);
        return ResponseEntity.noContent().build();
    }

    
}
 