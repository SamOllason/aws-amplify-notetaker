import React, { Component } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react'
import { createNote, deleteNote } from './graphql/mutations';
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

    handleAddNote = async event => {
        // prevents the default action, which is to reload the page
        event.preventDefault();

        const { note, id, notes } = this.state;

        const input = { note };

        // run the mutation to add the note and, once this is complete, store the returned data (the note we added)
        const result = await API.graphql(graphqlOperation(createNote, { input }));

        // use result from mutation to update UI
        // and check to see if the note is actually a new one or just an
        // updated version of an existing one
        const newNote = result.data.createNote;

        const hasUpdatedExistingNote = id && notes.some(n => n.id === id)

        // update state:
        if(hasUpdatedExistingNote) {
            // remove the old version of note user has modified in state, add new note
            const updatedNotes = [newNote, ...notes.filter(n => n.id !== id)]
            this.setState({notes: updatedNotes, note:''});
        } else {
            // if here then user wasn't updating an existing
            const updatedNotes = [newNote, ...notes];
            this.setState({notes: updatedNotes, note:''});
        }
    };

    handleDeleteNote = async nodeId => {
        const input = { id: nodeId }

        // call the deleteNode mutation
        const result = await API.graphql(graphqlOperation(deleteNote, { input}))

        // use the Id to filter out the notes in our states to update the UI
        const deletedNodeId = result.data.deleteNote.id;

        const { notes } = this.state;

        const updatedNotes =  notes.filter(note => note.id !== deletedNodeId)

        this.setState({notes: updatedNotes});
    }

    handleSetNote = ({ note, id }) => this.setState({note, id})

    render() {
        const { notes, note } = this.state;
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
                        Add Note
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
