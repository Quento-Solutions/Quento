import {Notes, Subjects, Suggestions} from '~/types'
import { Note } from '~/types/notes';

let note : Notes.Note;

describe("Note Create Test", () => {
    beforeEach(() => {
        note = Note.fromFirebase({
            createdAt : new Date(0),
            grade : 10,
            title : "Title",
            uid : "WIOEFJ",
            subject : "Business",
            upVotes : 23,
            userDisplayName : "TESTER",
            views : 23,
            contents : "# THIS IS THE MD CONTENT",
           userPhotoUrl : "" 
        })
    });
    test("Testing Note Date", () => {
        expect(note.title).toEqual("Title");
    })
})

