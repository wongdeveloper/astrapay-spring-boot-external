import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Note } from "./note.model";
import { environment } from "../environments/environment";

@Injectable({
    providedIn: "root"
})
export class NoteService {
    private apiUrl = environment.apiUrl + "/notes";
    constructor(private http: HttpClient) {}

    getNotes(keyword: string = ''): Observable<Note[]> {
        let params = new HttpParams();
        if (keyword) {
            params = params.append('keyword', keyword);
        }
        return this.http.get<Note[]>(this.apiUrl, { params });
    }

    getNoteById(id: number): Observable<Note> {
        return this.http.get<Note>(`${this.apiUrl}/${id}`);
    }

    createNote(note: { content: string }): Observable<Note> {
        return this.http.post<Note>(this.apiUrl, note);
    }

    updateNote(id: number, note: {content: string}): Observable<Note> {
        return this.http.patch<Note>(`${this.apiUrl}/${id}`, note);
    }

    deleteNote(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

}