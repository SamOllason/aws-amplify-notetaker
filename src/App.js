import React, { Component } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react'
import { createNote, deleteNote, updateNote} from './graphql/mutations';
import { listNotes } from './graphql/queries';

class App extends Component {
    state = {
        note: '',
        id: '',
        notes: [{
            id: 1,
            note: "Hello World"
        }]
    };

    async componentDidMount(){
        const result = await API.graphql(graphqlOperation(listNotes))
        this.setState({
            notes: result.data.listNotes.items
        })
    }

    handleChangeNote = event => this.setState({ note: event.target.value });

    handleCreateNote = async (note, notes) => {
        const input = { note };

        // run the mutation to add the note and, once this is complete, store the returned data (the note we added)
        const result = await API.graphql(graphqlOperation(createNote, { input }));

        // use result from mutation to update UI
        // and check to see if the note is actually a new one or just an
        // updated version of an existing one
        const newNote = result.data.createNote;

        // if here then user wasn't updating an existing
        const updatedNotes = [newNote, ...notes];
        this.setState({notes: updatedNotes, note:''});
    }

    handleUpdateNote = async (note, id, notes ) => {
        const input = { id, note };

        // call API to update note,
        // find the location of the note in the notes array and
        // 'swap it' for updatedNote in note array and update state

        const updateResult = await API.graphql(graphqlOperation(updateNote, { input }));
        const updatedNote = updateResult.data.updateNote

        const index = notes.findIndex(n => n.id === id)

        // remove 'old' entry at index and insert new entry in that place
        const updatedNotes = [
          ...notes.slice(0, index),
            updatedNote,
          ...notes.slice(index + 1)
        ]

        this.setState({notes: updatedNotes, note:'', id: ''});
    }

    handleAddNote = async event => {
        // prevents the default action, which is to reload the page
        event.preventDefault();

        const { note, id, notes } = this.state;

        const hasUpdatedExistingNote = id !== '' && notes.some(n => n.id === id)

        if (hasUpdatedExistingNote) {
            await this.handleUpdateNote(note, id, notes)
        } else {
            await this.handleCreateNote(note, notes)
        }
    }

    handleDeleteNote = async nodeId => {
        const input = { id: nodeId }

        // call the deleteNode mutation
        const result = await API.graphql(graphqlOperation(deleteNote, { input}))

        // use the id to filter out the notes in our states to update the UI
        const deletedNodeId = result.data.deleteNote.id;

        const { notes } = this.state;

        const updatedNotes =  notes.filter(note => note.id !== deletedNodeId)

        this.setState({notes: updatedNotes});
    }

    handleSetNote = ({ note, id }) => this.setState({note, id})

    render() {
        const { notes, note, id } = this.state;
        return (
            <div className="flex flex-column items-center justify-0center pa3 bg-washed-red">
                <h1 className="code f2-l">Amplify Notetaker</h1>

                {/*Note form*/}
                <form className="mb3" onSubmit={this.handleAddNote}>
                    <input type="text"
                           className="pa2 f4"
                           placeholder="Write your note"
                           onChange={this.handleChangeNote}
                           value={note}
                    />
                    <button className="pa2 f4" type="submit">
                        { id ? 'Update Note' : 'Add Note' }
                    </button>
                </form>

                {/*Notes list*/}
                <div>
                    {notes.map(item => (
                        <div key={item.id} className="flex items-center">
                            <li onClick={() => this.handleSetNote(item)} className="list pa1 f3">
                                {item.note}
                            </li>
                          {/* Remember to make this an arrow function - since we are adding arguments we need to add '()' */}
                          {/* but we dont want this to run on page load! */}
                            <button onClick={() => this.handleDeleteNote(item.id)} className="bg-transparent bn f4">&times;</button>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

}

export default withAuthenticator(App, { includeGreetings: true });
