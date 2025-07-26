import { Component, OnInit } from '@angular/core';
import { Note } from './note.model';
import { NoteService } from './note.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  Title: string = 'Simple Notes';
  notes: Note[] = [];
  newNoteContent: string = '';
  searchKeyword: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  editingNoteId: number | null = null;
  editingNoteContent: string = '';

  constructor(private noteService: NoteService) {}

  ngOnInit(): void {
    this.fetchNotes();
  }

  fetchNotes(): void {
    this.isLoading = true;
    this.noteService.getNotes(this.searchKeyword).subscribe({
      next: (notes) => {
        this.notes = notes;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load notes, ' + error.message;
        console.error(error);
        this.isLoading = false;
      }
    });
  }

  addNote(): void {
    if (!this.newNoteContent.trim()){
      this.errorMessage = 'Note content cannot be empty.';
      return;
    }
    this.isLoading = true;
    const newNote = {
      content: this.newNoteContent,
    };
    
    this.noteService.createNote(newNote).subscribe({
      next: () => {
        this.newNoteContent = '';
        this.searchKeyword = '';
        this.fetchNotes();
      },
      error: (error) => {
        this.errorMessage = 'Failed to create note, ' + error.message;
        console.error(error);
        this.isLoading = false;
      }
    });
  }

  deleteNote(id: number): void {
    if (!confirm('Are you sure you want to delete this note?')) {
      return;
    }

    this.isLoading = true;
    this.noteService.deleteNote(id).subscribe({
      next: () => {
        this.fetchNotes();
      },
      error: (error) => {
        this.errorMessage = 'Failed to delete note, ' + error.message;
        console.error(error);
        this.isLoading = false;
      }
    });
  }

  startEdit(note: Note): void {
    this.editingNoteId = note.id;
    this.editingNoteContent = note.content;
  }

  cancelEdit(): void {
    this.editingNoteId = null;
    this.editingNoteContent = '';
  }

  saveEdit(note: Note): void {
    if (!this.editingNoteContent.trim()) {
      this.errorMessage = 'Note content cannot be empty.';
      return;
    }

    const updatedNote: Note = { ...this.notes.find(n => n.id === this.editingNoteId)!, content: this.editingNoteContent, timestamp: new Date().toISOString() };

    this.isLoading = true;
    this.noteService.updateNote(note.id, { content: note.content}).subscribe({
      next: () => {
        this.cancelEdit();
        this.fetchNotes();
      },
      error: (error) => {
        this.errorMessage = 'Failed to update note, ' + error.message;
        console.error(error);
        this.isLoading = false;
      }
    });
  }
}
